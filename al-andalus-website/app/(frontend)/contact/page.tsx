import { Suspense } from "react";
import PageShell from "../../components/PageShell";
import PageBanner from "../../components/PageBanner";
import ContactForm from "../../components/ContactForm";
import RequestQuoteContact from "../../components/RequestQuoteContact";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";
import { fetchPagesContent, fetchSiteSettings } from "@/lib/cms/content";

export async function generateMetadata() {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  return {
    title: siteCopy.meta.contact.title,
    description: siteCopy.meta.contact.description,
  };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  const { contactPage } = siteCopy;
  const [settings, pages] = await Promise.all([
    fetchSiteSettings(),
    fetchPagesContent(),
  ]);
  const cms = pages.contact;

  const loadingText = locale === "ar" ? "جاري تحميل نموذج الاتصال..." : "Loading Contact Form...";

  return (
    <PageShell showContactCta={false}>
        <PageBanner
          title={cms.bannerTitle || contactPage.banner.title}
          subtitle={cms.bannerSubtitle || contactPage.banner.subtitle}
          imageSrc={cms.bannerImageUrl ?? undefined}
        />

        <Suspense fallback={<div className="request-quote__loading">{loadingText}</div>}>
          <ContactForm
            formLabel={cms.formLabel}
            formHeadline={cms.formHeadline}
            formIntro={cms.formIntro}
          />
        </Suspense>

        <RequestQuoteContact
          branches={settings.branches}
          shortcode={settings.shortNumber}
          phone={settings.phone}
          phoneHref={`tel:${settings.phone.replace(/\s+/g, "")}`}
          visitLabel={cms.visitLabel}
          visitHeadline={cms.visitHeadline}
          visitIntro={cms.visitIntro}
        />
    </PageShell>
  );
}
