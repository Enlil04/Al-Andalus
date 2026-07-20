import { NextResponse } from "next/server";
import { resolveDownloadTarget } from "@/lib/appDownload";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ua = request.headers.get("user-agent");
  const { url } = await resolveDownloadTarget(ua);

  return NextResponse.redirect(url, 302);
}
