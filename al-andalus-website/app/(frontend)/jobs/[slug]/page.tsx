import React from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { siteCopy } from "@/lib/copy/en";
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
import "./JobDetail.css";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Curated job descriptions for static jobs fallback
const STATIC_JOB_DETAILS: Record<
  string,
  { description: string; requirements: string[]; location: string; employmentType: string }
> = {
  "corporate-affairs-accounting": {
    location: "Baghdad Head Office",
    employmentType: "Full-Time",
    description:
      "We are seeking an experienced Corporate Affairs & Accounting Officer to manage corporate financial transactions, prepare balance sheets, compile regulatory financial reports for the Insurance Diwan, and assist in HR operational compliance. You will work closely with executive directors to maintain financial auditing standards.",
    requirements: [
      "Bachelor's degree in Accounting, Finance, or Business Administration.",
      "2+ years of accounting experience, preferably in banking, audit, or insurance sectors in Iraq.",
      "Proficiency in accounting software (e.g. QuickBooks, Al-Ameen) and advanced Microsoft Excel.",
      "Strong knowledge of Iraqi financial regulations and tax compliance policies.",
      "Fluency in Arabic; English communication skills are highly valued.",
    ],
  },
  "insurance-field-agent": {
    location: "Iraq (Multi-Branch: Baghdad / Basrah / Erbil)",
    employmentType: "Full-Time / Commission",
    description:
      "Al-Andalus is looking for energetic Insurance Field Agents to engage with retail and commercial clients across Iraq. In this role, you will represent our general insurance offerings, present insurance options to local businesses, compile initial customer risk information, and coordinate client policy renewals.",
    requirements: [
      "Outstanding communication, presentation, and sales skills.",
      "1+ years of sales or field agent experience in local retail or commercial markets.",
      "Self-driven personality with the capability to manage prospects independently.",
      "Familiarity with general insurance concepts (motor, health, burglary) is preferred.",
      "High school diploma or university degree in any field.",
    ],
  },
  "underwriting-specialist": {
    location: "Baghdad Head Office",
    employmentType: "Full-Time",
    description:
      "We are recruiting an Underwriting Specialist to evaluate risk profiles for commercial and personal insurance lines. Your responsibilities include analyzing policy applications, coordinating with surveyors, pricing risks using established guidelines, and preparing policy contracts for motor, fire, and engineering coverages.",
    requirements: [
      "Bachelor's degree in Finance, Risk Management, Economics, or Mathematics.",
      "2+ years of professional underwriting experience in general lines insurance in Iraq.",
      "Analytical mindset with strong attention to details and risk factors.",
      "Ability to write policies clearly, conforming to local regulations.",
      "Fluency in Arabic and professional English capability.",
    ],
  },
  "claims-officer": {
    location: "Erbil Branch",
    employmentType: "Full-Time",
    description:
      "Our Erbil Branch is seeking a Claims Officer to manage the processing and validation of insurance claims. You will serve as the primary contact for claimants, coordinate incident inspections with external loss adjusters, assess policy coverages and exclusions, and issue settlement recommendations to branch managers.",
    requirements: [
      "University degree in Law, Engineering, Business, or related fields.",
      "1+ years of claims operations or technical support experience in general insurance.",
      "Excellent negotiation and customer relations skills during critical incidents.",
      "Attention to audit criteria, regulations, and claims settlement procedures.",
      "Fluency in Kurdish and Arabic is required.",
    ],
  },
  "technical-sales-representative": {
    location: "Basrah Branch",
    employmentType: "Full-Time",
    description:
      "We are hiring a Technical Sales Representative for our Basrah Branch to cultivate relationship portfolios with commercial partners, logistics operators, and contractors. You will draft coverage proposals, present marine cargo and liability policies to corporate clients, and secure renewals.",
    requirements: [
      "Bachelor's degree in Marketing, Business, or Engineering.",
      "2+ years of corporate sales (B2B) experience in southern Iraq.",
      "Familiarity with the maritime logistics, cargo, and oil & gas sectors in Basrah.",
      "Strong communication and relationship-building skills.",
      "Fluency in Arabic; conversational English is preferred.",
    ],
  },
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

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch from database first
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "jobs",
    where: {
      slug: { equals: slug },
    },
  });
  const dbJob = docs[0];

  // 2. Lookup static configuration as fallback
  const staticJob = siteCopy.jobsPage.listings.jobs.find(
    (j) => slugify(j.title) === slug
  );

  // If not found in either, return 404
  if (!dbJob && !staticJob) {
    notFound();
  }

  // Bind values with fallback
  const title = dbJob?.title || staticJob?.title || "";
  const category = dbJob?.department || staticJob?.category || "Operations";
  
  let descriptionHTML: React.ReactNode = null;
  let requirementsHTML: React.ReactNode = null;
  let location = "Iraq (Multi-Branch)";
  let employmentType = "Full-Time";

  if (dbJob) {
    location = dbJob.location;
    employmentType =
      dbJob.employmentType === "full-time"
        ? "Full-Time"
        : dbJob.employmentType === "part-time"
          ? "Part-Time"
          : dbJob.employmentType === "contract"
            ? "Contract"
            : "Internship";

    const descText = serializeLexical(dbJob.description);
    descriptionHTML = descText.split("\n\n").map((p, i) => <p key={i} style={{ marginBottom: "1rem" }}>{p}</p>);

    if (dbJob.requirements) {
      const reqText = serializeLexical(dbJob.requirements);
      requirementsHTML = (
        <ul>
          {reqText.split("\n\n").map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      );
    }
  } else {
    // Static job detail mapping
    const details = STATIC_JOB_DETAILS[slug];
    if (details) {
      location = details.location;
      employmentType = details.employmentType;
      descriptionHTML = <p>{details.description}</p>;
      requirementsHTML = (
        <ul>
          {details.requirements.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      );
    } else {
      descriptionHTML = <p>No job description available.</p>;
    }
  }

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        <PageBanner title={title} subtitle={category} showImage={false} />

        <section className="job-detail jobs-section">
          <div className="about-grid">
            <div className="job-detail__sidebar about-grid__cols-1-4">
              <ScrollReveal>
                <div className="job-sidebar-card">
                  <AnimatedHeadline title="Position Info" className="job-sidebar-card__title" as="h4" />
                  <div className="job-sidebar-card__meta-list">
                    <div className="job-sidebar-meta">
                      <span className="job-sidebar-meta__label">Department</span>
                      <span className="job-sidebar-meta__value">{category}</span>
                    </div>
                    <div className="job-sidebar-meta">
                      <span className="job-sidebar-meta__label">Location</span>
                      <span className="job-sidebar-meta__value">{location}</span>
                    </div>
                    <div className="job-sidebar-meta">
                      <span className="job-sidebar-meta__label">Job Type</span>
                      <span className="job-sidebar-meta__value">{employmentType}</span>
                    </div>
                  </div>
                  <Link
                    href={`mailto:hr@alandalus-iq.com?subject=Application for ${encodeURIComponent(title)}`}
                    className="btn w-full text-center"
                    style={{ marginTop: "1rem" }}
                  >
                    Apply Now
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
                </div>
              </ScrollReveal>
            </div>

            <div className="job-detail__content about-grid__cols-5-12">
              <ScrollReveal delay={0.5}>
                <div className="job-content-section">
                  <AnimatedHeadline title="Role Overview" className="job-content-section__title" as="h3" />
                  <div className="job-content-section__body">{descriptionHTML}</div>
                </div>
              </ScrollReveal>

              {requirementsHTML ? (
                <ScrollReveal delay={0.7}>
                  <div className="job-content-section">
                    <AnimatedHeadline
                      title="Requirements & Qualifications"
                      className="job-content-section__title"
                      as="h3"
                    />
                    <div className="job-content-section__body">{requirementsHTML}</div>
                  </div>
                </ScrollReveal>
              ) : null}
            </div>
          </div>
        </section>

        <ContactCta />

        <Footer />
      </SmoothScroll>
    </>
  );
}
