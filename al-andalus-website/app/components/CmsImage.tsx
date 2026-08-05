"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import {
  getAlternateCmsMediaUrl,
  isCmsMediaUrl,
} from "@/lib/cms/media";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
  fallbackSrc: string;
};

/**
 * Renders CMS or static images. CMS uploads skip Next optimization (avoids
 * "isn't a valid image … received null" when the Hostinger volume is missing
 * the file). Retries the alternate CMS path (`/api/media/file` ↔ `/media`)
 * before falling back to a static asset.
 */
export default function CmsImage({
  src,
  fallbackSrc,
  alt,
  ...props
}: Props) {
  const initial = src || fallbackSrc;
  const [current, setCurrent] = useState(initial);
  const [triedAlt, setTriedAlt] = useState(false);
  const unoptimized = isCmsMediaUrl(current) || props.unoptimized;

  return (
    <Image
      {...props}
      alt={alt}
      src={current}
      unoptimized={unoptimized}
      onError={() => {
        if (current === fallbackSrc) return;

        const altUrl = !triedAlt ? getAlternateCmsMediaUrl(current) : null;
        if (altUrl && altUrl !== fallbackSrc) {
          setTriedAlt(true);
          setCurrent(altUrl);
          return;
        }

        setCurrent(fallbackSrc);
      }}
    />
  );
}
