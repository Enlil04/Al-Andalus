import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

    const buffer = Buffer.from(await cv.arrayBuffer());
    const media = await payload.create({
      collection: "media",
      data: {
        alt: `${fullName} CV`,
      },
      file: {
        data: buffer,
        mimetype: cv.type || "application/pdf",
        name: cv.name,
        size: cv.size,
      },
    });

    const result = await payload.create({
      collection: "job-applications",
      data: {
        job: String(job),
        fullName: String(fullName),
        email: String(email),
        phone: String(phone),
        coverLetter: coverLetter ? String(coverLetter) : "",
        cv: media.id,
        status: "new",
      },
    });

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error) {
    console.error("Job Application Error:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting the application." },
      { status: 500 },
    );
  }
}
