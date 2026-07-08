import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import SmoothScroll from "../../components/SmoothScroll";
import GSAPAnimations from "../../components/GSAPAnimations";
import PageBanner from "../../components/PageBanner";
import ScrollReveal from "../../components/ScrollReveal";
import AnimatedHeadline from "../../components/AnimatedHeadline";
import ServicesCardSection from "../../components/ServicesCardSection";
import CultureSection from "../../components/CultureSection";
import ContactCta from "../../components/ContactCta";
import { siteCopy } from "@/lib/copy/en";

const messageImage = "/al-and images/Misty Urban Development.png";
const messageBottomImage = "/al-and images/Modern Office Interior.png";
const voicesImagePrimary = "/al-and images/Urban Skyline Under Blue Sky.png";

const { servicesPage } = siteCopy;

export const metadata = {
  title: siteCopy.meta.services.title,
  description: siteCopy.meta.services.description,
};

export default function ServicesPage() {
  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        <PageBanner
          title={servicesPage.banner.title}
          subtitle={servicesPage.banner.subtitle}
        />

        {/* ═══════════════ 1. MESSAGE ═══════════════ */}
        <section className="jobs-challenge jobs-section" id="message">
          <div className="about-grid">
            <div className="jobs-challenge__top about-grid__span-all">
              <div className="jobs-challenge__left about-grid__cols-1-6">
                <ScrollReveal>
                  <span className="jobs-section__label">{servicesPage.message.label}</span>
                </ScrollReveal>
                <AnimatedHeadline
                  title={servicesPage.message.headline}
                  className="jobs-challenge__headline"
                />
              </div>

              <div className="jobs-challenge__right about-grid__cols-7-12">
                <ScrollReveal delay={1}>
                  <div
                    className="jobs-challenge__image"
                    style={{ backgroundImage: `url("${messageImage}")` }}
                    role="img"
                    aria-label="Urban development representing growth and protection"
                  />
                </ScrollReveal>
              </div>
            </div>

            <div className="jobs-challenge__bottom about-grid__span-all">
              <div className="jobs-challenge__bottom-image about-grid__cols-1-5">
                <ScrollReveal>
                  <div
                    className="jobs-challenge__bottom-photo"
                    style={{ backgroundImage: `url("${messageBottomImage}")` }}
                    role="img"
                    aria-label="Modern office workspace"
                  />
                </ScrollReveal>
              </div>

              <div className="jobs-challenge__body about-grid__cols-7-12">
                <AnimatedHeadline
                  title={servicesPage.message.bodyTitle}
                  className="jobs-challenge__body-title"
                  as="h3"
                />
                <ScrollReveal delay={1}>
                  <div className="jobs-challenge__body-text">
                    {servicesPage.message.paragraphs.map((paragraph) => (
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
                  <span className="jobs-section__label">{servicesPage.industries.label}</span>
                </ScrollReveal>
                <AnimatedHeadline
                  title={servicesPage.industries.headline}
                  className="jobs-voices__headline"
                />
              </div>

              <div className="jobs-voices__images about-grid__cols-7-12">
                <ScrollReveal delay={1}>
                  <div
                    className="jobs-voices__image jobs-voices__image--primary"
                    style={{ backgroundImage: `url("${voicesImagePrimary}")` }}
                    role="img"
                    aria-label="Urban skyline representing sectors served across Iraq"
                  />
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 3. SERVICES CARDS ═══════════════ */}
        <ServicesCardSection id="services-card-section" />

        {/* ═══════════════ 4. INDUSTRIES DIAGRAM ═══════════════ */}
        <CultureSection />

        <ContactCta />

        <Footer />
      </SmoothScroll>
    </>
  );
}
