import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";
import { clientKey, rateLimit } from "@/lib/rateLimit";
import { sendJobApplicationNotification } from "@/lib/jobApplicationEmail";

const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 MB

async function resolveJobId(
  payload: Awaited<ReturnType<typeof getPayload>>,
  job: FormDataEntryValue | null,
  jobSlug: FormDataEntryValue | null,
): Promise<string | null> {
  if (job) {
    return String(job);
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

  const match = docs[0];
  return match ? String(match.id) : null;
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

  try {
    const formData = await request.formData();
    const payload = await getPayload({ config: configPromise });

    const job = formData.get("job");
    const jobSlug = formData.get("jobSlug");
    const jobTitle = formData.get("jobTitle");
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const cv = formData.get("cv");

    if (!fullName || !email || !phone || !cv || !(cv instanceof File)) {
      return NextResponse.json(
        { error: "Name, email, phone, and CV file are required." },
        { status: 400 },
      );
    }

    const resolvedJobId = await resolveJobId(payload, job, jobSlug);
    const resolvedJobTitle = jobTitle
      ? String(jobTitle).slice(0, 200)
      : "";

    if (!resolvedJobId && !resolvedJobTitle) {
      return NextResponse.json(
        { error: "Job information is missing." },
        { status: 400 },
      );
    }

    if (cv.size > MAX_CV_BYTES) {
      return NextResponse.json(
        { error: "CV must be 5 MB or smaller." },
        { status: 400 },
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const lowerName = cv.name.toLowerCase();
    const hasAllowedExtension = allowedExtensions.some((ext) =>
      lowerName.endsWith(ext),
    );
    const hasAllowedMime = !cv.type || allowedTypes.includes(cv.type);
    if (!hasAllowedExtension || !hasAllowedMime) {
      return NextResponse.json(
        { error: "CV must be a PDF or Word document." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await cv.arrayBuffer());
    const document = await payload.create({
      collection: "documents",
      overrideAccess: true,
      data: {
        title: `${String(fullName).slice(0, 100)} CV`,
      },
      file: {
        data: buffer,
        mimetype: cv.type || "application/pdf",
        name: cv.name,
        size: cv.size,
      },
    });

    const applicationData = {
      fullName: String(fullName).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: String(phone).slice(0, 50),
      cv: document.id,
      status: "new" as const,
      ...(resolvedJobId ? { job: resolvedJobId } : {}),
      ...(resolvedJobTitle ? { jobTitle: resolvedJobTitle } : {}),
    };

    await payload.create({
      collection: "job-applications",
      overrideAccess: true,
      data: applicationData,
    });

    try {
      await sendJobApplicationNotification(payload, {
        fullName: applicationData.fullName,
        email: applicationData.email,
        phone: applicationData.phone,
        jobTitle: resolvedJobTitle || "Job opening",
      });
    } catch (emailError) {
      console.error("Job application email notification failed:", emailError);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Job Application Error:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting the application." },
      { status: 500 },
    );
  }
}
