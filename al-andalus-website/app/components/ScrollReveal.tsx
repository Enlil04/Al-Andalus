"use client";

import { useEffect, useRef } from "react";
import { waitForPageReady } from "@/lib/pageReady";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  clip?: boolean;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  clip = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observer: IntersectionObserver | undefined;

    const cleanupReady = waitForPageReady(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer?.unobserve(el);
          }
        },
        { threshold: 0.22, rootMargin: "0px 0px -18% 0px" }
      );

      observer.observe(el);
    });

    return () => {
      cleanupReady();
      observer?.disconnect();
    };
  }, []);

  const baseClass = clip ? "reveal-clip" : "reveal";
  const delayClass = delay > 0 ? `reveal-delay-${delay}` : "";

  return (
    <div ref={ref} className={`${baseClass} ${delayClass} ${className}`}>
      {children}
    </div>
  );
}
