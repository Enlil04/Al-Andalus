import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type AnimateHeadlineOptions = {
  start?: string;
  immediate?: boolean;
  delay?: number;
};

const WORD_WRAP_STYLE: Partial<CSSStyleDeclaration> = {
  display: "inline-block",
  overflow: "hidden",
  marginInlineEnd: "0.25em",
  verticalAlign: "bottom",
  paddingTop: "0.2em",
  marginTop: "-0.2em",
  paddingBottom: "0.2em",
  marginBottom: "-0.2em",
};

const WORD_INNER_STYLE: Partial<CSSStyleDeclaration> = {
  display: "inline-block",
  transformOrigin: "left bottom",
};

function applyStyles(el: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
  Object.assign(el.style, styles);
}

function appendWord(parent: HTMLElement, word: string) {
  const wordWrap = document.createElement("span");
  wordWrap.className = "ah-word";
  applyStyles(wordWrap, WORD_WRAP_STYLE);

  const inner = document.createElement("span");
  inner.className = "ah-word-inner";
  applyStyles(inner, WORD_INNER_STYLE);
  inner.textContent = word;

  wordWrap.appendChild(inner);
  parent.appendChild(wordWrap);
}

function appendLine(parent: HTMLElement, line: string) {
  const lineWrap = document.createElement("span");
  lineWrap.className = "ah-line";
  lineWrap.style.display = "block";
  lineWrap.dir = "auto";

  line.split(" ").forEach((word) => {
    if (word) appendWord(lineWrap, word);
  });

  parent.appendChild(lineWrap);
}

export function wrapHeadlineElement(el: HTMLElement): void {
  if (el.querySelector(".ah-word-inner")) return;

  const lineEls = Array.from(el.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.tagName === "SPAN"
  );

  if (lineEls.length > 0 && lineEls.length === el.children.length) {
    lineEls.forEach((lineEl) => {
      const lineText = lineEl.textContent?.trim() ?? "";
      lineEl.textContent = "";
      lineEl.style.display = "block";
      lineEl.dir = "auto";
      lineText.split(" ").forEach((word) => {
        if (word) appendWord(lineEl, word);
      });
    });
    return;
  }

  const text = el.textContent?.trim() ?? "";
  el.textContent = "";
  text.split("\n").forEach((line) => {
    if (line.trim()) appendLine(el, line.trim());
  });
}

export function shouldSkipAutoHeadline(el: HTMLElement): boolean {
  if (el.querySelector(".ah-word-inner")) return true;

  return Array.from(el.children).some(
    (child) => child instanceof HTMLElement && child.tagName !== "SPAN"
  );
}

export function playHeadlineAnimation(
  el: HTMLElement,
  options: AnimateHeadlineOptions = {}
): gsap.core.Tween {
  const { start = "top 72%", immediate = false, delay = immediate ? 0.35 : 0 } = options;
  const trigger = el.closest("section") ?? el;
  const words = el.querySelectorAll(".ah-word-inner");

  gsap.set(words, { y: "120%", rotateZ: 4, opacity: 0 });

  if (immediate) {
    return gsap.to(words, {
      y: "0%",
      rotateZ: 0,
      opacity: 1,
      duration: 1.3,
      stagger: 0.08,
      ease: "power3.out",
      delay,
    });
  }

  return gsap.to(words, {
    y: "0%",
    rotateZ: 0,
    opacity: 1,
    duration: 1.25,
    stagger: 0.09,
    ease: "power3.out",
    scrollTrigger: {
      trigger,
      start,
      toggleActions: "play none none none",
    },
  });
}

export function initHeadlineElement(
  el: HTMLElement,
  options?: AnimateHeadlineOptions
): void {
  wrapHeadlineElement(el);
  playHeadlineAnimation(el, options);
}

export function initAllHeadlines(): void {
  gsap.utils.toArray<HTMLElement>("h1, h2, h3, h4, h5, h6").forEach((el) => {
    if (shouldSkipAutoHeadline(el)) return;
    initHeadlineElement(el);
  });
}
