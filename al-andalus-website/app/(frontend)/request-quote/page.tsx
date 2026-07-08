import { Suspense } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import SmoothScroll from "../../components/SmoothScroll";
import GSAPAnimations from "../../components/GSAPAnimations";
import PageBanner from "../../components/PageBanner";
import RequestQuoteForm from "../../components/RequestQuoteForm";
import RequestQuoteContact from "../../components/RequestQuoteContact";
import { siteCopy } from "@/lib/copy/en";

const { requestQuotePage } = siteCopy;

export const metadata = {
  title: siteCopy.meta.requestQuote.title,
  description: siteCopy.meta.requestQuote.description,
};

export default function RequestQuotePage() {
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

        <Suspense fallback={<div className="request-quote__loading">Loading Quote Form...</div>}>
          <RequestQuoteForm />
        </Suspense>

        <RequestQuoteContact />

        <Footer />
      </SmoothScroll>
    </>
  );
}
