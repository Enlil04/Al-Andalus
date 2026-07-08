"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCROLL_EVENT, SCROLL_READY_EVENT } from "@/lib/pageReady";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __scrollReady?: boolean;
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      window.dispatchEvent(
        new CustomEvent(SCROLL_EVENT, {
          detail: { scroll: e.scroll, direction: e.direction },
        })
      );
    });

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.documentElement.style.transform ? "transform" : "fixed",
    });

    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    window.__scrollReady = true;
    window.dispatchEvent(new CustomEvent(SCROLL_READY_EVENT));
    ScrollTrigger.refresh();

    const onLoaderComplete = () => ScrollTrigger.refresh();
    window.addEventListener("app:loader-complete", onLoaderComplete);

    return () => {
      window.removeEventListener("app:loader-complete", onLoaderComplete);
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      window.__scrollReady = false;
    };
  }, []);

  return <>{children}</>;
}
