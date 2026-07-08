"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { waitForPageReady } from "@/lib/pageReady";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  sectionId?: string;
}

export default function JobsDescriptionScroll({ sectionId = "job-description" }: Props) {
  useEffect(() => {
    let ctx: gsap.Context | undefined;

    const cleanupReady = waitForPageReady(() => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      ctx = gsap.context(() => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const filters = gsap.utils.toArray<HTMLElement>(".jobs-description__filter");
        const items = gsap.utils.toArray<HTMLElement>(".jobs-description__item");
        const accent = section.querySelector<HTMLElement>(".jobs-description__accent");
        const rule = section.querySelector<HTMLElement>(".jobs-description__rule");

        if (reducedMotion) {
          gsap.set([accent, rule, ...filters, ...items], { clearProps: "all", opacity: 1, x: 0, scaleX: 1 });
          return;
        }

        if (accent) gsap.set(accent, { scaleX: 0, transformOrigin: "left center" });
        if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(filters, { opacity: 0, x: -16 });
        gsap.set(items, { opacity: 0, y: 24 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
        });

        if (accent) {
          timeline.to(accent, { scaleX: 1, duration: 0.8, ease: "power3.out" });
        }

        timeline.to(filters, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        });

        if (rule) {
          timeline.to(
            rule,
            { scaleX: 1, duration: 0.9, ease: "power3.out" },
            accent ? "-=0.45" : 0
          );
        }

        timeline.to(
          items,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.07,
            ease: "power3.out",
          },
          "-=0.35"
        );
      }, section);
    });

    return () => {
      cleanupReady();
      ctx?.revert();
    };
  }, [sectionId]);

  return null;
}
