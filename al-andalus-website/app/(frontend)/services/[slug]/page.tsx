import React from "react";
import { notFound } from "next/navigation";
import { getServices } from "@/lib/services";
import HeaderServer from "../../../components/HeaderServer";
import FooterServer from "../../../components/FooterServer";
import Loader from "../../../components/Loader";
import SmoothScroll from "../../../components/SmoothScroll";
import GSAPAnimations from "../../../components/GSAPAnimations";
import PageBanner from "../../../components/PageBanner";
import ScrollReveal from "../../../components/ScrollReveal";
import AnimatedHeadline from "../../../components/AnimatedHeadline";
import ContactCtaServer from "../../../components/ContactCtaServer";
import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { fetchProductBySlug } from "@/lib/cms/content";
import { serializeLexical } from "@/lib/cms/lexical";
import { getMediaUrl } from "@/lib/cms/media";
import "./ServiceDetail.css";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const productDoc = await fetchProductBySlug(slug);
  const staticService = getServices(locale).find((s) => s.slug === slug);
  const title = (productDoc?.title as string) || staticService?.title;
  if (!title) {
    return {
      title:
        locale === "ar"
          ? "الخدمة غير موجودة | الأندلس للتأمين"
          : "Service not found | Al-Andalus Insurance",
    };
  }
  const description =
    (productDoc?.shortDescription as string) || staticService?.description || "";
  return {
    title:
      locale === "ar"
        ? `${title} | خدمات الأندلس`
        : `${title} | Al-Andalus Services`,
    description: description || undefined,
  };
}

const SERVICE_IMAGES: Record<string, string> = {
  cargo: "/al-and images/cargo-insurance.png",
  engineering: "/al-and images/engineering-insurance.png",
  glass: "/al-and images/glass-insurance.png",
  burglary: "/al-and images/burglary-insurance.png",
  "bankers-blanket": "/al-and images/Modern Office Interior.png",
  "cash-in-transit": "/al-and images/Gleaming Tall Buildings in Bustling Financial Area.png",
  "public-liability": "/al-and images/Urban Cityscape with Architectural Diversity.png",
  fire: "/al-and images/fire-insurance.png",
  "fidelity-guarantee": "/al-and images/fidelity-guarantee.png",
  motor: "/al-and images/Dynamic Urban Scene with Cars.png",
  health: "/al-and images/medical-equipment-still-life-with-tablet-displayin-2026-03-18-07-09-39-utc.jpg",
  "loan-protection": "/al-and images/Gleaming Tall Buildings in Bustling Financial Area.png",
  travel: "/al-and images/Traveler at Departure Board.png",
  "medical-malpractice": "/al-and images/medical-malpractice.png",
  hull: "/al-and images/hull-insurance.png",
  cyber: "/al-and images/Futuristic Data Center.png",
};

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();

  const productDoc = await fetchProductBySlug(slug);
  const currentServices = getServices(locale);
  const staticService = currentServices.find((s) => s.slug === slug);

  if (!productDoc && !staticService) {
    notFound();
  }

  const title = (productDoc?.title as string) || staticService?.title || "";
  const subtitle =
    staticService?.subtitle ||
    (locale === "ar" ? "خدمة تأمينية" : "Insurance Service");

  let descriptionText = "";
  if (productDoc) {
    if (productDoc.description) {
      descriptionText = serializeLexical(productDoc.description);
    }
    if (!descriptionText) {
      descriptionText = (productDoc.shortDescription as string) ?? "";
    }
  } else {
    descriptionText = staticService?.description || "";
  }

  const dbImageUrl = getMediaUrl(
    productDoc?.thumbnail as Parameters<typeof getMediaUrl>[0],
  );
  const imageUrl =
    dbImageUrl || SERVICE_IMAGES[slug] || "/al-and images/Misty Urban Development.png";

  const label = locale === "ar" ? "( تغطية الخدمة )" : "( Service Coverage )";
  const headline =
    locale === "ar"
      ? "حماية الأصول وضمان الاستمرارية"
      : "Safeguarding Assets & Supporting Continuity";
  const quoteButtonLabel = locale === "ar" ? "طلب تسعيرة" : "Request a Quote";

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <HeaderServer />

        <PageBanner title={title} subtitle={subtitle} showImage={false} />

        <section className="service-detail__intro jobs-section">
          <div className="about-grid">
            <div className="about-grid__cols-1-6">
              <ScrollReveal>
                <span className="jobs-section__label">{label}</span>
              </ScrollReveal>
              <AnimatedHeadline
                title={headline}
                className="service-detail__headline"
              />
              <ScrollReveal delay={1}>
                <div className="service-detail__desc">
                  {descriptionText.split("\n\n").map((para, i) => (
                    <p key={i} style={{ marginBottom: "1rem" }}>
                      {para}
                    </p>
                  ))}
                </div>
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <Link href="/request-quote" className="btn">
                  {quoteButtonLabel}
                  <svg
                    className="btn-arrow"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M1 7h12M8 2l5 5-5 5" />
                  </svg>
                </Link>
              </ScrollReveal>
            </div>

            <div className="about-grid__cols-7-12">
              <ScrollReveal delay={1}>
                <div
                  className="service-detail__image"
                  style={{ backgroundImage: `url("${imageUrl}")` }}
                  role="img"
                  aria-label={`${title} image`}
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        <ContactCtaServer />

        <FooterServer />
      </SmoothScroll>
    </>
  );
}
