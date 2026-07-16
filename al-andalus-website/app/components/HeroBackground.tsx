"use client";

import { useMemo } from "react";
import {
  DEFAULT_HERO_VIMEO_ID,
  getVimeoEmbedUrl,
  getVimeoVideoId,
} from "@/lib/vimeo";

type HeroBackgroundProps = {
  vimeoUrl?: string | null;
};

export default function HeroBackground({ vimeoUrl }: HeroBackgroundProps) {
  const videoId = useMemo(() => {
    if (vimeoUrl) {
      return getVimeoVideoId(vimeoUrl) ?? DEFAULT_HERO_VIMEO_ID;
    }
    return DEFAULT_HERO_VIMEO_ID;
  }, [vimeoUrl]);

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
