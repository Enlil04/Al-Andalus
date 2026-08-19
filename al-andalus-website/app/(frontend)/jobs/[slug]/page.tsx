import React from "react";
import { notFound } from "next/navigation";
import { getLocale } from "@/lib/locale";
import { fetchJobBySlug } from "@/lib/cms/content";
import { serializeLexical } from "@/lib/cms/lexical";
import PageShell from "../../../components/PageShell";
import PageBanner from "../../../components/PageBanner";
import ScrollReveal from "../../../components/ScrollReveal";
import AnimatedHeadline from "../../../components/AnimatedHeadline";
import Link from "next/link";
import "./JobDetail.css";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const dbJob = await fetchJobBySlug(slug);
  const title = dbJob?.title as string | undefined;
  if (!title) {
    return {
    alternates: { canonical: `/jobs/${slug}` },
      title:
        locale === "ar"
          ? "الوظيفة غير موجودة | الأندلس للتأمين"
          : "Job not found | Al-Andalus Insurance",
    };
  }
  return {
    title:
      locale === "ar"
        ? `${title} | وظائف الأندلس`
        : `${title} | Al-Andalus Careers`,
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const dbJob = await fetchJobBySlug(slug);

  if (!dbJob) {
    notFound();
  }

  const title = (dbJob.title as string | undefined) || "";
  const category =
    (dbJob.department as string | undefined) ||
    (locale === "ar" ? "العمليات" : "Operations");

  let location = (dbJob.location as string) ||
    (locale === "ar" ? "العراق (فروع متعددة)" : "Iraq (Multi-Branch)");
  let employmentType = locale === "ar" ? "دوام كامل" : "Full-Time";

  const employment = dbJob.employmentType as string;
  if (locale === "ar") {
    employmentType =
      employment === "full-time"
        ? "دوام كامل"
        : employment === "part-time"
          ? "دوام جزئي"
          : employment === "contract"
            ? "عقد"
            : employment === "internship"
              ? "تدريب عملي"
              : employmentType;
  } else {
    employmentType =
      employment === "full-time"
        ? "Full-Time"
        : employment === "part-time"
          ? "Part-Time"
          : employment === "contract"
            ? "Contract"
            : employment === "internship"
              ? "Internship"
              : employmentType;
  }

  const descText = serializeLexical(dbJob.description);
  const descriptionHTML = descText
    ? descText.split("\n\n").map((p, i) => (
        <p key={i} style={{ marginBottom: "1rem" }}>
          {p}
        </p>
      ))
    : (
        <p>
          {locale === "ar"
            ? "لا يوجد وصف وظيفي متاح حالياً."
            : "No job description available."}
        </p>
      );

  let requirementsHTML: React.ReactNode = null;
  if (dbJob.requirements) {
    const reqText = serializeLexical(dbJob.requirements);
    if (reqText) {
      requirementsHTML = (
        <ul>
          {reqText.split("\n\n").map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      );
    }
  }

  const positionInfoLabel = locale === "ar" ? "معلومات الوظيفة" : "Position Info";
  const deptLabel = locale === "ar" ? "القسم" : "Department";
  const locLabel = locale === "ar" ? "الموقع" : "Location";
  const typeLabel = locale === "ar" ? "نوع الوظيفة" : "Job Type";
  const applyLabel = locale === "ar" ? "التقديم الآن" : "Apply Now";
  const overviewLabel = locale === "ar" ? "الوصف الوظيفي" : "Role Overview";
  const reqsLabel =
    locale === "ar" ? "الشروط والمؤهلات" : "Requirements & Qualifications";

  return (
    <PageShell>
      <PageBanner title={title} subtitle={category} showImage={false} />

      <section className="job-detail jobs-section">
        <div className="about-grid">
          <div className="job-detail__sidebar about-grid__cols-1-4">
            <ScrollReveal>
              <div className="job-sidebar-card">
                <AnimatedHeadline
                  title={positionInfoLabel}
                  className="job-sidebar-card__title"
                  as="h4"
                />
                <div className="job-sidebar-card__meta-list">
                  <div className="job-sidebar-meta">
                    <span className="job-sidebar-meta__label">{deptLabel}</span>
                    <span className="job-sidebar-meta__value">{category}</span>
                  </div>
                  <div className="job-sidebar-meta">
                    <span className="job-sidebar-meta__label">{locLabel}</span>
                    <span className="job-sidebar-meta__value">{location}</span>
                  </div>
                  <div className="job-sidebar-meta">
                    <span className="job-sidebar-meta__label">{typeLabel}</span>
                    <span className="job-sidebar-meta__value">{employmentType}</span>
                  </div>
                </div>
                <Link
                  href={`/jobs/${slug}/apply`}
                  className="btn w-full text-center"
                  style={{ marginTop: "1rem" }}
                >
                  {applyLabel}
                  <svg
                    className="btn-arrow"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={
                      locale === "ar"
                        ? { transform: "rotate(180deg)", marginRight: "0.5rem" }
                        : undefined
                    }
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
                <AnimatedHeadline
                  title={overviewLabel}
                  className="job-content-section__title"
                  as="h3"
                />
                <div className="job-content-section__body">{descriptionHTML}</div>
              </div>
            </ScrollReveal>

            {requirementsHTML ? (
              <ScrollReveal delay={0.7}>
                <div className="job-content-section">
                  <AnimatedHeadline
                    title={reqsLabel}
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
    </PageShell>
  );
}
