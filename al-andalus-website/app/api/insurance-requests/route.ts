import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";
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

    if (!data.fullName || !data.email || !data.phone || !data.insuranceService) {
      return NextResponse.json(
        {
          error:
            "Full name, email, phone, and insurance service are required.",
        },
        { status: 400 },
      );
    }

    await payload.create({
      collection: "insurance-requests",
      overrideAccess: true,
      data: {
        fullName: String(data.fullName).slice(0, 200),
        email: String(data.email).slice(0, 200),
        phone: String(data.phone).slice(0, 50),
        insuranceService: data.insuranceService,
        city: data.city ? String(data.city).slice(0, 100) : "",
        details: data.details ? String(data.details).slice(0, 5000) : "",
        status: "new",
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Insurance Request Error:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting the request." },
      { status: 500 },
    );
  }
}
