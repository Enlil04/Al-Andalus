import React from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import HeaderServer from "../../../components/HeaderServer";
import FooterServer from "../../../components/FooterServer";
import Loader from "../../../components/Loader";
import SmoothScroll from "../../../components/SmoothScroll";
import GSAPAnimations from "../../../components/GSAPAnimations";
import PageBanner from "../../../components/PageBanner";
import ScrollReveal from "../../../components/ScrollReveal";
import AnimatedHeadline from "../../../components/AnimatedHeadline";
import { getLocale } from "@/lib/locale";
import { getSiteCopy } from "@/lib/copy";
import "../Proposals.css";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const locale = await getLocale();
  return {
    title: locale === "ar" ? "اتفاقية | الأندلس للتأمين" : "Agreement | Al-Andalus Insurance",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ProposalDetailPage({ params }: PageProps) {
  const { token } = await params;
  const locale = await getLocale();
  const payload = await getPayload({ config: configPromise });

  const { docs } = await payload.find({
    collection: "proposals",
    locale,
    depth: 1,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        { token: { equals: token } },
        { status: { equals: "active" } },
      ],
    },
  });

  if (!docs.length) {
    notFound();
  }

  const proposal = docs[0];
  const pdfDoc = proposal.pdf;
  const hasPdf = Boolean(
    pdfDoc && typeof pdfDoc !== "string" && typeof pdfDoc !== "number",
  );
  const pdfUrl = hasPdf ? `/api/proposals/${encodeURIComponent(token)}/file` : null;
  const pdfFilename =
    hasPdf && pdfDoc && typeof pdfDoc !== "string" && typeof pdfDoc !== "number"
      ? pdfDoc.filename || "proposal.pdf"
      : "proposal.pdf";

  const bannerTitle = locale === "ar" ? "العرض التأميني" : "PROPOSAL";
  const bannerSubtitle = locale === "ar" ? "رابط مشترك آمن" : "Secure Shared Link";
  const label = locale === "ar" ? "( اتفاقية آمنة )" : "( Secure Agreement )";
  const intro = locale === "ar"
    ? "هذا عرض تأميني آمن تمت مشاركته معك حصرياً. يمكنك مراجعة شروط الاتفاقية في عارض المستندات، أو تنزيل ملف PDF مباشرة باستخدام الزر أدناه."
    : "This is a secure proposal shared exclusively with you. You can review the agreement terms in the document viewer, or download the PDF file directly using the button below.";
  const downloadLabel = locale === "ar" ? "تنزيل ملف PDF" : "Download PDF";
  const noDocumentLabel = locale === "ar" ? "لا يوجد مستند مرفق بهذا العرض حالياً." : "No document is attached to this proposal yet.";

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <HeaderServer />

        <PageBanner
          title={bannerTitle}
          subtitle={bannerSubtitle}
          showImage={false}
        />

        <section className="proposal-view">
          <div className="about-grid proposal-view__grid">
            <aside className="proposal-view__aside about-grid__cols-1-5">
              <ScrollReveal>
                <span className="proposal-view__label">{label}</span>
              </ScrollReveal>
              <AnimatedHeadline
                title={proposal.title}
                className="proposal-view__headline"
                as="h2"
              />
              <ScrollReveal delay={0.5}>
                <p className="proposal-view__intro">
                  {intro}
                </p>
              </ScrollReveal>

              {pdfUrl && (
                <ScrollReveal delay={1}>
                  <a
                    href={pdfUrl}
                    download={pdfFilename}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                  >
                    {downloadLabel}
                    <svg
                      className="btn-arrow"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                      style={locale === "ar" ? { transform: "rotate(180deg)", marginRight: "0.5rem" } : undefined}
                    >
                      <path d="M1 7h12M8 2l5 5-5 5" />
                    </svg>
                  </a>
                </ScrollReveal>
              )}
            </aside>

            <div className="proposal-view__main about-grid__cols-7-12">
              {pdfUrl ? (
                <div className="proposal-view__iframe-container">
                  <iframe
                    src={`${pdfUrl}#toolbar=0`}
                    title={`Proposal PDF document — ${proposal.title}`}
                    className="proposal-view__iframe"
                  />
                </div>
              ) : (
                <div className="proposal-view__no-document">
                  <p>{noDocumentLabel}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <FooterServer />
      </SmoothScroll>
    </>
  );
}
