import Link from "next/link";
import AnimatedHeadline from "./AnimatedHeadline";
import { siteCopy } from "@/lib/copy/en";

type ContactCtaProps = {
  headline?: string;
  lines?: readonly string[];
  cta?: string;
  ctaLink?: string;
};

export default function ContactCta({
  headline = siteCopy.contact.headline,
  lines = siteCopy.contact.lines,
  cta = siteCopy.contact.cta,
  ctaLink = "/request-quote",
}: ContactCtaProps) {
  return (
    <section className="contact-cta" id="contact">
      <div className="contact-cta__bg" />

      <div className="contact-cta__content">
        <div className="contact-cta__hero">
          <AnimatedHeadline title={headline} className="contact-cta__title" />

          <div className="contact-cta__desc">
            {lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <Link href={ctaLink} className="contact-cta__btn">
          <div className="contact-cta__btn-bg" />
          <span>{cta}</span>
        </Link>
      </div>
    </section>
  );
}
