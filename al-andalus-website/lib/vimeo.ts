export const DEFAULT_HERO_VIMEO_ID = "1212266929";

export function getVimeoVideoId(url: string): string | null {
  const match = url.match(
    /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/,
  );
  return match?.[1] ?? null;
}

export function getVimeoEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    background: "1",
    autoplay: "1",
    loop: "1",
    muted: "1",
    controls: "0",
    playsinline: "1",
    title: "0",
    byline: "0",
    portrait: "0",
    // Keep playing when other media exists on the page / tab is backgrounded briefly.
    autopause: "0",
    dnt: "1",
    // Prefer a lighter stream on constrained networks (mobile).
    quality: "auto",
  });
  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}
