"use client";

import { useMemo } from "react";
import {
  DEFAULT_HERO_VIMEO_ID,
  getVimeoEmbedUrl,
  getVimeoVideoId,
} from "@/lib/vimeo";

type HeroBackgroundProps = {
  vimeoUrl?: string | null;
  /** CMS-uploaded background video (takes priority over Vimeo). */
  videoUrl?: string | null;
  /** CMS-uploaded fallback/poster image. */
  imageUrl?: string | null;
};

export default function HeroBackground({
  vimeoUrl,
  videoUrl,
  imageUrl,
}: HeroBackgroundProps) {
  const videoId = useMemo(() => {
    if (vimeoUrl) {
      return getVimeoVideoId(vimeoUrl) ?? DEFAULT_HERO_VIMEO_ID;
    }
    return DEFAULT_HERO_VIMEO_ID;
  }, [vimeoUrl]);

  if (videoUrl) {
    return (
      <video
        className="hero__vimeo"
        src={videoUrl}
        poster={imageUrl ?? undefined}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="hero__vimeo" src={imageUrl} alt="" />;
  }

  return (
    <iframe
      src={getVimeoEmbedUrl(videoId)}
      className="hero__vimeo"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      title=""
      loading="eager"
    />
  );
}
