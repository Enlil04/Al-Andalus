import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";

interface PageBannerProps {
  title: string;
  subtitle: string;
  imageSrc?: string;
  showImage?: boolean;
}

export default function PageBanner({
  title,
  subtitle,
  imageSrc = "/al-and images/close-up-partial-view-of-businesspeople-in-formal-2026-03-12-23-51-14-utc.jpg",
  showImage = true,
}: PageBannerProps) {
  return (
    <section className={`page-banner${showImage ? "" : " page-banner--no-image"}`}>
      <div className="page-banner__container">
        <div className="page-banner__header">
          <AnimatedHeadline title={title} className="page-banner__title" as="h1" immediate />
          <ScrollReveal delay={1}>
            <span className="page-banner__subtitle">( {subtitle} )</span>
          </ScrollReveal>
        </div>
      </div>

      {!showImage && (
        <hr className="page-banner__divider" />
      )}

      {showImage && (
        <div className="page-banner__media expanding-section">
          <div
            className="page-banner__image expanding-image"
            style={{ backgroundImage: `url("${imageSrc}")` }}
          />
        </div>
      )}
    </section>
  );
}
