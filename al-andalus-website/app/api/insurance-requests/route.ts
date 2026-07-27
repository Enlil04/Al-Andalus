import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";
import {
  sanitizeText,
  sendInsuranceQuoteNotification,
} from "@/lib/email/formNotifications";
import { isValidEmail, isValidPhone } from "@/lib/formValidation";
import { clientKey, rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "insurance"), {
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

    const fullName = sanitizeText(data.fullName ?? data.name, 200);
    const email = sanitizeText(data.email, 200);
    const phone = sanitizeText(data.phone, 50);
    const company = sanitizeText(data.company, 200);
    const budget = sanitizeText(data.budget, 100);
    const city = sanitizeText(data.city, 100);
    const details = sanitizeText(data.details ?? data.message, 5000);

    if (!fullName || !email || !phone || !data.insuranceService) {
      return NextResponse.json(
        {
          error:
            "Full name, email, phone, and insurance service are required.",
        },
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

    let insuranceServiceId: string | number = data.insuranceService;
    if (typeof insuranceServiceId === "string" && !/^\d+$/.test(insuranceServiceId)) {
      const { docs } = await payload.find({
        collection: "products",
        limit: 1,
        overrideAccess: true,
        where: {
          or: [
            { slug: { equals: insuranceServiceId } },
            { titleEn: { equals: insuranceServiceId } },
            { titleAr: { equals: insuranceServiceId } },
          ],
        },
      });
      if (!docs.length) {
        return NextResponse.json(
          { error: "Selected insurance service is not available." },
          { status: 400 },
        );
      }
      insuranceServiceId = docs[0].id;
    }

    let serviceLabel = sanitizeText(data.insuranceService, 200);
    try {
      const product = await payload.findByID({
        collection: "products",
        id: insuranceServiceId,
        overrideAccess: true,
      });
      const title =
        (product as { titleEn?: string; titleAr?: string }).titleEn ||
        (product as { titleAr?: string }).titleAr;
      if (title) {
        serviceLabel = title;
      }
    } catch {
      // Keep the submitted service id/slug as the email label.
    }

    // Prefer an explicit message; otherwise include city in project details.
    const projectDetails = [
      details,
      city && !details.includes(city) ? `Preferred branch / city: ${city}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    await payload.create({
      collection: "insurance-requests",
      overrideAccess: true,
      data: {
        fullName,
        email,
        phone,
        insuranceService: insuranceServiceId,
        city,
        details,
        status: "new",
      },
    });

    // Dashboard save is primary; email failure should not block the visitor.
    try {
      await sendInsuranceQuoteNotification(payload, {
        fullName,
        email,
        phone,
        company,
        service: serviceLabel,
        budget,
        message: projectDetails,
      });
    } catch (emailError) {
      console.error("Insurance quote email notification failed:", emailError);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Insurance Request Error:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting the request." },
      { status: 500 },
    );
  }
}
