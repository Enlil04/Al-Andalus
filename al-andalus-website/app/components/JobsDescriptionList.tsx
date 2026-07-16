"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";
import JobsDescriptionScroll from "./JobsDescriptionScroll";
import { getSiteCopy } from "@/lib/copy";
import { useLocale } from "./LocaleProvider";
import Link from "next/link";

function slugify(text: string) {
  // Replace custom characters to match URL format
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-") // Support Arabic chars in slug if any, else fallback
    .replace(/[^a-z0-9]+/g, "-") // Standard URL clean
    .replace(/(^-|-$)+/g, "");
}

function ChevronIcon({ isRtl }: { isRtl: boolean }) {
  return (
    <svg 
      width="16" 
      height="12" 
      viewBox="0 0 16 12" 
      fill="none" 
      aria-hidden="true"
      style={isRtl ? { transform: "rotate(180deg)" } : undefined}
    >
      <path
        d="M1 1L7 6L1 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 1L14 6L8 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function JobsDescriptionList() {
  const { locale } = useLocale();
  const siteCopy = getSiteCopy(locale);
  const { listings } = siteCopy.jobsPage;
  const categories = listings.categories;

  const allLabel = locale === "ar" ? "الكل" : "ALL";

  const [activeCategory, setActiveCategory] = useState<string>(allLabel);
  const listRef = useRef<HTMLUListElement>(null);
  const isFirstRender = useRef(true);

  // Sync active category if locale changes
  useEffect(() => {
    setActiveCategory(locale === "ar" ? "الكل" : "ALL");
  }, [locale]);

  const filteredJobs =
    activeCategory === allLabel
      ? listings.jobs
      : listings.jobs.filter((job) => job.category === activeCategory);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const list = listRef.current;
    if (!list) return;

    const items = list.querySelectorAll<HTMLElement>(".jobs-description__item");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || items.length === 0) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.06,
        ease: "power3.out",
        overwrite: "auto",
      }
    );
  }, [activeCategory]);

  // We need to slugify english equivalent for static jobs links so routing doesn't break
  const getJobSlug = (jobTitle: string) => {
    // Check if it's the corporate accounting job
    if (jobTitle.includes("Accounting") || jobTitle.includes("الشؤون الإدارية")) {
      return "corporate-affairs-accounting";
    }
    if (jobTitle.includes("Field Agent") || jobTitle.includes("ميداني")) {
      return "insurance-field-agent";
    }
    if (jobTitle.includes("Underwriting") || jobTitle.includes("اكتتاب")) {
      return "underwriting-specialist";
    }
    if (jobTitle.includes("Claims") || jobTitle.includes("مطالبات")) {
      return "claims-officer";
    }
    if (jobTitle.includes("Technical Sales") || jobTitle.includes("مبيعات فنية")) {
      return "technical-sales-representative";
    }
    return slugify(jobTitle);
  };

  return (
    <section className="jobs-description" id="job-description">
      <JobsDescriptionScroll />

      <div className="about-grid">
        <div className="jobs-description__header about-grid__span-all">
          <ScrollReveal>
            <p className="jobs-description__eyebrow">{listings.eyebrow}</p>
          </ScrollReveal>
          <AnimatedHeadline title={listings.title} className="jobs-description__title" />
        </div>

        <div className="jobs-description__layout about-grid__span-all">
          <nav className="jobs-description__filters" aria-label="Job categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`jobs-description__filter ${
                  activeCategory === category ? "jobs-description__filter--active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </nav>

          <ul ref={listRef} className="jobs-description__list" key={activeCategory}>
            {filteredJobs.map((job) => {
              const jobSlug = getJobSlug(job.title);
              return (
                <li key={job.title} className="jobs-description__item">
                  <Link href={`/jobs/${jobSlug}`} className="jobs-description__link w-full text-left">
                    <span className="jobs-description__job-title">{job.title}</span>
                    <span className="jobs-description__chevron">
                      <ChevronIcon isRtl={locale === "ar"} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
