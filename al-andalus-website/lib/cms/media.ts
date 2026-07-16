type MediaDoc = {
  url?: string | null;
  filename?: string | null;
};

/**
 * Prefer the public static path (`/media/...`) so Next can serve files
 * without going through Payload's file API (which 500s when the volume
 * is missing the file, and breaks `next/image` optimization).
 */
export function getMediaUrl(
  media: string | MediaDoc | null | undefined,
): string | null {
  if (!media || typeof media === "string") return null;

  if (media.filename) {
    return `/media/${encodeURIComponent(media.filename).replace(/%2F/gi, "/")}`;
  }

  const url = media.url ?? null;
  if (!url) return null;

  const apiPrefix = "/api/media/file/";
  const idx = url.indexOf(apiPrefix);
  if (idx >= 0) {
    const filename = decodeURIComponent(url.slice(idx + apiPrefix.length));
    if (filename) {
      return `/media/${encodeURIComponent(filename).replace(/%2F/gi, "/")}`;
    }
  }

  return url;
}

/** True when the URL is a CMS upload that should skip Next image optimization. */
export function isCmsMediaUrl(src: string | null | undefined): boolean {
  if (!src) return false;
  return src.startsWith("/media/") || src.includes("/api/media/file/");
}
