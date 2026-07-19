import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";
import CmsImage from "./CmsImage";
import LogoSVG from "./LogoSVG";
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

  const eyebrow = locale === "ar" ? "تغطية ذكية. راحة بال تامة." : "SMART COVER. TOTAL PEACE OF MIND.";
  const downloadLabel = locale === "ar" ? "تحميل التطبيق" : "DOWNLOAD THE APPLICATION";
  const comingSoon = locale === "ar" ? "قريباً" : "Soon";

  const descriptionText = cms.paragraphs[0] || (
    locale === "ar"
      ? "أدر تأمين سيارتك بكل سهولة. احصل على عروض أسعار فورية، قدّم المطالبات في دقائق، وقُد سيارتك بكل ثقة."
      : "Manage your car insurance with ease. Get instant quotes, file claims in minutes, and drive with confidence."
  );

  // Trust badges details (checkmark shield, customer support headset, licensed padlock shield)
  const trustItems = locale === "ar" ? [
    {
      label: "موثوق من الآلاف",
      icon: (
        <svg className="app-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 11 11 13 15 9" />
        </svg>
      )
    },
    {
      label: "دعم فني 24/7",
      icon: (
        <svg className="app-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      )
    },
    {
      label: "مرخص لحمايتك",
      icon: (
        <svg className="app-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    }
  ] : [
    {
      label: "Trusted by thousands",
      icon: (
        <svg className="app-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 11 11 13 15 9" />
        </svg>
      )
    },
    {
      label: "24/7 Customer support",
      icon: (
        <svg className="app-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      )
    },
    {
      label: "Licensed & regulated for your protection",
      icon: (
        <svg className="app-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    }
  ];

  // Helper function to render store badges
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
        sub: isAr ? "تنزيل مباشر" : "Direct APK",
        main: downloadLabel,
        icon: (
          <svg className="app-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        )
      };
    }
  };

  return (
    <section className={`application-page__section ${isHomepage ? "is-homepage" : ""}`.trim()}>
      {/* Islamic Arabesque Geometric Background Pattern */}
      <div className="application-page__bg-pattern-container">
        <svg className="application-page__bg-pattern" viewBox="0 0 500 500" fill="none" stroke="rgba(11, 34, 61, 0.03)" strokeWidth="1">
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

      <div className="application-page__grid">
        {/* Left content column */}
        <div className="application-page__content">
          {/* Red Al-Andalus outline emblem logo */}
          <ScrollReveal>
            <div className="application-page__logo-container">
              <LogoSVG variant="dark" className="application-page__logo-mark" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={1}>
            <span className="application-page__eyebrow">
              {eyebrow}
            </span>
          </ScrollReveal>
          
          <AnimatedHeadline
            title={cms.title}
            className="application-page__title"
            immediate
            delay={0.8}
          />
          
          <ScrollReveal delay={2}>
            <p className="application-page__desc">{descriptionText}</p>
          </ScrollReveal>

          {/* Download Buttons Section */}
          <div className="application-page__downloads-container">
            <ScrollReveal delay={3}>
              <span className="application-page__downloads-label">
                {downloadLabel}
              </span>
            </ScrollReveal>
            
            <div className="application-page__buttons">
              {cms.downloads.map((download, index) => {
                const badge = getBadgeDetails(index, download.label);
                // Badge variants based on mockup: index 0 (App Store) is red, index 1 & 2 are outline white/red
                const variantClass = index === 0 ? "app-store-badge--solid-red" : "app-store-badge--outline-red";
                
                return download.url ? (
                  <ScrollReveal key={download.label} delay={4 + index}>
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
                  <ScrollReveal key={download.label} delay={4 + index}>
                    <span
                      className={`app-store-badge ${variantClass} app-store-badge--disabled`}
                      aria-disabled="true"
                    >
                      {badge.icon}
                      <div className="app-badge-text">
                        <span className="app-badge-sub">{badge.sub}</span>
                        <span className="app-badge-main">{badge.main}</span>
                      </div>
                      <span className="app-badge-status-pill">
                        {comingSoon}
                      </span>
                    </span>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* Bottom trust row */}
          <div className="application-page__trust-row">
            {trustItems.map((item, index) => (
              <ScrollReveal key={index} delay={7 + index}>
                <div className="app-trust-item">
                  <div className="app-trust-icon-container">
                    {item.icon}
                  </div>
                  <span className="app-trust-label">{item.label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Right media column with phone */}
        <div className="application-page__media">
          <ScrollReveal delay={1.5}>
            <div className="app-phone-container">
              <div className="app-phone-ambient-glow" />

              {/* iPhone Frame */}
              <div className="app-phone-mockup">
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
                    priority={!isHomepage}
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
