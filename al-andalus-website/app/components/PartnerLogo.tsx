"use client";

import Image from "next/image";
import { useState } from "react";
import {
  getAlternateCmsMediaUrl,
  isCmsMediaUrl,
} from "@/lib/cms/media";

type Props = {
  src: string | null | undefined;
  name: string;
  width: number;
  height: number;
  textClassName: string;
};

/**
 * Partner mark: show the uploaded logo, retrying the alternate CMS path
 * (`/api/media/file` ↔ `/media`) when the first URL 404s. Falls back to the
 * partner name — never the Al-Andalus site logo.
 */
export default function PartnerLogo({
  src,
  name,
  width,
  height,
  textClassName,
}: Props) {
  const [current, setCurrent] = useState(src || null);
  const [triedAlt, setTriedAlt] = useState(false);
  const label = name?.trim() || "—";

  if (!current) {
    return <span className={textClassName}>{label}</span>;
  }

  return (
    <Image
      src={current}
      alt={label}
      width={width}
      height={height}
      unoptimized={isCmsMediaUrl(current)}
      style={{ objectFit: "contain" }}
      onError={() => {
        const alt = !triedAlt ? getAlternateCmsMediaUrl(current) : null;
        if (alt) {
          setTriedAlt(true);
          setCurrent(alt);
          return;
        }
        setCurrent(null);
      }}
    />
  );
}
