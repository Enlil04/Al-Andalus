import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

    const result = await payload.create({
      collection: "insurance-requests",
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        insuranceService: data.insuranceService,
        city: data.city || "",
        details: data.details || "",
        status: "new",
      },
    });

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error) {
    console.error("Insurance Request Error:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting the request." },
      { status: 500 },
    );
  }
}
