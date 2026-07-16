"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playHeadlineAnimation } from "@/lib/animateHeadline";
import { waitForPageReady } from "@/lib/pageReady";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  title: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span";
  start?: string;
  /** Play on page ready (for above-the-fold headlines after the loader) */
  immediate?: boolean;
  delay?: number;
  /** Wrap words but skip mount animation (triggered elsewhere) */
  deferAnimation?: boolean;
}

export default function AnimatedHeadline({
  title,
  className = "",
  as = "h2",
  start = "top 72%",
  immediate = false,
  delay,
  deferAnimation = false,
}: Props) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || deferAnimation) return;

    let tween: gsap.core.Tween | undefined;

    const cleanupReady = waitForPageReady(() => {
      tween = playHeadlineAnimation(el, {
        start,
        immediate,
        delay: delay ?? (immediate ? 0.35 : 0),
      });
    });

    return () => {
      cleanupReady();
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [title, start, immediate, delay, deferAnimation]);

  const lines = title.replace(/\\n/g, "\n").split("\n");
  const Tag = as as React.ElementType;

  return (
    <Tag ref={containerRef as React.Ref<HTMLElement>} className={className}>
      {lines.map((line, lineIndex) => (
        <span
          key={lineIndex}
          className="ah-line"
          dir="auto"
          style={{ display: "block" }}
        >
          {line.split(" ").map((word, wordIndex) => (
            <span
              key={wordIndex}
              className="ah-word"
              style={{
                display: "inline-block",
                overflow: "hidden",
                marginInlineEnd: "0.25em",
                verticalAlign: "bottom",
                paddingTop: "0.2em",
                marginTop: "-0.2em",
                paddingBottom: "0.2em",
                marginBottom: "-0.2em",
              }}
            >
              <span
                className="ah-word-inner"
                style={{
                  display: "inline-block",
                  transformOrigin: "left bottom",
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
