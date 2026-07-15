import React from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Loader from "../../../components/Loader";
import SmoothScroll from "../../../components/SmoothScroll";
import GSAPAnimations from "../../../components/GSAPAnimations";
import PageBanner from "../../../components/PageBanner";
import ScrollReveal from "../../../components/ScrollReveal";
import AnimatedHeadline from "../../../components/AnimatedHeadline";
import "../Proposals.css";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: "Agreement | Al-Andalus Insurance",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ProposalDetailPage({ params }: PageProps) {
  const { token } = await params;
  const payload = await getPayload({ config: configPromise });

  const { docs } = await payload.find({
    collection: "proposals",
    where: {
      and: [
        { token: { equals: token } },
        { status: { equals: "active" } },
      ],
    },
  });

  if (!docs.length) {
    return notFound();
  }

  const proposal = docs[0];
  const pdfDoc = proposal.pdf;
  
  const pdfUrl = pdfDoc && typeof pdfDoc !== "string" ? pdfDoc.url : null;
  const pdfFilename = pdfDoc && typeof pdfDoc !== "string" ? pdfDoc.filename : "proposal.pdf";

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        <PageBanner
          title="PROPOSAL"
          subtitle="Secure Shared Link"
          showImage={false}
        />

        <section className="proposal-view">
          <div className="about-grid proposal-view__grid">
            <aside className="proposal-view__aside about-grid__cols-1-5">
              <ScrollReveal>
                <span className="proposal-view__label">( Secure Agreement )</span>
              </ScrollReveal>
              <AnimatedHeadline
                title={proposal.title}
                className="proposal-view__headline"
                as="h2"
              />
              <ScrollReveal delay={0.5}>
                <p className="proposal-view__intro">
                  This is a secure proposal shared exclusively with you. You can review the agreement terms in the document viewer, or download the PDF file directly using the button below.
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
                    Download PDF
                    <svg
                      className="btn-arrow"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
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
                  <p>No document is attached to this proposal yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </SmoothScroll>
    </>
  );
}
