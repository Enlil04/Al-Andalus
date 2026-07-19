import { Suspense } from "react";
import PageShell from "../../components/PageShell";
import PageBanner from "../../components/PageBanner";
import RequestQuoteForm from "../../components/RequestQuoteForm";
import RequestQuoteContact from "../../components/RequestQuoteContact";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";
import {
  fetchPagesContent,
  fetchQuoteProducts,
  fetchSiteSettings,
} from "@/lib/cms/content";

export async function generateMetadata() {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  return {
    title: siteCopy.meta.requestQuote.title,
    description: siteCopy.meta.requestQuote.description,
  };
}

export default async function RequestQuotePage() {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  const { requestQuotePage } = siteCopy;
  const [products, settings, pages] = await Promise.all([
    fetchQuoteProducts(),
    fetchSiteSettings(),
    fetchPagesContent(),
  ]);
  const cms = pages.requestQuote;

  const loadingText = locale === "ar" ? "جاري تحميل نموذج طلب التسعيرة..." : "Loading Quote Form...";

  return (
    <PageShell showContactCta={false}>
        <PageBanner
          title={cms.bannerTitle || requestQuotePage.banner.title}
          subtitle={cms.bannerSubtitle || requestQuotePage.banner.subtitle}
          showImage={false}
        />

        <Suspense fallback={<div className="request-quote__loading">{loadingText}</div>}>
          <RequestQuoteForm
            products={products}
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
