import React from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { services } from "@/lib/services";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Loader from "../../../components/Loader";
import SmoothScroll from "../../../components/SmoothScroll";
import GSAPAnimations from "../../../components/GSAPAnimations";
import PageBanner from "../../../components/PageBanner";
import ScrollReveal from "../../../components/ScrollReveal";
import AnimatedHeadline from "../../../components/AnimatedHeadline";
import ContactCta from "../../../components/ContactCta";
import Link from "next/link";
import "./ServiceDetail.css";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const SERVICE_IMAGES: Record<string, string> = {
  cargo: "/al-and images/Modern Logistics Hub.png",
  engineering: "/al-and images/Misty Urban Development.png",
  glass: "/al-and images/Urban Skyward View.png",
  burglary: "/al-and images/Contemplative Office View.png",
  "bankers-blanket": "/al-and images/Modern Office Interior.png",
  "cash-in-transit": "/al-and images/gleaming-tall-buildings-in-bustling-financial-area-2026-06-10-16-07-35-utc.mov",
  "public-liability": "/al-and images/Urban Cityscape with Architectural Diversity.png",
  fire: "/al-and images/Urban Skyward View.png",
  "fidelity-guarantee": "/al-and images/Contemplative Office View.png",
  motor: "/al-and images/Dynamic Urban Scene with Cars.png",
  health: "/al-and images/medical-equipment-still-life-with-tablet-displayin-2026-03-18-07-09-39-utc.jpg",
  "loan-protection": "/al-and images/gleaming-tall-buildings-in-bustling-financial-area-2026-06-10-16-07-35-utc.mov",
  travel: "/al-and images/Traveler at Departure Board.png",
  "medical-malpractice": "/al-and images/medical-equipment-still-life-with-tablet-displayin-2026-03-18-07-09-39-utc.jpg",
  hull: "/al-and images/Sunset Highway Truck.png",
  cyber: "/al-and images/Futuristic Data Center.png",
};

function serializeLexical(richTextObj: any): string {
  if (!richTextObj || !richTextObj.root || !richTextObj.root.children) return "";
  return richTextObj.root.children
    .map((node: any) => {
      if (node.children) {
        return node.children.map((child: any) => child.text || "").join("");
      }
      return "";
    })
    .join("\n\n");
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch from database first
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "products",
    where: {
      slug: { equals: slug },
    },
  });
  const productDoc = docs[0];

  // 2. Lookup local configuration as fallback
  const staticService = services.find((s) => s.slug === slug);

  // If not found in either, return 404
  if (!productDoc && !staticService) {
    notFound();
  }

  // Bind values with fallback
  const title = productDoc?.title || staticService?.title || "";
  const subtitle = staticService?.subtitle || "Insurance Service";
  
  let descriptionText = "";
  if (productDoc) {
    if (productDoc.description) {
      descriptionText = serializeLexical(productDoc.description);
    }
    if (!descriptionText) {
      descriptionText = productDoc.shortDescription;
    }
  } else {
    descriptionText = staticService?.description || "";
  }

  const dbImageUrl =
    productDoc?.thumbnail && typeof productDoc.thumbnail !== "string"
      ? productDoc.thumbnail.url
      : null;
  const imageUrl = dbImageUrl || SERVICE_IMAGES[slug] || "/al-and images/Misty Urban Development.png";

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        <PageBanner title={title} subtitle={subtitle} showImage={false} />

        {/* ═══════════════ 1. SERVICE DETAILS ═══════════════ */}
        <section className="service-detail__intro jobs-section">
          <div className="about-grid">
            <div className="about-grid__cols-1-6">
              <ScrollReveal>
                <span className="jobs-section__label">( Service Coverage )</span>
              </ScrollReveal>
              <AnimatedHeadline
                title="Safeguarding Assets & Supporting Continuity"
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
                  Request a Quote
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

        <ContactCta />

        <Footer />
      </SmoothScroll>
    </>
  );
}
