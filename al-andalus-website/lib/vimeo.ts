export const DEFAULT_HERO_VIMEO_ID = "1210447316";

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
  });
  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}
