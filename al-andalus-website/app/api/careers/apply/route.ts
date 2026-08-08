import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";
import path from "path";
import { clientKey, rateLimit } from "@/lib/rateLimit";
import {
  sanitizeText,
  sendJobApplicationNotification,
} from "@/lib/email/formNotifications";
import { isValidEmail, isValidPhone } from "@/lib/formValidation";
import { validateCvUpload } from "@/lib/cvFileValidation";

const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 MB

type OpenJob = { id: string; title: string };

function jobTitleFromDoc(doc: Record<string, unknown>): string {
  for (const key of ["titleEn", "titleAr", "title"]) {
    const value = doc[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim().slice(0, 200);
    }
  }
  const title = doc.title;
  if (title && typeof title === "object") {
    const localized = title as Record<string, unknown>;
    for (const key of ["en", "ar"]) {
      const value = localized[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim().slice(0, 200);
      }
    }
  }
  return "Job opening";
}

function asRelationId(id: string): string | number {
  return /^\d+$/.test(id) ? Number(id) : id;
}

async function resolveOpenJob(
  payload: Awaited<ReturnType<typeof getPayload>>,
  job: FormDataEntryValue | null,
  jobSlug: FormDataEntryValue | null,
): Promise<OpenJob | null> {
  if (job) {
    try {
      const doc = await payload.findByID({
        collection: "jobs",
        id: String(job),
        overrideAccess: true,
      });
      if (doc && (doc as { status?: string }).status === "open") {
        return {
          id: String(doc.id),
          title: jobTitleFromDoc(doc as Record<string, unknown>),
        };
      }
    } catch {
      // Invalid ID or missing doc — fall through to slug lookup.
    }
  }

  if (!jobSlug) {
    return null;
  }

  const { docs } = await payload.find({
    collection: "jobs",
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        { slug: { equals: String(jobSlug) } },
        { status: { equals: "open" } },
      ],
    },
  });

  const match = docs[0] as Record<string, unknown> | undefined;
  if (!match) return null;

  return { id: String(match.id), title: jobTitleFromDoc(match) };
}

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "careers"), {
    limit: 3,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  let documentId: string | number | null = null;
  let payload: Awaited<ReturnType<typeof getPayload>> | null = null;

  try {
    const formData = await request.formData();
    payload = await getPayload({ config: configPromise });

    const job = formData.get("job");
    const jobSlug = formData.get("jobSlug");
    const fullName = sanitizeText(formData.get("fullName"), 200);
    const email = sanitizeText(formData.get("email"), 200);
    const phone = sanitizeText(formData.get("phone"), 50);
    const coverLetter = sanitizeText(formData.get("coverLetter"), 5000);
    const cv = formData.get("cv");

    if (!fullName || !email || !phone || !cv || !(cv instanceof File)) {
      return NextResponse.json(
        { error: "Name, email, phone, and CV file are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "A valid phone number is required." },
        { status: 400 },
      );
    }

    if (cv.size > MAX_CV_BYTES) {
      return NextResponse.json(
        { error: "CV must be 5 MB or smaller." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await cv.arrayBuffer());
    const cvCheck = validateCvUpload({
      filename: cv.name || "resume.pdf",
      mimeType: cv.type,
      buffer,
    });
    if (!cvCheck.ok) {
      return NextResponse.json({ error: cvCheck.error }, { status: 400 });
    }

    const openJob = await resolveOpenJob(payload, job, jobSlug);
    if (!openJob) {
      return NextResponse.json(
        { error: "This job opening is not available." },
        { status: 400 },
      );
    }

    const safeUploadName = path.basename(cv.name || `resume.${cvCheck.kind}`);

    const document = await payload.create({
      collection: "documents",
      overrideAccess: true,
      data: {
        title: `${fullName.slice(0, 100)} CV`,
      },
      file: {
        data: buffer,
        mimetype: cvCheck.mimeType,
        name: safeUploadName,
        size: buffer.length,
      },
    });
    documentId = document.id;

    const applicationData = {
      fullName,
      email,
      phone,
      cv: document.id,
      status: "new" as const,
      jobTitle: openJob.title,
      ...(coverLetter ? { coverLetter } : {}),
    };

    try {
      await payload.create({
        collection: "job-applications",
        overrideAccess: true,
        data: {
          ...applicationData,
          job: asRelationId(openJob.id),
        },
      });
    } catch (createError) {
      // Relationship validation can still fail under some access setups;
      // keep the application with the denormalized job title.
      console.error(
        "Job application create with job relation failed; retrying without relation:",
        createError,
      );
      await payload.create({
        collection: "job-applications",
        overrideAccess: true,
        data: applicationData,
      });
    }

    try {
      await sendJobApplicationNotification(payload, {
        fullName,
        email,
        phone,
        jobTitle: openJob.title,
        coverLetter,
        resume: {
          filename: safeUploadName,
          content: buffer,
          contentType: cvCheck.mimeType,
        },
      });
    } catch (emailError) {
      console.error("Job application email notification failed:", emailError);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (payload && documentId != null) {
      try {
        await payload.delete({
          collection: "documents",
          id: documentId,
          overrideAccess: true,
        });
      } catch (cleanupError) {
        console.error("Failed to clean up orphaned CV document:", cleanupError);
      }
    }
    console.error("Job Application Error:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting the application." },
      { status: 500 },
    );
  }
}
