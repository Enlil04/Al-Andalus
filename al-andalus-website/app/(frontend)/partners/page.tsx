import Image from "next/image";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import SmoothScroll from "../../components/SmoothScroll";
import GSAPAnimations from "../../components/GSAPAnimations";
import PageBanner from "../../components/PageBanner";
import ScrollReveal from "../../components/ScrollReveal";
import AnimatedHeadline from "../../components/AnimatedHeadline";
import ContactCta from "../../components/ContactCta";
import "./Partners.css";

export const metadata = {
  title: "Partners & Clients | Al-Andalus Insurance International",
  description:
    "Our trusted partners and clients across Iraq — banks, corporations, government entities, and businesses that rely on Al-Andalus Insurance.",
};

export default async function PartnersPage() {
  const payload = await getPayload({ config: configPromise });

  const { docs: partners } = await payload.find({
    collection: "partners",
    limit: 100,
    sort: "order",
  });

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        <PageBanner title="PARTNERS" subtitle="Our Trusted Network" />

        {/* ═══════════════ INTRO ═══════════════ */}
        <section className="partners-page__intro jobs-section">
          <div className="about-grid">
            <div className="about-grid__cols-1-6">
              <ScrollReveal>
                <span className="jobs-section__label">( Network )</span>
              </ScrollReveal>
              <AnimatedHeadline
                title="Building Trust Across Iraq"
                className="partners-page__headline"
              />
            </div>
            <div className="about-grid__cols-7-12">
              <ScrollReveal delay={1}>
                <p className="partners-page__desc">
                  Al-Andalus Insurance works alongside leading banks,
                  corporations, government institutions, and private businesses
                  across Iraq. These partnerships reflect years of reliable
                  underwriting, consistent claim settlement, and shared
                  commitment to economic growth.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ═══════════════ PARTNERS GRID ═══════════════ */}
        <section className="partners-page__grid-section">
          <div className="partners-page__container">
            <div className="partners-page__grid">
              {partners.length > 0 ? (
                partners.map((partner, i) => {
                  const logoUrl =
                    partner.logo && typeof partner.logo !== "string"
                      ? partner.logo.url
                      : null;
                  const websiteUrl = partner.website as string | null;

                  const CardContent = (
                    <>
                      <span className="partner-page-card__num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="partner-page-card__logo">
                        {logoUrl ? (
                          <Image
                            src={logoUrl}
                            alt={partner.name as string}
                            width={180}
                            height={100}
                            style={{ objectFit: "contain" }}
                          />
                        ) : (
                          <span className="partner-page-card__text">
                            {partner.name as string}
                          </span>
                        )}
                      </div>
                      <span className="partner-page-card__name">
                        {partner.name as string}
                      </span>
                    </>
                  );

                  return (
                    <ScrollReveal key={partner.id} delay={(i % 4) + 1}>
                      {websiteUrl ? (
                        <a
                          href={websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="partner-page-card partner-page-card--link"
                        >
                          {CardContent}
                        </a>
                      ) : (
                        <div className="partner-page-card">{CardContent}</div>
                      )}
                    </ScrollReveal>
                  );
                })
              ) : (
                <ScrollReveal>
                  <p className="partners-page__empty">
                    No partners listed yet.
                  </p>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>

        <ContactCta />

        <Footer />
      </SmoothScroll>
    </>
  );
}
