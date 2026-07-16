import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import ScrollReveal from "../components/ScrollReveal";
import SmoothScroll from "../components/SmoothScroll";
import GSAPAnimations from "../components/GSAPAnimations";
import AnimatedHeadline from "../components/AnimatedHeadline";
import NewsList from "../components/NewsList";
import FAQ from "../components/FAQ";
import ContactCta from "../components/ContactCta";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { getFeaturedServices } from "@/lib/services";
import { getFaqItems } from "@/lib/faq";
import { getLocale } from "@/lib/locale";
import { getSiteCopy } from "@/lib/copy";
import { fetchHomepageContent } from "@/lib/cms/content";

export async function generateMetadata() {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  return {
    title: siteCopy.meta.home.title,
    description: siteCopy.meta.home.description,
  };
}

export default async function Home() {
  const payload = await getPayload({ config: configPromise });
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);

  const { docs: newsItems } = await payload.find({
    collection: "news",
    limit: 5,
    sort: "-publishedDate",
    locale,
    where: {
      status: { equals: "published" },
    },
  });

  const homepageContent = await fetchHomepageContent(payload);
  const { intro, story, aboutPreview, contactCta } = homepageContent;

  const featuredServices = getFeaturedServices(locale);

  const { docs: partners } = await payload.find({
    collection: "partners",
    limit: 8,
    sort: "order",
    locale,
  });

  const firstRowPartners = partners.slice(0, 2);
  const secondRowPartners = partners.slice(2, 5);
  const thirdRowPartners = partners.slice(5, 8);

  const servicesHeadline = locale === "ar" ? "خدماتنا" : "OUR\nSERVICES";
  const viewAllServicesLabel = locale === "ar" ? "عرض جميع الخدمات" : "View all services";
  const whyUsLabel = locale === "ar" ? "( لماذا الأندلس )" : "( WHY AL-ANDALUS )";
  const newsLabel = locale === "ar" ? "( الأخبار )" : "( News )";
  const newsTitle = locale === "ar" ? "أحدث الأخبار" : "Latest Updates";
  const viewAllLabel = locale === "ar" ? "عرض الكل" : "View All";
  const partnersTitle = locale === "ar" ? "الشركاء\nوالعملاء" : "PARTNERS\nCLIENTS";
  const noPartnersLabel = locale === "ar" ? "لا يوجد شركاء." : "No partners found.";
  const viewAllPartnersLabel = locale === "ar" ? "عرض جميع الشركاء" : "View all partners";

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <div className="hero-track" id="hero">
          <section className="hero">
            <div className="hero__media">
              <video
                src="/al-and%20images/e089f973-10d9-4cf2-b693-fa9f22764c76.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <div className="hero__content">
              <div className="hero__titles">
                <AnimatedHeadline
                  title={siteCopy.hero.headline}
                  className="hero__title hero__title--left"
                  as="h1"
                  immediate
                  delay={2.2}
                />
                <AnimatedHeadline
                  title={siteCopy.hero.headlineRight}
                  className="hero__title hero__title--right"
                  as="h2"
                  deferAnimation
                />
              </div>
              <p className="hero__scroll">{siteCopy.hero.scrollLabel}</p>
            </div>
          </section>
        </div>

        {/* ═══════════════ INTRODUCTION ═══════════════ */}
        <section className="intro" id="intro">
          <div className="intro__content">
            <div className="intro__left">
              <AnimatedHeadline
                title={intro.titleLines.join("\n")}
                className="intro__title"
              />
              <ScrollReveal delay={1}>
                <p className="intro__lead">
                  {intro.lead}
                </p>
              </ScrollReveal>
            </div>

            <div className="intro__right">
              <ScrollReveal delay={2}>
                <Image
                  src="/al-and images/close-up-glass-water-pen.jpg"
                  alt="Al Andalus"
                  width={300}
                  height={188}
                  className="intro__image"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ═══════════════ STORY SECTION ═══════════════ */}
        <section className="story" id="story">
          <div className="story__content">
            <div className="story__images">
              <Image
                src="/al-and images/IMG_6081.JPG"
                alt="Story large image"
                width={640}
                height={900}
                className="story__image story__image--large"
                style={{ objectFit: "cover" }}
              />
              <Image
                src="/al-and images/3cec34a2-2758-4570-910e-32a896e080de.jpg"
                alt="Story small image"
                width={300}
                height={280}
                className="story__image story__image--small"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="story__text">
              <ScrollReveal>
                {story.paragraphs.slice(0, 1).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </ScrollReveal>
              <ScrollReveal delay={1}>
                {story.paragraphs.slice(1).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <Link href={story.ctaLink} className="story__btn">
                  {story.ctaText}
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ═══════════════ EXPANDING IMAGE ═══════════════ */}
        <section className="expanding-section" id="expanding-image">
          <div className="expanding-image" />
        </section>

        {/* ═══════════════ ABOUT SECTION (PINNED) ═══════════════ */}
        <section className="about-pinned" id="about">
          <div className="about-pinned__sticky">
            <div className="about-pinned__text-center">
              <span className="about-pinned__label">{aboutPreview.label}</span>
              <AnimatedHeadline
                title={aboutPreview.headline}
                className="about-pinned__title"
              />
            </div>
            <div className="about-pinned__text-bottom">
              <p>
                {aboutPreview.text.split("\n").map((line, idx) => (
                  <span key={idx}>
                    {idx > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="about-pinned__images">
            <div className="about-img about-img--1" />
            <div className="about-img about-img--2" />
            <div className="about-img about-img--3" />
            <div className="about-img about-img--4" />
          </div>
        </section>

        {/* ═══════════════ SERVICES SPLIT SECTION ═══════════════ */}
        <section className="services-split" id="services">
          <div className="services-split__left">
            <div className="services-split__sticky">
              <AnimatedHeadline
                title={servicesHeadline}
                className="services-split__title"
              />
              <div className="services-split__footer">
                <Link href="/services" className="btn">
                  {viewAllServicesLabel}
                  <svg
                    className="btn-arrow"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M1 7h12M8 2l5 5-5 5" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="services-split__right">
            {featuredServices.map((svc, i) => (
              <div
                className="service-card"
                key={svc.slug}
                style={{ top: `calc(100px + ${i * 40}px)` }}
              >
                <div className="service-card__content">
                  <span className="service-card__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="service-card__text">
                    <h3 className="service-card__title">
                      <AnimatedHeadline title={svc.title} as="span" />
                      {svc.subtitle && (
                        <span className="service-card__subtitle">
                          {" "}
                          — {svc.subtitle}
                        </span>
                      )}
                    </h3>
                    <p className="service-card__desc">{svc.description}</p>
                    <Link
                      href={`/services/${svc.slug}`}
                      className="service-card__btn"
                      aria-label={locale === "ar" ? `اقرأ المزيد عن ${svc.title}` : `Read more about ${svc.title}`}
                    >
                      +
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ WHY CHOOSE AL-ANDALUS ═══════════════ */}
        <section className="vs-section" id="why-us">
          <div className="vs-overlay">
            <div className="vs-overlay__sticky">
              <span className="vs-overlay__label">{whyUsLabel}</span>
              <AnimatedHeadline
                title={siteCopy.whyUs.headline}
                className="vs-overlay__title"
              />
              <p className="vs-overlay__desc">
                {siteCopy.whyUs.desc.split("\n").map((line, idx) => (
                  <span key={idx}>
                    {idx > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="vs-grid">
            {[
              "/al-and images/conference-1.jpg",
              "/al-and images/conference-2.jpg",
              "/al-and images/conference-3.jpg",
              "/al-and images/conference-4.jpg",
              "/al-and images/IMG_5713.JPG",
              "/al-and images/IMG_6081.JPG",
            ].map((src) => (
              <div className="vs-card" key={src}>
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className="vs-card__image"
                />
                <div className="vs-card__bg" aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ NEWS ═══════════════ */}
        <section className="news" id="news">
          <div className="news__header">
            <div>
              <ScrollReveal>
                <p className="news__label">{newsLabel}</p>
              </ScrollReveal>
              <AnimatedHeadline title={newsTitle} className="news__title" />
            </div>
          </div>

          <NewsList
            items={newsItems.map((item) => ({
              id: item.id,
              title: item.title as string,
              slug: item.slug as string,
              publishedDate: item.publishedDate as string | null,
              category: item.category as string | null,
              excerpt: item.excerpt as string | null,
              imageUrl: item.coverImage && typeof item.coverImage !== "string" ? item.coverImage.url : null,
            }))}
          />

          <div className="news__footer">
            <ScrollReveal delay={2}>
              <Link href="/blogs" className="btn">
                {viewAllLabel}
                <svg
                  className="btn-arrow"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M1 7h12M8 2l5 5-5 5" />
                </svg>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════ PARTNERS ═══════════════ */}
        <section className="partners-grid-section" id="partners">
          <div className="partners-grid-section__container">
            <div className="partners-grid-section__header">
              <AnimatedHeadline
                title={partnersTitle}
                className="partners-grid-section__title"
              />
            </div>

            <div className="partners-grid-section__content">
              {partners.length > 0 ? (
                <div className="partners-grid-section__row partners-grid-section__row--two">
                  {firstRowPartners.map((partner, i) => {
                    const logoUrl =
                      partner.logo && typeof partner.logo !== "string"
                        ? partner.logo.url
                        : null;
                    const variant =
                      (i + 1) % 4 === 2
                        ? "partner-grid-card--red"
                        : (i + 1) % 4 === 3
                          ? "partner-grid-card--gold"
                          : "";

                    return (
                      <ScrollReveal key={partner.id} delay={(i % 3) + 1}>
                        <div className={`partner-grid-card ${variant}`.trim()}>
                          <span className="partner-grid-card__num">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="partner-grid-card__logo">
                            {logoUrl ? (
                              <Image
                                src={logoUrl}
                                alt={partner.name as string}
                                width={150}
                                height={80}
                                style={{ objectFit: "contain" }}
                              />
                            ) : (
                              <span className="partner-grid-card__text">
                                {partner.name as string}
                              </span>
                            )}
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>
              ) : (
                <p>{noPartnersLabel}</p>
              )}
            </div>
          </div>

          {partners.length > 0 && (
            <div className="partners-grid-section__full-width-container">
              {secondRowPartners.length > 0 && (
                <div className="partners-grid-section__row partners-grid-section__row--three">
                  {secondRowPartners.map((partner, i) => {
                    const index = i + 2;
                    const logoUrl =
                      partner.logo && typeof partner.logo !== "string"
                        ? partner.logo.url
                        : null;
                    const variant =
                      (index + 1) % 4 === 2
                        ? "partner-grid-card--red"
                        : (index + 1) % 4 === 3
                          ? "partner-grid-card--gold"
                          : "";

                    return (
                      <ScrollReveal key={partner.id} delay={(i % 3) + 1}>
                        <div className={`partner-grid-card ${variant}`.trim()}>
                          <span className="partner-grid-card__num">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="partner-grid-card__logo">
                            {logoUrl ? (
                              <Image
                                src={logoUrl}
                                alt={partner.name as string}
                                width={150}
                                height={80}
                                style={{ objectFit: "contain" }}
                              />
                            ) : (
                              <span className="partner-grid-card__text">
                                {partner.name as string}
                              </span>
                            )}
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>
              )}

              {thirdRowPartners.length > 0 && (
                <div className="partners-grid-section__row partners-grid-section__row--three">
                  {thirdRowPartners.map((partner, i) => {
                    const index = i + 5;
                    const logoUrl =
                      partner.logo && typeof partner.logo !== "string"
                        ? partner.logo.url
                        : null;
                    const variant =
                      (index + 1) % 4 === 2
                        ? "partner-grid-card--red"
                        : (index + 1) % 4 === 3
                          ? "partner-grid-card--gold"
                          : "";

                    return (
                      <ScrollReveal key={partner.id} delay={(i % 3) + 1}>
                        <div className={`partner-grid-card ${variant}`.trim()}>
                          <span className="partner-grid-card__num">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="partner-grid-card__logo">
                            {logoUrl ? (
                              <Image
                                src={logoUrl}
                                alt={partner.name as string}
                                width={150}
                                height={80}
                                style={{ objectFit: "contain" }}
                              />
                            ) : (
                              <span className="partner-grid-card__text">
                                {partner.name as string}
                              </span>
                            )}
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>
              )}

              <div className="partners-grid-section__footer">
                <ScrollReveal delay={2}>
                  <Link href="/partners" className="btn">
                    {viewAllPartnersLabel}
                    <svg
                      className="btn-arrow"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M1 7h12M8 2l5 5-5 5" />
                    </svg>
                  </Link>
                </ScrollReveal>
              </div>
            </div>
          )}
        </section>

        {/* ═══════════════ FAQ ═══════════════ */}
        <FAQ items={getFaqItems(locale)} />

        <ContactCta />

        <Footer />
      </SmoothScroll>
    </>
  );
}
