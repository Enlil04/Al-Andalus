type MediaDoc = {
  url?: string | null;
};

export function getMediaUrl(
  media: string | MediaDoc | null | undefined,
): string | null {
  if (!media || typeof media === "string") return null;
  return media.url ?? null;
}
