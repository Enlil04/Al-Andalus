import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { resolvePrivateMediaPath } from "@/lib/safePrivateMediaPath";

type Params = { params: Promise<{ token: string }> };

/**
 * Token-gated PDF download — avoids exposing proposal media via public /media URLs.
 */
export async function GET(_request: Request, { params }: Params) {
  const { token } = await params;

  if (!token || token.length < 16) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const payload = await getPayload({ config: configPromise });

    const { docs } = await payload.find({
      collection: "proposals",
      depth: 1,
      limit: 1,
      overrideAccess: true,
      where: {
        and: [
          { token: { equals: token } },
          { status: { equals: "active" } },
        ],
      },
    });

    if (!docs.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const proposal = docs[0];
    const pdf = proposal.pdf;

    if (!pdf || typeof pdf === "string" || typeof pdf === "number") {
      return NextResponse.json({ error: "No document" }, { status: 404 });
    }

    const filename = pdf.filename;
    if (!filename) {
      return NextResponse.json({ error: "No document" }, { status: 404 });
    }

    const filePath = resolvePrivateMediaPath(filename);
    if (!filePath) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = await fs.readFile(filePath);
    const downloadName = path.basename(filename).replace(/["\r\n]/g, "");

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": pdf.mimeType || "application/pdf",
        "Content-Disposition": `inline; filename="${downloadName}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Proposal file error:", error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
