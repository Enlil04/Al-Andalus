import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";
import { sendContactNotification } from "@/lib/contactEmail";
import { clientKey, rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "contact"), {
    limit: 5,
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
    const data = await request.json();
    const payload = await getPayload({ config: configPromise });

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    const submission = {
      name: String(data.name).slice(0, 200),
      email: String(data.email).slice(0, 200),
      phone: data.phone ? String(data.phone).slice(0, 50) : "",
      subject: data.subject
        ? String(data.subject).slice(0, 200)
        : "New Contact Form Submission",
      message: String(data.message).slice(0, 5000),
    };

    await payload.create({
      collection: "contact-messages",
      overrideAccess: true,
      data: {
        ...submission,
        isRead: false,
      },
    });

    // Dashboard save is primary; email failure should not block the visitor.
    try {
      await sendContactNotification(payload, submission);
    } catch (emailError) {
      console.error("Contact email notification failed:", emailError);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting the form." },
      { status: 500 },
    );
  }
}
