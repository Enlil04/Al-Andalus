export const LOADER_COMPLETE_EVENT = "app:loader-complete";
export const SCROLL_READY_EVENT = "app:scroll-ready";
export const SCROLL_EVENT = "app:scroll";

export type ScrollEventDetail = {
  scroll: number;
  direction: number;
};
