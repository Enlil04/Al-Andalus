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
        <div className="contact-cta__hero">
          <AnimatedHeadline title={defaultHeadline} className="contact-cta__title" />

          <div className="contact-cta__info">
            <p className="contact-cta__desc">{defaultDescription}</p>

            <ul className="contact-cta__details">
              <li>
                <span className="contact-cta__details-key">{defaultLabels.shortcode}</span>
                <a href={`tel:${defaultShortcode}`} className="contact-cta__details-value" dir="ltr">
                  {defaultShortcode}
                </a>
              </li>
              <li>
                <span className="contact-cta__details-key">{defaultLabels.phone}</span>
                <a href={defaultPhoneHref} className="contact-cta__details-value" dir="ltr">
                  {defaultPhone}
                </a>
              </li>
              <li>
                <span className="contact-cta__details-key">{defaultLabels.hours}</span>
                <span className="contact-cta__details-value">{defaultHours}</span>
              </li>
              <li>
                <span className="contact-cta__details-key">{defaultLabels.locations}</span>
                <span className="contact-cta__details-value">{defaultLocations}</span>
              </li>
            </ul>
          </div>
        </div>

        <Link href={ctaLink} className="contact-cta__btn">
          <div className="contact-cta__btn-bg" />
          <span>{defaultCta}</span>
        </Link>
      </div>
    </section>
  );
}
