/**
 * Validate CV uploads by extension, MIME, and magic bytes.
 */

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_EXT = [".pdf", ".doc", ".docx"] as const;

export type CvKind = "pdf" | "doc" | "docx";

function extensionOf(filename: string): string {
  const lower = filename.trim().toLowerCase();
  const dot = lower.lastIndexOf(".");
  return dot >= 0 ? lower.slice(dot) : "";
}

export function detectCvKind(buffer: Buffer): CvKind | null {
  if (buffer.length < 4) return null;

  // PDF
  if (buffer.subarray(0, 4).toString("ascii") === "%PDF") {
    return "pdf";
  }

  // Legacy OLE Word (.doc)
  if (
    buffer.length >= 8 &&
    buffer[0] === 0xd0 &&
    buffer[1] === 0xcf &&
    buffer[2] === 0x11 &&
    buffer[3] === 0xe0 &&
    buffer[4] === 0xa1 &&
    buffer[5] === 0xb1 &&
    buffer[6] === 0x1a &&
    buffer[7] === 0xe1
  ) {
    return "doc";
  }

  // DOCX is a ZIP package
  if (
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07) &&
    (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08)
  ) {
    return "docx";
  }

  return null;
}

export function validateCvUpload(input: {
  filename: string;
  mimeType: string;
  buffer: Buffer;
}): { ok: true; kind: CvKind; mimeType: string } | { ok: false; error: string } {
  const ext = extensionOf(input.filename);
  if (!ALLOWED_EXT.includes(ext as (typeof ALLOWED_EXT)[number])) {
    return { ok: false, error: "CV must be a PDF or Word document." };
  }

  const mime = (input.mimeType || "").trim().toLowerCase();
  if (!mime || !ALLOWED_MIME.has(mime)) {
    return { ok: false, error: "CV must be a PDF or Word document." };
  }

  const kind = detectCvKind(input.buffer);
  if (!kind) {
    return { ok: false, error: "CV file contents are invalid or unsupported." };
  }

  if (ext === ".pdf" && kind !== "pdf") {
    return { ok: false, error: "CV file contents are invalid or unsupported." };
  }
  if (ext === ".doc" && kind !== "doc") {
    return { ok: false, error: "CV file contents are invalid or unsupported." };
  }
  if (ext === ".docx" && kind !== "docx") {
    return { ok: false, error: "CV file contents are invalid or unsupported." };
  }

  // Prefer sniffed type for storage when client MIME is loose.
  const mimeType =
    kind === "pdf"
      ? "application/pdf"
      : kind === "doc"
        ? "application/msword"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  return { ok: true, kind, mimeType };
}
