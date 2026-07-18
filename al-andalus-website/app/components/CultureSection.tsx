import React from "react";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";
import { getLocale } from "@/lib/locale";
import "./CultureSection.css";

type CultureSectionProps = {
  label: string;
  headline: string;
  coreTitle: string;
  buttonText: string;
  buttonLink: string;
  sectors: readonly { title: string; desc: string }[];
};

const CultureSection = async ({
  label,
  headline,
  coreTitle,
  buttonText,
  buttonLink,
  sectors,
}: CultureSectionProps) => {
  const locale = await getLocale();
  const [nodeConstruction, nodeTrade, nodeRetail, nodeBanking, nodeHealthcare] =
    sectors;

  return (
    <section className="culture-section" id="culture">
      <div className="culture-container">
        <div className="culture-header">
          <ScrollReveal>
            <span className="culture-label">{label}</span>
          </ScrollReveal>
          <AnimatedHeadline
            title={headline}
            className="culture-headline"
            as="h2"
          />
        </div>

        <div className="culture-diagram-wrapper">
          <div className="culture-diagram">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
            <div className="circle circle-4"></div>

            <div className="diagram-core">
              <AnimatedHeadline
                title={coreTitle}
                className="core-title"
                as="h3"
              />
            </div>

            <div className="orbit-node node-initiative node-left">
              <ScrollReveal delay={0.3}>
                <div className="node-content">
                  <div className="node-point">
                    <div className="node-dot"></div>
                  </div>
                  <div className="node-text">
                    <AnimatedHeadline title={nodeRetail.title} as="h4" />
                    <p>{nodeRetail.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="orbit-node node-freedom node-left">
              <ScrollReveal delay={0.4}>
                <div className="node-content">
                  <div className="node-point">
                    <div className="node-dot"></div>
                  </div>
                  <div className="node-text">
                    <AnimatedHeadline title={nodeBanking.title} as="h4" />
                    <p>{nodeBanking.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="orbit-node node-integrity node-right">
              <ScrollReveal delay={0.5}>
                <div className="node-content">
                  <div className="node-point">
                    <div className="node-dot"></div>
                  </div>
                  <div className="node-text">
                    <AnimatedHeadline title={nodeHealthcare.title} as="h4" />
                    <p>{nodeHealthcare.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="orbit-node node-construction node-left">
              <ScrollReveal delay={0.6}>
                <div className="node-content">
                  <div className="node-point">
                    <div className="node-dot"></div>
                  </div>
                  <div className="node-text">
                    <AnimatedHeadline title={nodeConstruction.title} as="h4" />
                    <p>{nodeConstruction.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="orbit-node node-trade node-right">
              <ScrollReveal delay={0.7}>
                <div className="node-content">
                  <div className="node-point">
                    <div className="node-dot"></div>
                  </div>
                  <div className="node-text">
                    <AnimatedHeadline title={nodeTrade.title} as="h4" />
                    <p>{nodeTrade.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>

        <div className="culture-footer">
          <Link href={buttonLink} className="btn culture-footer__btn">
            {buttonText}
            <svg
              className="btn-arrow"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
              style={locale === "ar" ? { transform: "rotate(180deg)", marginRight: "0.5rem" } : undefined}
            >
              <path d="M1 7h12M8 2l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CultureSection;
