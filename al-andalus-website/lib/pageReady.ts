import { ScrollTrigger } from "gsap/ScrollTrigger";

export const LOADER_COMPLETE_EVENT = "app:loader-complete";
export const SCROLL_READY_EVENT = "app:scroll-ready";
export const SCROLL_EVENT = "app:scroll";

export type ScrollEventDetail = {
  scroll: number;
  direction: number;
};

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
