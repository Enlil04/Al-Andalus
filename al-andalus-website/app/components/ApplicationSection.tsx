import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";
import CmsImage from "./CmsImage";
import { getLocale } from "@/lib/locale";
import { fetchPagesContent } from "@/lib/cms/content";
import "./ApplicationSection.css";

interface ApplicationSectionProps {
  isHomepage?: boolean;
}

export default async function ApplicationSection({ isHomepage = false }: ApplicationSectionProps) {
  const locale = await getLocale();
  const pages = await fetchPagesContent();
  const cms = pages.application;

  const eyebrow =
    locale === "ar" ? "متوفر الآن على جميع المتاجر" : "NOW AVAILABLE ON ALL STORES";

  const descriptionText = cms.paragraphs[0] || (
    locale === "ar"
      ? "أدر تأمين سيارتك بكل سهولة. احصل على عروض أسعار فورية، قدّم المطالبات في دقائق، وقُد سيارتك بكل ثقة."
      : "Manage your car insurance with ease. Get instant quotes, file claims in minutes, and drive with confidence."
  );

  const getBadgeDetails = (index: number, downloadLabel: string) => {
    const isAr = locale === "ar";
    if (index === 0) {
      return {
        sub: isAr ? "حمّله من" : "Download on the",
        main: downloadLabel,
        icon: (
          <svg className="app-badge-icon" viewBox="0 0 384 512">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48-20.1-77.5-19.6-38.9.6-74.6 22.8-94.6 57.5-41.2 71.7-10.5 178 29.8 236 19.7 28.3 42.6 59.8 73 58.7 29.5-1.1 40.7-18.9 76.5-18.9 35.8 0 46.2 18.9 77 18.2 31.4-.6 51.5-28.4 70.8-56.7 22.3-32.4 31.2-63.8 31.7-65.5-1.1-.6-62.4-24-63-95.4zM294.7 89.7c15.6-19.1 26.1-45.7 23.2-72.3-22.9 1-50.7 15.2-67.1 34.4-14.3 16.4-26.8 43.4-23.8 69.6 25.3 2 52-12.7 67.7-31.7z"/>
          </svg>
        )
      };
    } else if (index === 1) {
      return {
        sub: isAr ? "حمّله من" : "Get it on",
        main: downloadLabel,
        icon: (
          <svg className="app-badge-icon" viewBox="0 0 512 512">
            <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 0 24 10 24 23v466c0 13 10 23 23 23 4.5 0 9-1.3 12.8-3.7l300-173.1-66.3-66.3L47 0zm372.5 186.2l-60 60 60.1 60.1L501.3 268c7.7-4.4 12.7-12.7 12.7-21.8s-5-17.4-12.7-21.8l-81.8-38.2zM325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z"/>
          </svg>
        )
      };
    } else {
      return {
        sub: isAr ? "استكشفه على" : "Explore it on",
        main: downloadLabel,
        icon: (
          <svg className="app-badge-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.2c-.4 1.8-1.7 3.3-3.4 4.1 1.7.8 3 2.3 3.4 4.1.4-1.8 1.7-3.3 3.4-4.1-1.7-.8-3-2.3-3.4-4.1zm0 11.4c-.4 1.8-1.7 3.3-3.4 4.1 1.7.8 3 2.3 3.4 4.1.4-1.8 1.7-3.3 3.4-4.1-1.7-.8-3-2.3-3.4-4.1zM5.5 8.3c-1.9.1-3.6 1.2-4.4 2.9 1.7.8 2.8 2.4 2.9 4.3.8-1.7 2.4-2.8 4.3-2.9-1.7-.8-2.8-2.5-2.8-4.3zm13 0c0 1.8-1.1 3.5-2.8 4.3 1.9.1 3.5 1.2 4.3 2.9.1-1.9 1.2-3.5 2.9-4.3-.8-1.7-2.5-2.8-4.4-2.9zM5.5 15.7c0-1.8 1.1-3.5 2.8-4.3-1.9-.1-3.5-1.2-4.3-2.9-.1 1.9-1.2 3.5-2.9 4.3.8 1.7 2.5 2.8 4.4 2.9zm13 0c1.9-.1 3.6-1.2 4.4-2.9-1.7-.8-2.8-2.4-2.9-4.3-.8 1.7-2.4 2.8-4.3 2.9 1.7.8 2.8 2.5 2.8 4.3z" />
          </svg>
        )
      };
    }
  };

  const renderPhone = (variant: "front" | "back") => (
    <div className={`app-phone-mockup app-phone-mockup--${variant}`}>
      <div className="app-phone-speaker" />
      <div className="app-phone-notch" />
      <div className="app-phone-reflection" />
      <div className="app-phone-screen">
        <CmsImage
          src={cms.imageUrl ?? "/al-and images/application.jpeg"}
          fallbackSrc="/al-and images/application.jpeg"
          alt={cms.title}
          width={460}
          height={1024}
          priority={!isHomepage && variant === "front"}
        />
      </div>
    </div>
  );

  return (
    <section className={`application-page__section ${isHomepage ? "is-homepage" : ""}`.trim()}>
      <div className="app-banner">
        {/* Clipped background layer: brand navy + arabesque pattern */}
        <div className="app-banner__bg" aria-hidden="true">
          <svg className="app-banner__pattern" viewBox="0 0 500 500" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1">
            <circle cx="250" cy="250" r="240" />
            <circle cx="250" cy="250" r="200" />
            <circle cx="250" cy="250" r="160" />
            <rect x="68" y="68" width="364" height="364" transform="rotate(45 250 250)" />
            <rect x="68" y="68" width="364" height="364" />
            <rect x="68" y="68" width="364" height="364" transform="rotate(22.5 250 250)" />
            <rect x="68" y="68" width="364" height="364" transform="rotate(67.5 250 250)" />
            <path d="M 250 0 L 250 500 M 0 250 L 500 250 M 73 73 L 427 427 M 73 427 L 427 73" />
          </svg>
        </div>

        <div className="app-banner__grid">
          {/* Text column */}
          <div className="app-banner__content">
            <ScrollReveal>
              <span className="app-banner__eyebrow">{eyebrow}</span>
            </ScrollReveal>

            <AnimatedHeadline
              title={cms.title}
              className="app-banner__title"
              immediate
              delay={0.8}
            />

            <ScrollReveal delay={2}>
              <p className="app-banner__desc">{descriptionText}</p>
            </ScrollReveal>

            <div className="app-banner__buttons">
              {cms.downloads.map((download, index) => {
                const badge = getBadgeDetails(index, download.label);
                const variantClass = index === 0 ? "app-store-badge--solid-red" : "app-store-badge--outline-light";

                return download.url ? (
                  <ScrollReveal key={download.label} delay={3 + index}>
                    <a
                      href={download.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`app-store-badge ${variantClass}`}
                    >
                      {badge.icon}
                      <div className="app-badge-text">
                        <span className="app-badge-sub">{badge.sub}</span>
                        <span className="app-badge-main">{badge.main}</span>
                      </div>
                    </a>
                  </ScrollReveal>
                ) : (
                  <ScrollReveal key={download.label} delay={3 + index}>
                    <span
                      className={`app-store-badge ${variantClass} app-store-badge--disabled`}
                      aria-disabled="true"
                    >
                      {badge.icon}
                      <div className="app-badge-text">
                        <span className="app-badge-sub">{badge.sub}</span>
                        <span className="app-badge-main">{badge.main}</span>
                      </div>
                    </span>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* Media column: two overlapping phones bleeding out of the banner */}
          <div className="app-banner__media">
            <ScrollReveal delay={1.5}>
              <div className="app-phone-duo">
                {renderPhone("back")}
                {renderPhone("front")}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
