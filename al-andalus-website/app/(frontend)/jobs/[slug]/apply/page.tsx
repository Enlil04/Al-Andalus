import { notFound } from "next/navigation";
import PageShell from "../../../../components/PageShell";
import PageBanner from "../../../../components/PageBanner";
import JobApplicationForm from "../../../../components/JobApplicationForm";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";
import { fetchJobBySlug } from "@/lib/cms/content";
import { slugify } from "@/lib/cms/format";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  const dbJob = await fetchJobBySlug(slug);
  const staticJob = siteCopy.jobsPage.listings.jobs.find(
    (job) => slugify(job.title) === slug,
  );
  const title = (dbJob?.title as string | undefined) || staticJob?.title;

  if (!title) {
    return {
      title:
        locale === "ar"
          ? "الوظيفة غير موجودة | الأندلس للتأمين"
          : "Job not found | Al-Andalus Insurance",
    };
  }

  return {
    title:
      locale === "ar"
        ? `التقديم — ${title} | وظائف الأندلس`
        : `Apply — ${title} | Al-Andalus Careers`,
  };
}

export default async function JobApplyPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  const dbJob = await fetchJobBySlug(slug);
  const staticJob = siteCopy.jobsPage.listings.jobs.find(
    (job) => slugify(job.title) === slug,
  );

  if (!dbJob && !staticJob) {
    notFound();
  }

  const jobTitle = (dbJob?.title as string | undefined) || staticJob?.title || "";
  const jobId = dbJob?.id as string | number | undefined;
  const bannerSubtitle =
    locale === "ar" ? "نموذج التقديم" : "Application form";

  return (
    <PageShell>
      <PageBanner title={jobTitle} subtitle={bannerSubtitle} showImage={false} />
      <JobApplicationForm jobId={jobId} jobSlug={slug} jobTitle={jobTitle} />
    </PageShell>
  );
}
