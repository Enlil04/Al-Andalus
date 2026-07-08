"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { waitForPageReady } from "@/lib/pageReady";
import { initAllHeadlines } from "@/lib/animateHeadline";

gsap.registerPlugin(ScrollTrigger);

export default function GSAPAnimations() {
  useEffect(() => {
    let ctx: gsap.Context | undefined;

    const cleanupReady = waitForPageReady(() => {
      ctx = gsap.context(() => {
      /* ── Global headline word reveal ── */
      initAllHeadlines();

      gsap.from(".hero__scroll", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        delay: 2.5,
      });

      /* ── Hero text fade out on scroll ── */
      gsap.to(".hero__bottom", {
        opacity: 0,
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      /* ── About Pinned Text Fade Out ── */
      gsap.to(".about-pinned__sticky", {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-pinned",
          start: "bottom 80%", // Starts fading when the bottom of the section is 80% down the screen
          end: "bottom 30%",
          scrub: true,
        },
      });

      /* ── Vertical Scroll Overlay Fade In ── */
      gsap.to(".vs-overlay__sticky", {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".vs-section",
          start: "top center",
          end: "top top",
          scrub: true,
        }
      });

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
        { "--clip-radius": () => window.innerWidth <= 900 ? "60px" : "80px" },
        {
          "--clip-radius": "1800px",
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: ".contact-cta",
            start: "top 95%",
            end: "bottom center",
            scrub: 1.5,
          },
        }
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
        }
      );

      /* ── Expanding Image ── */
      gsap.to(".expanding-image", {
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".expanding-section",
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });

      /* ── Footer slide up ── */
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

      /* ── Sectors Diagram Concentric Circles Entrance ── */
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
        }
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
        }
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
          }
        );
      });
      });
    });

    return () => {
      cleanupReady();
      ctx?.revert();
    };
  }, []);

  return null;
}
