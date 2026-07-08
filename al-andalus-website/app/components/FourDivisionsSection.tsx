"use client";

import React, { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";
import { siteCopy } from "@/lib/copy/en";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FourDivisionsSection.css";

const CIRCLE_POSITIONS = [
  "circle-management",
  "circle-sosei",
  "circle-corporate",
  "circle-coollaser",
] as const;

const pillars = siteCopy.whyChoosePillars;
const { whyChooseSection } = siteCopy;

export default function FourDivisionsSection() {
  const [activeId, setActiveId] = useState<string>(pillars[0]?.id ?? "licensed");
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((el, index) => {
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveId(pillars[index].id);
            }
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="four-divisions" id="why-us" ref={containerRef}>
      <div className="four-divisions__layout">
        <div className="four-divisions__sticky">
          <div className="four-divisions__header">
            <ScrollReveal>
              <span className="four-divisions__label">{whyChooseSection.label}</span>
            </ScrollReveal>
            <AnimatedHeadline
              title={whyChooseSection.headline}
              className="four-divisions__headline"
              as="h2"
            />
          </div>

          <div className="four-divisions__diagram-wrapper">
            <div className="four-divisions__diagram">
              {pillars.map((pillar, index) => {
                const circleLabel =
                  whyChooseSection.circleLabels[
                    pillar.id as keyof typeof whyChooseSection.circleLabels
                  ];

                return (
                  <div
                    key={pillar.id}
                    className={`division-circle ${CIRCLE_POSITIONS[index]} ${
                      activeId === pillar.id ? "is-active" : ""
                    }`}
                  >
                    <div className="circle-content">
                      <span className="circle-dot"></span>
                      <span className="circle-title">{circleLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="four-divisions__content">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.id}
              className={`four-divisions__item ${activeId === pillar.id ? "is-active" : ""}`}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
            >
              <AnimatedHeadline
                title={pillar.title}
                className="four-divisions__item-title"
                as="h3"
              />
              <ul className="four-divisions__item-list">
                {pillar.items.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
