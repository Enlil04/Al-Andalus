import Header from "../../components/Header";
import FooterServer from "../../components/FooterServer";
import Loader from "../../components/Loader";
import SmoothScroll from "../../components/SmoothScroll";
import GSAPAnimations from "../../components/GSAPAnimations";
import PageBanner from "../../components/PageBanner";
import ScrollReveal from "../../components/ScrollReveal";
import AnimatedHeadline from "../../components/AnimatedHeadline";
import ServicesCardSection from "../../components/ServicesCardSection";
import CultureSection from "../../components/CultureSection";
import ContactCta from "../../components/ContactCta";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";
import { fetchAllProducts } from "@/lib/cms/content";

const messageImage = "/al-and images/5f32f6eefa193becbdd238d11fdd52aa.jpg";
const messageBottomImage = "/al-and images/Modern Office Interior.png";
const voicesImagePrimary = "/al-and images/Urban Skyline Under Blue Sky.png";

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
  const services = await fetchAllProducts();

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        <PageBanner
          title={servicesPage.banner.title}
          subtitle={servicesPage.banner.subtitle}
          imageSrc="/al-and images/extended-family-group-portrait-on-a-teal-sofa-2026-03-18-13-49-06-utc.jpg"
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
        <ServicesCardSection id="services-card-section" services={services} />

        {/* ═══════════════ 4. INDUSTRIES DIAGRAM ═══════════════ */}
        <CultureSection />

        <ContactCta />

        <FooterServer />
      </SmoothScroll>
    </>
  );
}
