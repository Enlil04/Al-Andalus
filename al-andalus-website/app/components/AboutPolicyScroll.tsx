"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { waitForPageReady } from "@/lib/pageReady";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPolicyScroll() {
  useEffect(() => {
    let ctx: gsap.Context | undefined;

    const cleanupReady = waitForPageReady(() => {
      const section = document.querySelector(".about-policy");
      if (!section) return;

      ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>(".about-policy__item");
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        items.forEach((item) => {
          const body = item.querySelector<HTMLElement>(".about-policy__item-body");
          if (!body) return;

          if (reducedMotion) {
            item.classList.add("is-open");
            gsap.set(body, { height: "auto", opacity: 1, clearProps: "overflow" });
            return;
          }

          gsap.set(body, { height: 0, opacity: 0, overflow: "hidden" });

          ScrollTrigger.create({
            trigger: item,
            start: "top 58%",
            once: true,
            onEnter: () => {
              item.classList.add("is-open");

              gsap.set(body, { height: "auto" });
              const fullHeight = body.scrollHeight;
              gsap.set(body, { height: 0, opacity: 0 });

              gsap.to(body, {
                height: fullHeight,
                opacity: 1,
                duration: 1.15,
                ease: "power3.out",
                onComplete: () =>
                  gsap.set(body, { height: "auto", clearProps: "overflow" }),
              });
            },
          });
        });
      }, section);
    });

    return () => {
      cleanupReady();
      ctx?.revert();
    };
  }, []);

  return null;
}
