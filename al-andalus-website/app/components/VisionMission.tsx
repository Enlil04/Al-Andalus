"use client";

import React from "react";
import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";
import "./VisionMission.css";

type VisionMissionProps = {
  label: string;
  headline: string;
  paragraphs: readonly string[];
  imageUrl: string | null;
  accentImageUrl: string | null;
};

export default function VisionMission({
  label,
  headline,
  paragraphs,
  imageUrl,
  accentImageUrl,
}: VisionMissionProps) {
  const [firstHeadline, ...remainingHeadline] = headline.split("\n");
  const secondHeadline = remainingHeadline.join("\n");

  return (
    <section className="vision-mission" id="vision-mission">
      {/* Background Vertical Grid Lines */}
      <div className="vision-mission__grid-lines">
        <div className="vision-mission__grid-line" />
        <div className="vision-mission__grid-line" />
        <div className="vision-mission__grid-line" />
        <div className="vision-mission__grid-line" />
        <div className="vision-mission__grid-line" />
      </div>

      <div className="about-grid vision-mission__container">
        {/* Left: Title Area */}
        <div className="vision-mission__left about-grid__cols-1-6">
          <ScrollReveal>
            <span className="vision-mission__label">{label}</span>
          </ScrollReveal>
          <AnimatedHeadline
            title={firstHeadline}
            className="vision-mission__headline"
            as="h2"
          />
          <AnimatedHeadline
            title={secondHeadline}
            className="vision-mission__headline vision-mission__headline--second"
            as="h2"
            delay={0.3}
          />
        </div>

        {/* Right: Floating Images */}
        <div className="vision-mission__right about-grid__cols-7-12">
          <div className="vision-mission__images-wrapper">
            <ScrollReveal delay={0.5}>
              <div
                className="vision-mission__img-card vision-mission__img-card--main"
                style={{ backgroundImage: `url("${imageUrl}")` }}
                role="img"
                aria-label="Conference room with city view representing business growth"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.8}>
              <div
                className="vision-mission__img-card vision-mission__img-card--accent"
                style={{ backgroundImage: `url("${accentImageUrl}")` }}
                role="img"
                aria-label="Modern office interior representing business focus"
              />
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom: Grid of 3 Cards */}
        <div className="vision-mission__cards-container about-grid__span-all">
          <div className="vision-mission__cards-grid">
            <ScrollReveal delay={1}>
              <div className="vision-mission__grid-card">
                <span className="vision-mission__card-num">( ٠١ )</span>
                <p className="vision-mission__card-text">
                  {paragraphs[0]}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1.2}>
              <div className="vision-mission__grid-card">
                <span className="vision-mission__card-num">( ٠٢ )</span>
                <p className="vision-mission__card-text">
                  {paragraphs[1]}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1.4}>
              <div className="vision-mission__grid-card">
                <span className="vision-mission__card-num">( ٠٣ )</span>
                <p className="vision-mission__card-text">
                  {paragraphs[2]}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
