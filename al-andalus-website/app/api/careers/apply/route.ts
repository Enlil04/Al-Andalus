import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";
import { clientKey, rateLimit } from "@/lib/rateLimit";

const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 MB

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
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const coverLetter = formData.get("coverLetter");
    const cv = formData.get("cv");

    if (!job || !fullName || !email || !phone || !cv || !(cv instanceof File)) {
      return NextResponse.json(
        { error: "Job, name, email, phone, and CV file are required." },
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
    // Require a known extension; MIME alone is easy to spoof and empty MIME
    // previously bypassed validation entirely.
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

    await payload.create({
      collection: "job-applications",
      overrideAccess: true,
      data: {
        job: String(job),
        fullName: String(fullName).slice(0, 200),
        email: String(email).slice(0, 200),
        phone: String(phone).slice(0, 50),
        coverLetter: coverLetter ? String(coverLetter).slice(0, 5000) : "",
        cv: document.id,
        status: "new",
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Job Application Error:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting the application." },
      { status: 500 },
    );
  }
}
