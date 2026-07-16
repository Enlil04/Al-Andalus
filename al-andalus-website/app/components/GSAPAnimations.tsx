"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { waitForPageReady } from "@/lib/pageReady";
import { initAllHeadlines } from "@/lib/animateHeadline";

gsap.registerPlugin(ScrollTrigger);

export default function GSAPAnimations() {
  useLayoutEffect(() => {
    let ctx: gsap.Context | undefined;
    let disposed = false;

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

        /* ── Contact CTA: scroll background expansion ── */
        gsap.fromTo(
          ".contact-cta__bg",
          { "--clip-radius": () => (window.innerWidth <= 900 ? "60px" : "80px") },
          {
            "--clip-radius": "1800px",
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: ".contact-cta",
              start: "top 95%",
              end: "bottom center",
              scrub: 1.5,
            },
          },
        );

        /* ── Contact CTA: active class toggle on scroll ── */
        ScrollTrigger.create({
          trigger: ".contact-cta",
          start: "top 35%",
          end: "bottom center",
          toggleClass: "is-active",
        });

        /* ── Contact CTA: button scroll parallax and scaling ── */
        gsap.fromTo(
          ".contact-cta__btn",
          { scale: 0.8, y: 40, rotation: -8 },
          {
            scale: 1.4,
            y: -40,
            rotation: 8,
            ease: "power1.out",
            scrollTrigger: {
              trigger: ".contact-cta",
              start: "top bottom",
              end: "bottom center",
              scrub: 1.5,
            },
          },
        );
      }

      /* ── Expanding Image ── */
      const expandingImage = document.querySelector<HTMLElement>(".expanding-image");
      const expandingSection = document.querySelector<HTMLElement>(".expanding-section");
      if (expandingImage && expandingSection) {
        gsap.to(expandingImage, {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
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
