"use client";

import React, { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";
import { contactInfo } from "@/lib/contact";
import { siteCopy } from "@/lib/copy/en";
import "./RequestQuoteContact.css";

const { contact: contactCopy } = siteCopy.requestQuotePage;

export default function RequestQuoteContact() {
  const [activeBranchId, setActiveBranchId] = useState<string>("baghdad");

  const activeBranch =
    contactInfo.branches.find((b) => b.id === activeBranchId) ??
    contactInfo.branches[0];

  return (
    <section className="quote-contact" id="visit-us">
      <div className="about-grid quote-contact__grid">
        <div className="quote-contact__intro-col about-grid__cols-1-5">
          <ScrollReveal>
            <span className="quote-contact__label">{contactCopy.label}</span>
          </ScrollReveal>
          <AnimatedHeadline
            title={contactCopy.headline}
            className="quote-contact__headline"
            as="h2"
          />
          <ScrollReveal delay={1}>
            <p className="quote-contact__intro">{contactCopy.intro}</p>
          </ScrollReveal>
        </div>

        <div className="quote-contact__info about-grid__cols-1-5">
          <div className="quote-contact__card">
            <p className="quote-contact__card-label">{contactCopy.generalInquiries}</p>
            <ul className="quote-contact__list">
              <li>
                <span className="quote-contact__list-key">Shortcode</span>
                <span className="quote-contact__list-value">{contactInfo.shortcode}</span>
              </li>
              <li>
                <span className="quote-contact__list-key">Phone</span>
                <a href={contactInfo.phoneHref} className="quote-contact__list-value quote-contact__link">
                  {contactInfo.phone}
                </a>
              </li>
            </ul>
          </div>

          <div className="quote-contact__branches">
            <p className="quote-contact__card-label">{contactCopy.branches}</p>
            <ul className="quote-contact__branch-list">
              {contactInfo.branches.map((branch) => (
                <li key={branch.id}>
                  <button
                    type="button"
                    onClick={() => setActiveBranchId(branch.id)}
                    className={`quote-contact__branch-btn ${
                      activeBranchId === branch.id ? "is-active" : ""
                    }`}
                  >
                    <span className="quote-contact__branch-dot" aria-hidden="true" />
                    <div>
                      <p className="quote-contact__branch-city">{branch.label}</p>
                      <p className="quote-contact__branch-area">{branch.area}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="quote-contact__map-wrap about-grid__cols-7-12">
          <ScrollReveal delay={1}>
            <div className="quote-contact__map">
              <iframe
                key={activeBranchId}
                title={`Al-Andalus International Insurance — ${activeBranch.label} branch area`}
                src={activeBranch.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a
              href={activeBranch.mapLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="quote-contact__map-link"
            >
              {contactCopy.mapLink}
              <svg className="quote-contact__map-arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M1 7h12M8 2l5 5-5 5" />
              </svg>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
