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
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";
import "./Partners.css";

export async function generateMetadata() {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  
  // Custom metadata for Arabic
  const title = locale === "ar" 
    ? "الشركاء والعملاء | شركة الأندلس للتأمين الدولي" 
    : "Partners & Clients | Al-Andalus Insurance International";
  const description = locale === "ar" 
    ? "شركاؤنا وعملاؤنا الموثوقون في جميع أنحاء العراق — البنوك، الشركات، المؤسسات الحكومية، والجهات التجارية التي تعتمد على خدمات الأندلس للتأمين." 
    : "Our trusted partners and clients across Iraq — banks, corporations, government entities, and businesses that rely on Al-Andalus Insurance.";

  return {
    title,
    description,
  };
}

export default async function PartnersPage() {
  const payload = await getPayload({ config: configPromise });
  const locale = await getLocale();

  const { docs: partners } = await payload.find({
    collection: "partners",
    limit: 100,
    sort: "order",
    locale,
  });

  const bannerTitle = locale === "ar" ? "الشركاء" : "PARTNERS";
  const bannerSubtitle = locale === "ar" ? "شبكتنا الموثوقة" : "Our Trusted Network";
  const label = locale === "ar" ? "( الشبكة )" : "( Network )";
  const headline = locale === "ar" ? "بناء الثقة في جميع أنحاء العراق" : "Building Trust Across Iraq";
  const desc = locale === "ar" 
    ? "تعمل شركة الأندلس للتأمين الدولي جنباً إلى جنب مع كبرى المصارف، الشركات، المؤسسات الحكومية، وشركات القطاع الخاص في العراق. تعكس هذه الشراكات سنوات من الاكتتاب الموثوق، والالتزام المستمر بتسوية المطالبات، والمساهمة الفاعلة في النمو الاقتصادي." 
    : "Al-Andalus Insurance works alongside leading banks, corporations, government institutions, and private businesses across Iraq. These partnerships reflect years of reliable underwriting, consistent claim settlement, and shared commitment to economic growth.";
  const emptyLabel = locale === "ar" ? "لا يوجد شركاء مدرجون حالياً." : "No partners listed yet.";

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        <PageBanner title={bannerTitle} subtitle={bannerSubtitle} />

        {/* ═══════════════ INTRO ═══════════════ */}
        <section className="partners-page__intro jobs-section">
          <div className="about-grid">
            <div className="about-grid__cols-1-6">
              <ScrollReveal>
                <span className="jobs-section__label">{label}</span>
              </ScrollReveal>
              <AnimatedHeadline
                title={headline}
                className="partners-page__headline"
              />
            </div>
            <div className="about-grid__cols-7-12">
              <ScrollReveal delay={1}>
                <p className="partners-page__desc">
                  {desc}
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
                            width={120}
                            height={70}
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
                    {emptyLabel}
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
