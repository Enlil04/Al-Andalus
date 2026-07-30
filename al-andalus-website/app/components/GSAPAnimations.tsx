"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { waitForPageReady, SCROLL_EVENT } from "@/lib/pageReady";
import { initAllHeadlines } from "@/lib/animateHeadline";

gsap.registerPlugin(ScrollTrigger);

/** Match previous GSAP power1.inOut scrub curve. */
function contactEaseInOut(progress: number) {
  return progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
}

function contactStartClip() {
  return window.innerWidth <= 768
    ? { top: 62, right: 28, bottom: 28, left: 28 }
    : { top: 70, right: 27, bottom: 22, left: 57 };
}

/**
 * Drive Contact Us clip + text color from live layout geometry.
 * ScrollTrigger start/end cache goes stale on tall pages (About/Services)
 * after images/layout shift — that left a full navy panel with navy text.
 */
function syncContactCtaMotion(section: HTMLElement) {
  const bg = section.querySelector<HTMLElement>(".contact-cta__bg");
  const btn = section.querySelector<HTMLElement>(".contact-cta__btn");
  const rect = section.getBoundingClientRect();
  const vh = window.innerHeight || 1;

  // Same range as the old scrub: top hits 90% → top hits 0.
  const startY = vh * 0.9;
  const endY = 0;
  const raw = (startY - rect.top) / Math.max(1, startY - endY);
  const progress = Math.min(1, Math.max(0, raw));
  const eased = contactEaseInOut(progress);

  if (bg) {
    const start = contactStartClip();
    const top = start.top * (1 - eased);
    const right = start.right * (1 - eased);
    const bottom = start.bottom * (1 - eased);
    const left = start.left * (1 - eased);
    bg.style.clipPath = `inset(${top}% ${right}% ${bottom}% ${left}%)`;
  }

  if (btn) {
    // Parallel to old button scrub (top bottom → top top).
    const btnRaw = (vh - rect.top) / Math.max(1, vh);
    const btnP = Math.min(1, Math.max(0, btnRaw));
    const btnEased = contactEaseInOut(btnP);
    btn.style.transform = `translate3d(0, ${28 + ( -14 - 28) * btnEased}px, 0) scale(${0.95 + (1.05 - 0.95) * btnEased})`;
    btn.style.opacity = String(btnEased);
  }

  // White as soon as navy is large enough; keep until section fully leaves.
  const expandedEnough = progress >= 0.22;
  const stillOnScreen = rect.bottom > 0;
  section.classList.toggle("is-active", expandedEnough && stillOnScreen);
}

function bindContactCtaMotion(isDisposed: () => boolean): () => void {
  const section = document.querySelector<HTMLElement>(".contact-cta");
  if (!section) return () => {};

  const sync = () => {
    if (isDisposed()) return;
    syncContactCtaMotion(section);
  };

  sync();
  window.addEventListener(SCROLL_EVENT, sync);
  window.addEventListener("resize", sync);
  const ro = new ResizeObserver(sync);
  ro.observe(section);
  ro.observe(document.documentElement);
  // Late image/layout shifts on long pages — remeasure after settle.
  const timers = [400, 1200, 2500].map((ms) => window.setTimeout(sync, ms));

  return () => {
    window.removeEventListener(SCROLL_EVENT, sync);
    window.removeEventListener("resize", sync);
    ro.disconnect();
    timers.forEach((id) => window.clearTimeout(id));
    const bg = section.querySelector<HTMLElement>(".contact-cta__bg");
    const btn = section.querySelector<HTMLElement>(".contact-cta__btn");
    if (bg) bg.style.clipPath = "";
    if (btn) {
      btn.style.transform = "";
      btn.style.opacity = "";
    }
    section.classList.remove("is-active");
  };
}

export default function GSAPAnimations() {
  useLayoutEffect(() => {
    let ctx: gsap.Context | undefined;
    let disposed = false;
    let stopContactMotion: (() => void) | undefined;

    const cleanupReady = waitForPageReady(() => {
      if (disposed) return;

      ctx = gsap.context(() => {
      /* ── Global headline word reveal ── */
      initAllHeadlines();

      const heroScroll = document.querySelector(".hero__scroll");
      if (heroScroll) {
        gsap.from(heroScroll, {
          y: 20,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          delay: 2.5,
        });
      }

      /* ── Hero headline: fade out left → slide → reveal right (fully scrubbed) ──
         Keep all swap state on this timeline only. Mixing scrub sets with freestanding
         fromTo() tweens left words mid-transform after scroll-away/back (clipped lines). */
      const heroTrack = document.querySelector<HTMLElement>(".hero-track");
      const hero = document.querySelector<HTMLElement>(".hero");
      const heroContent = document.querySelector<HTMLElement>(".hero__content");

      if (heroTrack && hero && heroContent) {
        const leftTitle = heroContent.querySelector<HTMLElement>(".hero__title--left");
        const rightTitle = heroContent.querySelector<HTMLElement>(".hero__title--right");
        const leftWords = leftTitle?.querySelectorAll<HTMLElement>(".ah-word-inner");
        const rightWords = rightTitle?.querySelectorAll<HTMLElement>(".ah-word-inner");
        const heroScrollLabel = heroContent.querySelector<HTMLElement>(".hero__scroll");
        let hadScrolledPastSwap = false;

        const getTravelX = () => {
          const inset = Math.min(window.innerWidth * 0.05, 48);
          const travel = Math.max(
            0,
            hero.clientWidth - heroContent.offsetWidth - inset * 2
          );
          const isRtl = document.documentElement.dir === "rtl";
          return isRtl ? -travel : travel;
        };

        if (rightTitle) {
          gsap.set(rightTitle, { opacity: 0, visibility: "hidden" });
        }
        if (rightWords?.length) {
          gsap.set(rightWords, { y: "120%", rotateZ: 4, opacity: 0 });
        }

        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroTrack,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate(self) {
              if (disposed) return;
              if (self.progress > 0.2) {
                hadScrolledPastSwap = true;
                return;
              }
              // After a full swap cycle, settle left word transforms on return to top
              // (avoids clipped/broken lines if the entrance tween was interrupted)
              if (hadScrolledPastSwap && self.progress < 0.02 && leftWords?.length) {
                hadScrolledPastSwap = false;
                gsap.killTweensOf(leftWords);
                gsap.set(leftWords, { y: "0%", rotateZ: 0, opacity: 1 });
              }
            },
          },
        });

        heroTl
          .to(heroContent, {
            opacity: 0,
            duration: 0.28,
            ease: "power2.in",
          })
          .set(heroContent, { x: getTravelX });

        if (leftTitle) {
          heroTl.set(leftTitle, { opacity: 0, visibility: "hidden" });
        }
        if (rightTitle) {
          heroTl.set(rightTitle, { opacity: 1, visibility: "visible" });
        }
        if (rightWords?.length) {
          heroTl.set(rightWords, { y: "120%", rotateZ: 4, opacity: 0 });
        }
        if (heroScrollLabel) {
          heroTl.set(heroScrollLabel, { y: 20, opacity: 0 });
        }

        heroTl.to(heroContent, {
          opacity: 1,
          duration: 0.28,
          ease: "power2.out",
        });

        if (rightWords?.length) {
          heroTl.to(rightWords, {
            y: "0%",
            rotateZ: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.06,
            ease: "power3.out",
          });
        }

        if (heroScrollLabel) {
          heroTl.to(
            heroScrollLabel,
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
            },
            "-=0.55"
          );
        }

        heroTl.to({}, { duration: 0.6 });
      }

      /* ── About Pinned Text Fade Out ── */
      if (document.querySelector(".about-pinned")) {
        gsap.to(".about-pinned__sticky", {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-pinned",
            start: "bottom 80%",
            end: "bottom 30%",
            scrub: true,
          },
        });
      }

      /* ── Vertical Scroll Overlay Fade In ── */
      if (document.querySelector(".vs-section")) {
        gsap.to(".vs-overlay__sticky", {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".vs-section",
            start: "top center",
            end: "top top",
            scrub: true,
          },
        });
      }

      /* ── Products section: staggered card entry ── */
      gsap.utils.toArray<Element>(".product-card").forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          delay: (i % 4) * 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      /* ── Featured products: slide in ── */
      gsap.utils.toArray<Element>(".featured-product").forEach((section) => {
        const visual = section.querySelector(".featured-product__visual");
        if (visual) {
          gsap.from(visual, {
            x: -80,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          });
        }
      });

      /* ── Leader cards: scale in ── */
      gsap.utils.toArray<Element>(".leader-card").forEach((card, i) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          scale: 0.95,
          duration: 1,
          delay: i * 0.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });

      /* ── News items: stagger slide ── */
      gsap.utils.toArray<Element>(".news-item").forEach((item, i) => {
        gsap.from(item, {
          x: -40,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });

      /* ── About page rows: stagger slide (matches news) ── */
      gsap.utils.toArray<Element>(".about-company__row, .about-history__row").forEach(
        (row, i) => {
          gsap.from(row, {
            x: -40,
            opacity: 0,
            duration: 1.15,
            delay: (i % 6) * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 72%",
              toggleActions: "play none none none",
            },
          });
        }
      );

      /* ── Contact CTA: big text parallax ── */
      if (document.querySelector(".contact-cta")) {
        if (document.querySelector(".contact-cta__bg-text")) {
          gsap.to(".contact-cta__bg-text", {
            xPercent: -15,
            ease: "none",
            scrollTrigger: {
              trigger: ".contact-cta",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }

        /* ── Contact CTA: live clip + white text (no ST cache) ── */
        stopContactMotion = bindContactCtaMotion(() => disposed);
      }

      /* ── Expanding Image ── */
      const expandingImage = document.querySelector<HTMLElement>(".expanding-image");
      const expandingSection = document.querySelector<HTMLElement>(".expanding-section");
      if (expandingImage && expandingSection) {
        const isMobile = window.innerWidth <= 768;
        // Mobile: stay smaller + landscape-ish so background-size:contain can
        // show the full photo without page-banner overflow clipping it.
        const targetSize = isMobile
          ? { width: "90vw", height: "52vw", borderRadius: 12 }
          : { width: "100vw", height: "100vh", borderRadius: 0 };

        gsap.to(expandingImage, {
          ...targetSize,
          ease: "none",
          scrollTrigger: {
            trigger: expandingSection,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      }

      /* ── Footer slide up ── */
      if (document.querySelector(".footer")) {
        gsap.from(".footer__top > *", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".footer",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      /* ── Sectors Diagram Concentric Circles Entrance ── */
      if (document.querySelector(".culture-section")) {
        gsap.from(".culture-diagram .circle", {
          scale: 0.6,
          opacity: 0,
          duration: 1.8,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".culture-section",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        /* ── Sectors Diagram Scroll Rotation ── */
        gsap.fromTo(
          ".culture-diagram",
          { rotation: -15 },
          {
            rotation: 15,
            ease: "none",
            scrollTrigger: {
              trigger: ".culture-section",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );

        gsap.fromTo(
          ".diagram-core",
          { rotation: 15 },
          {
            rotation: -15,
            ease: "none",
            scrollTrigger: {
              trigger: ".culture-section",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );

        gsap.utils.toArray<Element>(".orbit-node").forEach((node) => {
          gsap.fromTo(
            node,
            { rotation: 15 },
            {
              rotation: -15,
              ease: "none",
              scrollTrigger: {
                trigger: ".culture-section",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        });
      }
      });
    });

    return () => {
      disposed = true;
      cleanupReady();
      stopContactMotion?.();
      try {
        ctx?.revert();
      } catch {
        // Ignore DOM races if React already swapped the page tree.
      }
      ScrollTrigger.getAll().forEach((trigger) => {
        try {
          trigger.kill(true);
        } catch {
          /* ignore */
        }
      });
    };
  }, []);

  return null;
}
