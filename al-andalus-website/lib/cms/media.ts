type MediaDoc = {
  url?: string | null;
  filename?: string | null;
};

function isMediaDoc(value: unknown): value is MediaDoc {
  return !!value && typeof value === "object";
}

function encodeMediaPath(filename: string): string {
  return encodeURIComponent(filename).replace(/%2F/gi, "/");
}

/**
 * Build candidate URLs for a CMS upload.
 *
 * On Hostinger/Passenger, runtime uploads are often reachable via Payload's
 * `/api/media/file/...` while older files shipped in `public/media` only work
 * as `/media/...`. Trying both avoids the wrong path 404 → logo fallback.
 */
export function getMediaUrls(media: unknown): string[] {
  if (!isMediaDoc(media)) return [];

  const urls: string[] = [];
  const seen = new Set<string>();
  const add = (url: string | null | undefined) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    urls.push(url);
  };

  const filename = media.filename?.trim() || null;
  let encodedFromUrl: string | null = null;

  if (media.url) {
    const apiPrefix = "/api/media/file/";
    const idx = media.url.indexOf(apiPrefix);
    if (idx >= 0) {
      encodedFromUrl = media.url.slice(idx + apiPrefix.length);
      // Prefer the API path Payload itself stores (works for new uploads).
      add(`${apiPrefix}${encodedFromUrl}`);
    } else {
      add(media.url);
    }
  }

  if (filename) {
    const encoded = encodeMediaPath(filename);
    add(`/api/media/file/${encoded}`);
    add(`/media/${encoded}`);
  } else if (encodedFromUrl) {
    add(`/media/${encodedFromUrl}`);
  }

  return urls;
}

/**
 * Primary media URL. Prefer Payload's file API, with `/media/...` available
 * via {@link getMediaUrls} / image components that retry on error.
 */
export function getMediaUrl(media: unknown): string | null {
  return getMediaUrls(media)[0] ?? null;
}

/** True when the URL is a CMS upload that should skip Next image optimization. */
export function isCmsMediaUrl(src: string | null | undefined): boolean {
  if (!src) return false;
  return src.startsWith("/media/") || src.includes("/api/media/file/");
}

/** Alternate CMS path when the primary URL 404s (API ↔ static). */
export function getAlternateCmsMediaUrl(
  src: string | null | undefined,
): string | null {
  if (!src) return null;

  const apiPrefix = "/api/media/file/";
  if (src.startsWith(apiPrefix)) {
    return `/media/${src.slice(apiPrefix.length)}`;
  }
  if (src.startsWith("/media/")) {
    return `${apiPrefix}${src.slice("/media/".length)}`;
  }
  return null;
}
