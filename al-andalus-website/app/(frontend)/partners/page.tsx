import HeaderServer from "../../components/HeaderServer";
import FooterServer from "../../components/FooterServer";
import Loader from "../../components/Loader";
import SmoothScroll from "../../components/SmoothScroll";
import GSAPAnimations from "../../components/GSAPAnimations";
import PageBanner from "../../components/PageBanner";
import ScrollReveal from "../../components/ScrollReveal";
import AnimatedHeadline from "../../components/AnimatedHeadline";
import ContactCtaServer from "../../components/ContactCtaServer";
import CmsImage from "../../components/CmsImage";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";
import { fetchPagesContent, fetchPartners } from "@/lib/cms/content";
import { getMediaUrl } from "@/lib/cms/media";
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
  const locale = await getLocale();
  const [partners, pages] = await Promise.all([
    fetchPartners(undefined, 100),
    fetchPagesContent(),
  ]);
  const cms = pages.partners;

  const bannerTitle = cms.bannerTitle || (locale === "ar" ? "الشركاء" : "PARTNERS");
  const bannerSubtitle = cms.bannerSubtitle || (locale === "ar" ? "شبكتنا الموثوقة" : "Our Trusted Network");
  const label = cms.introLabel || (locale === "ar" ? "( الشبكة )" : "( Network )");
  const headline = cms.introHeadline || (locale === "ar" ? "بناء الثقة في جميع أنحاء العراق" : "Building Trust Across Iraq");
  const desc = cms.introDescription || (locale === "ar" 
    ? "تعمل شركة الأندلس للتأمين الدولي جنباً إلى جنب مع كبرى المصارف، الشركات، المؤسسات الحكومية، وشركات القطاع الخاص في العراق. تعكس هذه الشراكات سنوات من الاكتتاب الموثوق، والالتزام المستمر بتسوية المطالبات، والمساهمة الفاعلة في النمو الاقتصادي." 
    : "Al-Andalus Insurance works alongside leading banks, corporations, government institutions, and private businesses across Iraq. These partnerships reflect years of reliable underwriting, consistent claim settlement, and shared commitment to economic growth.");
  const emptyLabel = locale === "ar" ? "لا يوجد شركاء مدرجون حالياً." : "No partners listed yet.";

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <HeaderServer />

        <PageBanner
          title={bannerTitle}
          subtitle={bannerSubtitle}
          imageSrc={cms.bannerImageUrl ?? undefined}
        />

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
                  const logoUrl = getMediaUrl(
                    partner.logo as Parameters<typeof getMediaUrl>[0],
                  );
                  const websiteUrl = partner.website as string | null;
                  const partnerName = partner.name as string;

                  const CardContent = (
                    <>
                      <span className="partner-page-card__num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="partner-page-card__logo">
                        {logoUrl ? (
                          <CmsImage
                            src={logoUrl}
                            fallbackSrc="/logo.svg"
                            alt={partnerName}
                            width={120}
                            height={70}
                            style={{ objectFit: "contain" }}
                          />
                        ) : (
                          <span className="partner-page-card__text">
                            {partnerName}
                          </span>
                        )}
                      </div>
                      <span className="partner-page-card__name">
                        {partner.name as string}
                      </span>
                    </>
                  );

                  return (
                    <ScrollReveal key={String(partner.id)} delay={(i % 4) + 1}>
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

        <ContactCtaServer />

        <FooterServer />
      </SmoothScroll>
    </>
  );
}
