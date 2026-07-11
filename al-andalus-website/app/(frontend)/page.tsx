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
import { faqItems } from "@/lib/faq";

export default async function Home() {
  const payload = await getPayload({ config: configPromise });

  const { docs: newsItems } = await payload.find({
    collection: "news",
    limit: 5,
    sort: "-publishedDate",
    where: {
      status: { equals: "published" },
    },
  });

  const featuredServices = getFeaturedServices();

  const { docs: partners } = await payload.find({
    collection: "partners",
    limit: 8,
    sort: "order",
  });

  const firstRowPartners = partners.slice(0, 2);
  const secondRowPartners = partners.slice(2, 5);
  const thirdRowPartners = partners.slice(5, 8);

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="hero" id="hero">
          <div className="hero__media">
            <video
              src="/al-and%20images/magnific_a-cinematic-slowmotion-sh_y6Lq5THPW9.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>

          <div className="hero__bottom">
            <AnimatedHeadline
              title="When the risks are real, your insurer should be too."
              className="hero__title"
              as="h1"
              immediate
              delay={2.2}
            />
            <p className="hero__scroll">( SCROLL DOWN )</p>
          </div>
        </section>

        {/* ═══════════════ INTRODUCTION ═══════════════ */}
        <section className="intro" id="intro">
          <div className="intro__content">
            <div className="intro__left">
              <AnimatedHeadline
                title={"Al Andalus\ninternational\ninsurance"}
                className="intro__title"
              />
              <ScrollReveal delay={1}>
                <p className="intro__lead">
                  Incorporated in 2015 under Iraqi Companies Law No. 21 of 1997.
                  Licensed for general insurance by the Ministry of Finance —
                  License 38/2018, under Insurance Business Regulation Law No. 10
                  of 2005. Authorized capital: 21 billion Iraqi dinars.
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
              <div
                className="story__image story__image--large"
                aria-hidden="true"
              />
              <Image
                src="/al-and images/WhatsApp Image 2026-05-18 at 1.33.44 PM.jpeg"
                alt="Story small image"
                width={300}
                height={280}
                className="story__image story__image--small"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="story__text">
              <ScrollReveal>
                <p>
                  Since 2015, Al-Andalus has focused on insurance solutions
                  that keep pace with economic and social change in Iraq.
                  <br />
                  We invested in qualified people — and built a reputation in
                  the market by doing the work properly.
                  <br />
                  Our team spans four branches: Baghdad, Basrah, Erbil, and
                  Mansour.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={1}>
                <p>
                  Demand for insurance grows with rising incomes, sharper risk
                  awareness, and more varied needs — from individuals to large
                  institutions.
                  <br />
                  A company at this level is not a luxury in Iraq&apos;s
                  economy. It is part of how stability gets built.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <Link href="#about" className="story__btn">
                  READ MORE
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
              <span className="about-pinned__label">( ABOUT )</span>
              <AnimatedHeadline
                title={"HERE FOR\nTHE LONG\nRUN"}
                className="about-pinned__title"
              />
            </div>
            <div className="about-pinned__text-bottom">
              <p>
                Founded 13 September 2015. Licensed general insurer.
                <br />
                Twenty-one billion dinars in authorized capital.
                <br />
                Four branches. One team — technical and administrative
                specialists working across Iraq.
                <br />
                Insurance that matches how this country actually operates.
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
                title={"OUR\nSERVICES"}
                className="services-split__title"
              />
              <div className="services-split__footer">
                <Link href="/services" className="btn">
                  View all services
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
                      href={`/services#${svc.slug}`}
                      className="service-card__btn"
                      aria-label={`Read more about ${svc.title}`}
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
              <span className="vs-overlay__label">( WHY AL-ANDALUS )</span>
              <AnimatedHeadline
                title={"MORE THAN\nA POLICY"}
                className="vs-overlay__title"
              />
              <p className="vs-overlay__desc">
                Insurance is not just a contract on paper.
                <br />
                It is how people and institutions stay standing
                <br />
                when something goes wrong.
              </p>
            </div>
          </div>

          <div className="vs-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div className="vs-card" key={item}>
                <div className="vs-card__bg" />
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ NEWS ═══════════════ */}
        <section className="news" id="news">
          <div className="news__header">
            <div>
              <ScrollReveal>
                <p className="news__label">( News )</p>
              </ScrollReveal>
              <AnimatedHeadline title="Latest Updates" className="news__title" />
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
                View All
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
                title={"PARTNERS\nCLIENTS"}
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
                <p>No partners found.</p>
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
                    View all partners
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
        <FAQ items={faqItems} />

        <ContactCta />

        <Footer />
      </SmoothScroll>
    </>
  );
}
