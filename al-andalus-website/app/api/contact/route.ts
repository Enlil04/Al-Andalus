import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";
import {
  sanitizeText,
  sendContactNotification,
} from "@/lib/email/formNotifications";
import { isValidEmail, isValidPhone } from "@/lib/formValidation";
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

    const name = sanitizeText(data.name, 200);
    const email = sanitizeText(data.email, 200);
    const message = sanitizeText(data.message, 5000);
    const phone = sanitizeText(data.phone, 50);
    const company = sanitizeText(data.company, 200);
    const subject =
      sanitizeText(data.subject, 200) || "New Contact Form Submission";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }

    if (phone && !isValidPhone(phone, { required: false })) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 },
      );
    }

    const submission = {
      name,
      email,
      phone,
      subject,
      message,
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
      await sendContactNotification(payload, {
        ...submission,
        company,
      });
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
