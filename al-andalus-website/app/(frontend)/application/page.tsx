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
import { getLocale } from "@/lib/locale";
import { fetchPagesContent } from "@/lib/cms/content";
import "./Application.css";

export async function generateMetadata() {
  const locale = await getLocale();
  const title =
    locale === "ar"
      ? "التطبيق | شركة الأندلس للتأمين الدولي"
      : "Application | Al-Andalus Insurance International";
  const description =
    locale === "ar"
      ? "حمّل تطبيق الأندلس للتأمين — أول منصة لتأمين السيارات في العراق. أدر وثائقك ومطالباتك من هاتفك."
      : "Download the Al-Andalus Insurance app — the first motor insurance platform in Iraq. Manage your policies and claims from your phone.";

  return { title, description };
}

export default async function ApplicationPage() {
  const locale = await getLocale();
  const pages = await fetchPagesContent();
  const cms = pages.application;

  const label = locale === "ar" ? "( التطبيق )" : "( The App )";
  const downloadLabel = locale === "ar" ? "حمّل التطبيق" : "Download the app";
  const comingSoon = locale === "ar" ? "قريباً" : "Coming soon";

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <HeaderServer />

        <PageBanner
          title={cms.bannerTitle}
          subtitle={cms.bannerSubtitle}
          showImage={false}
        />

        {/* ═══════════════ APP SHOWCASE ═══════════════ */}
        <section className="application-page__section">
          <div className="application-page__grid">
            <div className="application-page__content">
              <ScrollReveal>
                <span className="application-page__label jobs-section__label">
                  {label}
                </span>
              </ScrollReveal>
              <AnimatedHeadline
                title={cms.title}
                className="application-page__title"
              />
              {cms.paragraphs.map((paragraph, index) => (
                <ScrollReveal key={index} delay={index + 1}>
                  <p className="application-page__desc">{paragraph}</p>
                </ScrollReveal>
              ))}
              <ScrollReveal delay={cms.paragraphs.length + 1}>
                <span className="application-page__label">
                  {downloadLabel}
                </span>
              </ScrollReveal>
              <ScrollReveal delay={cms.paragraphs.length + 2}>
                <div className="application-page__buttons">
                  {cms.downloads.map((download) =>
                    download.url ? (
                      <a
                        key={download.label}
                        href={download.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--primary"
                      >
                        {download.label}
                      </a>
                    ) : (
                      <span
                        key={download.label}
                        className="btn btn--primary application-page__btn-disabled"
                        aria-disabled="true"
                      >
                        {download.label}
                        <span className="application-page__coming-soon">
                          ({comingSoon})
                        </span>
                      </span>
                    ),
                  )}
                </div>
              </ScrollReveal>
            </div>

            <div className="application-page__media">
              <ScrollReveal delay={2}>
                <div className="application-page__phone">
                  <CmsImage
                    src={cms.imageUrl ?? "/al-and images/application.jpeg"}
                    fallbackSrc="/al-and images/application.jpeg"
                    alt={cms.title}
                    width={460}
                    height={1024}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <ContactCtaServer />

        <FooterServer />
      </SmoothScroll>
    </>
  );
}
