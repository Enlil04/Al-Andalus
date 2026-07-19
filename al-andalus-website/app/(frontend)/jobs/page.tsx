import PageShell from "../../components/PageShell";
import PageBanner from "../../components/PageBanner";
import ScrollReveal from "../../components/ScrollReveal";
import AnimatedHeadline from "../../components/AnimatedHeadline";
import JobsDescriptionList from "../../components/JobsDescriptionList";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";
import { fetchOpenJobs, fetchPagesContent } from "@/lib/cms/content";
import { IMAGE_FALLBACKS } from "@/lib/cms/fallbacks";

export async function generateMetadata() {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  return {
    title: siteCopy.meta.jobs.title,
    description: siteCopy.meta.jobs.description,
  };
}

export default async function JobsPage() {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  const { jobsPage } = siteCopy;
  const [jobs, pages] = await Promise.all([
    fetchOpenJobs(),
    fetchPagesContent(),
  ]);
  const cms = pages.jobs;

  return (
    <PageShell>
        <PageBanner
          title={cms.bannerTitle || jobsPage.banner.title}
          subtitle={cms.bannerSubtitle || jobsPage.banner.subtitle}
          imageSrc={
            cms.bannerImageUrl ??
            "/al-and images/businesspeople-open-hand-to-shaking-hands-in-offic-2026-03-13-01-59-19-utc.jpg"
          }
        />

        {/* ═══════════════ 1. MESSAGE ═══════════════ */}
        <section className="jobs-challenge jobs-section" id="message">
          <div className="about-grid">
            <div className="jobs-challenge__top about-grid__span-all">
              <div className="jobs-challenge__left about-grid__cols-1-6">
                <ScrollReveal>
                  <span className="jobs-section__label">{cms.messageLabel}</span>
                </ScrollReveal>
                <AnimatedHeadline
                  title={cms.messageHeadline}
                  className="jobs-challenge__headline"
                />
              </div>

              <div className="jobs-challenge__right about-grid__cols-7-12">
                <ScrollReveal delay={1}>
                  <div
                    className="jobs-challenge__image"
                    style={{ backgroundImage: `url("${cms.messageImageUrl ?? IMAGE_FALLBACKS.jobsMessage}")` }}
                    aria-hidden="true"
                  />
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 2. DEPARTMENTS ═══════════════ */}
        <JobsDescriptionList
          jobs={jobs}
          listingsEyebrow={cms.listingsEyebrow}
          listingsTitle={cms.listingsTitle}
        />
    </PageShell>
  );
}
