"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { isCmsMediaUrl } from "@/lib/cms/media";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
  fallbackSrc: string;
};

/**
 * Renders CMS or static images. CMS uploads skip Next optimization (avoids
 * "isn't a valid image … received null" when the Hostinger volume is missing
 * the file) and fall back to a static asset on error.
 */
export default function CmsImage({
  src,
  fallbackSrc,
  alt,
  ...props
}: Props) {
  const initial = src || fallbackSrc;
  const [current, setCurrent] = useState(initial);
  const unoptimized = isCmsMediaUrl(current) || props.unoptimized;

  return (
    <Image
      {...props}
      alt={alt}
      src={current}
      unoptimized={unoptimized}
      onError={() => {
        if (current !== fallbackSrc) setCurrent(fallbackSrc);
      }}
    />
  );
}
