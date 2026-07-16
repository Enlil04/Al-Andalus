import { Suspense } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import SmoothScroll from "../../components/SmoothScroll";
import GSAPAnimations from "../../components/GSAPAnimations";
import PageBanner from "../../components/PageBanner";
import RequestQuoteForm from "../../components/RequestQuoteForm";
import RequestQuoteContact from "../../components/RequestQuoteContact";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";

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

  const loadingText = locale === "ar" ? "جاري تحميل نموذج طلب التسعيرة..." : "Loading Quote Form...";

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        <PageBanner
          title={requestQuotePage.banner.title}
          subtitle={requestQuotePage.banner.subtitle}
          showImage={false}
        />

        <Suspense fallback={<div className="request-quote__loading">{loadingText}</div>}>
          <RequestQuoteForm />
        </Suspense>

        <RequestQuoteContact />

        <Footer />
      </SmoothScroll>
    </>
  );
}
