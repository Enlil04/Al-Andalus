import Header from "../../components/Header";
import Loader from "../../components/Loader";
import SmoothScroll from "../../components/SmoothScroll";
import GSAPAnimations from "../../components/GSAPAnimations";
import PageBanner from "../../components/PageBanner";
import ScrollReveal from "../../components/ScrollReveal";
import AnimatedHeadline from "../../components/AnimatedHeadline";
import JobsDescriptionList from "../../components/JobsDescriptionList";
import ContactCta from "../../components/ContactCta";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";
import { fetchOpenJobs } from "@/lib/cms/content";
import FooterServer from "../../components/FooterServer";

const challengeImage = "/al-and images/Misty Urban Development.png";

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
  const jobs = await fetchOpenJobs();

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        <PageBanner
          title={jobsPage.banner.title}
          subtitle={jobsPage.banner.subtitle}
          imageSrc="/al-and images/businesspeople-open-hand-to-shaking-hands-in-offic-2026-03-13-01-59-19-utc.jpg"
        />

        {/* ═══════════════ 1. MESSAGE ═══════════════ */}
        <section className="jobs-challenge jobs-section" id="message">
          <div className="about-grid">
            <div className="jobs-challenge__top about-grid__span-all">
              <div className="jobs-challenge__left about-grid__cols-1-6">
                <ScrollReveal>
                  <span className="jobs-section__label">{jobsPage.message.label}</span>
                </ScrollReveal>
                <AnimatedHeadline
                  title={jobsPage.message.headline}
                  className="jobs-challenge__headline"
                />
              </div>

              <div className="jobs-challenge__right about-grid__cols-7-12">
                <ScrollReveal delay={1}>
                  <div
                    className="jobs-challenge__image"
                    style={{ backgroundImage: `url("${challengeImage}")` }}
                    role="img"
                    aria-label="Urban development representing growth across Iraq"
                  />
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 2. DEPARTMENTS ═══════════════ */}
        <JobsDescriptionList jobs={jobs} />

        <ContactCta />

        <FooterServer />
      </SmoothScroll>
    </>
  );
}
