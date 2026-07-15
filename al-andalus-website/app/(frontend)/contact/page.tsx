import { Suspense } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import SmoothScroll from "../../components/SmoothScroll";
import GSAPAnimations from "../../components/GSAPAnimations";
import PageBanner from "../../components/PageBanner";
import ContactForm from "../../components/ContactForm";
import RequestQuoteContact from "../../components/RequestQuoteContact";
import { siteCopy } from "@/lib/copy/en";

export const metadata = {
  title: "Contact Us | Al-Andalus International Insurance",
  description:
    "Get in touch with Al-Andalus International Insurance. Call 7366 or +964 771 000 6000. Find our branch offices and maps across Baghdad, Basrah, and Erbil.",
};

export default function ContactPage() {
  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        <PageBanner
          title="CONTACT US"
          subtitle="Get in touch"
        />

        <Suspense fallback={<div className="request-quote__loading">Loading Contact Form...</div>}>
          <ContactForm />
        </Suspense>

        <RequestQuoteContact />

        <Footer />
      </SmoothScroll>
    </>
  );
}
