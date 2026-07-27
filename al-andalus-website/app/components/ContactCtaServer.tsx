import ContactCta from "./ContactCta";
import { fetchContactCtaContent } from "@/lib/cms/content";

export default async function ContactCtaServer() {
  const contactCta = await fetchContactCtaContent();
  return (
    <ContactCta
      headline={contactCta.headline}
      description={contactCta.description}
      cta={contactCta.cta}
      ctaLink={contactCta.ctaLink}
      backgroundImageUrl={contactCta.backgroundImageUrl}
      shortcode={contactCta.shortcode}
      phone={contactCta.phone}
      phoneHref={contactCta.phoneHref}
      hours={contactCta.hours}
      locations={contactCta.locations}
      labels={contactCta.labels}
    />
  );
}
