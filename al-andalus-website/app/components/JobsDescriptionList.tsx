"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";
import JobsDescriptionScroll from "./JobsDescriptionScroll";
import { getSiteCopy } from "@/lib/copy";
import { useLocale } from "./LocaleProvider";
import Link from "next/link";
import type { JobListItem } from "@/lib/cms/content";
import { slugify } from "@/lib/cms/format";

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

type JobsDescriptionListProps = {
  jobs?: JobListItem[];
  listingsEyebrow?: string;
  listingsTitle?: string;
};

export default function JobsDescriptionList({
  jobs,
  listingsEyebrow,
  listingsTitle,
}: JobsDescriptionListProps) {
  const { locale } = useLocale();
  const siteCopy = getSiteCopy(locale);
  const { listings } = siteCopy.jobsPage;

  const cmsJobs =
    jobs ??
    listings.jobs.map((job) => ({
      slug: slugify(job.title),
      title: job.title,
      department: job.category,
    }));

  const categories = [
    locale === "ar" ? "الكل" : "ALL",
    ...Array.from(new Set(cmsJobs.map((job) => job.department))),
  ];

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
      ? cmsJobs
      : cmsJobs.filter((job) => job.department === activeCategory);

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

  return (
    <section className="jobs-description" id="job-description">
      <JobsDescriptionScroll />

      <div className="about-grid">
        <div className="jobs-description__header about-grid__span-all">
          <ScrollReveal>
            <p className="jobs-description__eyebrow">{listingsEyebrow ?? listings.eyebrow}</p>
          </ScrollReveal>
          <AnimatedHeadline
            title={listingsTitle ?? listings.title}
            className="jobs-description__title"
          />
        </div>

        <div className="jobs-description__layout about-grid__span-all">
          <nav
            className="jobs-description__filters"
            aria-label={locale === "ar" ? "فئات الوظائف" : "Job categories"}
          >
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
            {filteredJobs.map((job) => (
              <li key={job.slug} className="jobs-description__item">
                <Link href={`/jobs/${job.slug}`} className="jobs-description__link w-full text-left">
                  <span className="jobs-description__job-title">{job.title}</span>
                  <span className="jobs-description__chevron">
                    <ChevronIcon isRtl={locale === "ar"} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
