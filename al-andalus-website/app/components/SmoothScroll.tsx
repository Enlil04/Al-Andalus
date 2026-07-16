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

function killScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => {
    try {
      trigger.kill(true);
    } catch {
      // Ignore DOM races during App Router transitions.
    }
  });
}

function isInternalNavigation(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  if (anchor.target && anchor.target !== "_self") return false;

  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      !url.hash
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
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

    // Kill ScrollTriggers *before* React tears down the old page DOM.
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!isInternalNavigation(anchor)) return;

      killScrollTriggers();
    };

    const onPopState = () => {
      killScrollTriggers();
    };

    document.addEventListener("click", onDocumentClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("app:loader-complete", onLoaderComplete);
      gsap.ticker.remove(tickerUpdate);
      killScrollTriggers();
      lenis.destroy();
      window.__scrollReady = false;
    };
  }, []);

  return <>{children}</>;
}
