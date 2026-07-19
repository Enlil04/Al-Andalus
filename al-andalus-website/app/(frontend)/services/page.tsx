import PageShell from "../../components/PageShell";
import PageBanner from "../../components/PageBanner";
import ScrollReveal from "../../components/ScrollReveal";
import AnimatedHeadline from "../../components/AnimatedHeadline";
import ServicesCardSection from "../../components/ServicesCardSection";
import CultureSection from "../../components/CultureSection";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";
import { fetchAllProducts, fetchPagesContent } from "@/lib/cms/content";
import { IMAGE_FALLBACKS } from "@/lib/cms/fallbacks";

export async function generateMetadata() {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  return {
    title: siteCopy.meta.services.title,
    description: siteCopy.meta.services.description,
  };
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  const { servicesPage } = siteCopy;
  const [services, pages] = await Promise.all([
    fetchAllProducts(),
    fetchPagesContent(),
  ]);
  const cms = pages.services;

  return (
    <PageShell>
        <PageBanner
          title={cms.bannerTitle || servicesPage.banner.title}
          subtitle={cms.bannerSubtitle || servicesPage.banner.subtitle}
          imageSrc={
            cms.bannerImageUrl ??
            "/al-and images/extended-family-group-portrait-on-a-teal-sofa-2026-03-18-13-49-06-utc.jpg"
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
                    style={{ backgroundImage: `url("${cms.messageImageUrl ?? IMAGE_FALLBACKS.servicesMessage}")` }}
                    aria-hidden="true"
                  />
                </ScrollReveal>
              </div>
            </div>

            <div className="jobs-challenge__bottom about-grid__span-all">
              <div className="jobs-challenge__bottom-image about-grid__cols-1-5">
                <ScrollReveal>
                  <div
                    className="jobs-challenge__bottom-photo"
                    style={{ backgroundImage: `url("${cms.messageBottomImageUrl ?? IMAGE_FALLBACKS.servicesMessageBottom}")` }}
                    aria-hidden="true"
                  />
                </ScrollReveal>
              </div>

              <div className="jobs-challenge__body about-grid__cols-7-12">
                <AnimatedHeadline
                  title={cms.messageBodyTitle}
                  className="jobs-challenge__body-title"
                  as="h3"
                />
                <ScrollReveal delay={1}>
                  <div className="jobs-challenge__body-text">
                    {cms.messageParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 2. INDUSTRIES ═══════════════ */}
        <section className="jobs-voices jobs-section" id="industries">
          <div className="about-grid">
            <div className="jobs-voices__top about-grid__span-all">
              <div className="jobs-voices__left about-grid__cols-1-6">
                <ScrollReveal>
                  <span className="jobs-section__label">{cms.industriesLabel}</span>
                </ScrollReveal>
                <AnimatedHeadline
                  title={cms.industriesHeadline}
                  className="jobs-voices__headline"
                />
              </div>

              <div className="jobs-voices__images about-grid__cols-7-12">
                <ScrollReveal delay={1}>
                  <div
                    className="jobs-voices__image jobs-voices__image--primary"
                    style={{ backgroundImage: `url("${cms.industriesImageUrl ?? IMAGE_FALLBACKS.servicesIndustries}")` }}
                    aria-hidden="true"
                  />
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 3. SERVICES CARDS ═══════════════ */}
        <ServicesCardSection id="services-card-section" services={services} />

        {/* ═══════════════ 4. INDUSTRIES DIAGRAM ═══════════════ */}
        <CultureSection
          label={cms.industriesLabel}
          headline={cms.industriesHeadline}
          coreTitle={cms.industriesCoreTitle}
          buttonText={cms.industriesButtonText}
          buttonLink={cms.industriesButtonLink}
          sectors={cms.sectors}
        />
    </PageShell>
  );
}
