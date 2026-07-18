import ContactCta from "./ContactCta";
import { fetchContactCtaContent } from "@/lib/cms/content";

export default async function ContactCtaServer() {
  const contactCta = await fetchContactCtaContent();
  return (
    <ContactCta
      headline={contactCta.headline}
      lines={contactCta.lines}
      cta={contactCta.cta}
      ctaLink={contactCta.ctaLink}
      backgroundImageUrl={contactCta.backgroundImageUrl}
    />
  );
}
