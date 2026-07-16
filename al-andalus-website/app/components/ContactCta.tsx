import Link from "next/link";
import AnimatedHeadline from "./AnimatedHeadline";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";

type ContactCtaProps = {
  headline?: string;
  lines?: readonly string[];
  cta?: string;
  ctaLink?: string;
};

export default async function ContactCta({
  headline,
  lines,
  cta,
  ctaLink = "/contact",
}: ContactCtaProps) {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);

  const defaultHeadline = headline ?? siteCopy.contact.headline;
  const defaultLines = lines ?? siteCopy.contact.lines;
  const defaultCta = cta ?? siteCopy.contact.cta;

  return (
    <section className="contact-cta" id="contact">
      <div className="contact-cta__bg" />

      <div className="contact-cta__content">
        <div className="contact-cta__hero">
          <AnimatedHeadline title={defaultHeadline} className="contact-cta__title" />

          <div className="contact-cta__desc">
            {defaultLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
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
