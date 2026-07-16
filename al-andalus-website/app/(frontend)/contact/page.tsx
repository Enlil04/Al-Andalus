import { Suspense } from "react";
import Header from "../../components/Header";
import FooterServer from "../../components/FooterServer";
import Loader from "../../components/Loader";
import SmoothScroll from "../../components/SmoothScroll";
import GSAPAnimations from "../../components/GSAPAnimations";
import PageBanner from "../../components/PageBanner";
import ContactForm from "../../components/ContactForm";
import RequestQuoteContact from "../../components/RequestQuoteContact";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";

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

  const loadingText = locale === "ar" ? "جاري تحميل نموذج الاتصال..." : "Loading Contact Form...";

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        <PageBanner
          title={contactPage.banner.title}
          subtitle={contactPage.banner.subtitle}
        />

        <Suspense fallback={<div className="request-quote__loading">{loadingText}</div>}>
          <ContactForm />
        </Suspense>

        <RequestQuoteContact />

        <FooterServer />
      </SmoothScroll>
    </>
  );
}
