import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  LOADER_COMPLETE_EVENT,
  SCROLL_READY_EVENT,
} from "@/lib/scrollEvents";

export {
  LOADER_COMPLETE_EVENT,
  SCROLL_READY_EVENT,
  SCROLL_EVENT,
  type ScrollEventDetail,
} from "@/lib/scrollEvents";

/**
 * Runs `callback` once the intro loader has finished and Lenis has signaled
 * that smooth scrolling is ready. Also refreshes ScrollTrigger so layout
 * measurements are accurate after the loader unmounts.
 */
export function waitForPageReady(callback: () => void): () => void {
  let loaderDone = false;
  let scrollReady = false;
  let cancelled = false;

  const run = () => {
    if (cancelled || !loaderDone || !scrollReady) return;

    requestAnimationFrame(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      callback();
    });
  };

  const onLoaderComplete = () => {
    loaderDone = true;
    run();
  };

  const onScrollReady = () => {
    scrollReady = true;
    run();
  };

  const loader = document.querySelector(".loader");
  if (!loader || loader.classList.contains("loader--hidden")) {
    loaderDone = true;
  }

  if ((window as Window & { __scrollReady?: boolean }).__scrollReady) {
    scrollReady = true;
  }

  window.addEventListener(LOADER_COMPLETE_EVENT, onLoaderComplete);
  window.addEventListener(SCROLL_READY_EVENT, onScrollReady);

  run();

  return () => {
    cancelled = true;
    window.removeEventListener(LOADER_COMPLETE_EVENT, onLoaderComplete);
    window.removeEventListener(SCROLL_READY_EVENT, onScrollReady);
  };
}
