import Link from "next/link";
import AnimatedHeadline from "./AnimatedHeadline";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";

type ContactCtaProps = {
  headline?: string;
  description?: string;
  cta?: string;
  ctaLink?: string;
  backgroundImageUrl?: string | null;
  shortcode?: string;
  phone?: string;
  phoneHref?: string;
  hours?: string;
  locations?: string;
  labels?: {
    shortcode: string;
    phone: string;
    hours: string;
    locations: string;
  };
};

export default async function ContactCta({
  headline,
  description,
  cta,
  ctaLink = "/request-quote",
  backgroundImageUrl,
  shortcode,
  phone,
  phoneHref,
  hours,
  locations,
  labels,
}: ContactCtaProps) {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);

  const defaultHeadline = headline ?? siteCopy.contact.headline;
  const defaultDescription = description ?? siteCopy.contact.description;
  const defaultCta = cta ?? siteCopy.contact.cta;
  const defaultShortcode = shortcode ?? "7366";
  const defaultPhone = phone ?? "+964 771 000 6000";
  const defaultPhoneHref = phoneHref ?? "tel:+9647710006000";
  const defaultHours = hours ?? siteCopy.contact.hours;
  const defaultLocations = locations ?? siteCopy.contact.locations;
  const defaultLabels = labels ?? siteCopy.contact.labels;

  return (
    <section className="contact-cta" id="contact">
      <div
        className="contact-cta__bg"
        style={
          backgroundImageUrl
            ? {
                // Keep the gradient as a lower layer so a missing CMS file
                // never leaves the section blank.
                backgroundImage: `url("${backgroundImageUrl}"), linear-gradient(to top, var(--navy-900), var(--navy-700))`,
              }
            : undefined
        }
      />

      <div className="contact-cta__content">
        <div className="contact-cta__container">
          <AnimatedHeadline title={defaultHeadline} className="contact-cta__title" />

          <p className="contact-cta__desc">{defaultDescription}</p>

          <div className="contact-cta__info-row">
            <div className="contact-cta__info-item">
              <svg className="contact-cta__icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 7.79C8.06 10.62 10.38 12.93 13.21 14.38L15.41 12.18C15.68 11.91 16.08 11.82 16.43 11.94C17.55 12.31 18.76 12.51 20 12.51C20.55 12.51 21 12.96 21 13.51V17C21 17.55 20.55 18 20 18C10.61 18 3 10.39 3 1C3 0.45 3.45 0 4 0H7.5C8.05 0 8.5 0.45 8.5 1C8.5 2.25 8.7 3.45 9.07 4.57C9.18 4.92 9.1 5.31 8.82 5.59L6.62 7.79Z" />
              </svg>
              <span className="contact-cta__info-text">
                <span className="contact-cta__info-label">{defaultLabels.phone}:</span>{" "}
                <a href={defaultPhoneHref} className="contact-cta__info-link" dir="ltr">
                  {defaultPhone}
                </a>{" "}
                ·{" "}
                <a href={`tel:${defaultShortcode}`} className="contact-cta__info-link" dir="ltr">
                  {defaultShortcode}
                </a>
              </span>
            </div>

            <div className="contact-cta__info-item">
              <svg className="contact-cta__icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
              </svg>
              <span className="contact-cta__info-text">
                <span className="contact-cta__info-label">{defaultLabels.locations}:</span>{" "}
                <span>{defaultLocations}</span>
              </span>
            </div>

            <div className="contact-cta__info-item">
              <svg className="contact-cta__icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              <span className="contact-cta__info-text">
                <span className="contact-cta__info-label">{defaultLabels.hours}:</span>{" "}
                <span>{defaultHours}</span>
              </span>
            </div>
          </div>

          <div className="contact-cta__btn-wrapper">
            <Link href={ctaLink} className="contact-cta__btn">
              <div className="contact-cta__btn-bg" />
              <span>{defaultCta}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
