"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  DEFAULT_HERO_VIMEO_ID,
  getVimeoEmbedUrl,
  getVimeoVideoId,
} from "@/lib/vimeo";

type HeroBackgroundProps = {
  vimeoUrl?: string | null;
  /** CMS-uploaded background video (takes priority over Vimeo). */
  videoUrl?: string | null;
  /** CMS-uploaded fallback/poster image — shown behind the video, not instead of it. */
  imageUrl?: string | null;
};

declare global {
  interface Window {
    Vimeo?: {
      Player: new (
        element: HTMLIFrameElement,
        options?: Record<string, unknown>,
      ) => {
        ready: () => Promise<void>;
        setMuted: (muted: boolean) => Promise<void>;
        setVolume: (volume: number) => Promise<void>;
        play: () => Promise<void>;
        destroy: () => Promise<void>;
      };
    };
  }
}

function loadVimeoPlayerApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Vimeo?.Player) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    'script[data-vimeo-player-api="true"]',
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Vimeo API failed")), {
        once: true,
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    script.dataset.vimeoPlayerApi = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Vimeo API failed"));
    document.head.appendChild(script);
  });
}

export default function HeroBackground({
  vimeoUrl,
  videoUrl,
  imageUrl,
}: HeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = useMemo(() => {
    if (vimeoUrl) {
      return getVimeoVideoId(vimeoUrl) ?? DEFAULT_HERO_VIMEO_ID;
    }
    return DEFAULT_HERO_VIMEO_ID;
  }, [vimeoUrl]);

  // Force HTML5 video autoplay on mobile (iOS needs an explicit play() call).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      void video.play().catch(() => {
        /* Autoplay can still fail in Low Power Mode — poster remains visible. */
      });
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [videoUrl]);

  // Force Vimeo iframe playback on mobile via the Player API.
  useEffect(() => {
    if (videoUrl) return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    let cancelled = false;
    let player: InstanceType<NonNullable<typeof window.Vimeo>["Player"]> | null =
      null;

    const start = async () => {
      try {
        await loadVimeoPlayerApi();
        if (cancelled || !iframeRef.current || !window.Vimeo?.Player) return;

        player = new window.Vimeo.Player(iframeRef.current);
        await player.ready();
        if (cancelled) return;
        await player.setMuted(true);
        await player.setVolume(0);
        await player.play();
      } catch {
        /* Keep the iframe; background=1 params still handle most desktops. */
      }
    };

    void start();

    const onVisibility = () => {
      if (document.visibilityState === "visible" && player) {
        void player.setMuted(true).then(() => player?.play()).catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      if (player) {
        void player.destroy().catch(() => {});
      }
    };
  }, [videoUrl, videoId]);

  const poster = imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="hero__poster" src={imageUrl} alt="" aria-hidden="true" />
  ) : null;

  if (videoUrl) {
    return (
      <>
        {poster}
        <video
          ref={videoRef}
          className="hero__vimeo"
          src={videoUrl}
          poster={imageUrl ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </>
    );
  }

  return (
    <>
      {poster}
      <iframe
        ref={iframeRef}
        src={getVimeoEmbedUrl(videoId)}
        className="hero__vimeo"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        title=""
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </>
  );
}
