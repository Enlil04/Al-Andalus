import React from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Loader from "../../../components/Loader";
import SmoothScroll from "../../../components/SmoothScroll";
import GSAPAnimations from "../../../components/GSAPAnimations";
import ScrollReveal from "../../../components/ScrollReveal";
import AnimatedHeadline from "../../../components/AnimatedHeadline";
import BlogPostHeading from "../../../components/BlogPostHeading";
import ContactCta from "../../../components/ContactCta";
import Link from "next/link";
import { getLocale } from "@/lib/locale";
import "./BlogDetail.css";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const CATEGORY_LABELS_EN: Record<string, string> = {
  company: "Company News",
  motor: "Motor Insurance",
  health: "Health Insurance",
  travel: "Travel Insurance",
  fire: "Fire Insurance",
  general: "General News",
};

const CATEGORY_LABELS_AR: Record<string, string> = {
  company: "أخبار الشركة",
  motor: "تأمين السيارات",
  health: "التأمين الصحي",
  travel: "تأمين السفر",
  fire: "تأمين الحريق",
  general: "أخبار عامة",
};

function formatNewsDate(date?: string | null) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function serializeLexicalHTML(richTextObj: any): React.ReactNode[] {
  if (!richTextObj || !richTextObj.root || !richTextObj.root.children) return [];
  return richTextObj.root.children.map((node: any, i: number) => {
    const childrenText = node.children
      ? node.children.map((child: any) => {
          let text = child.text || "";
          if (child.format & 1) {
            return <strong key={child.text}>{text}</strong>;
          }
          if (child.format & 2) {
            return <em key={child.text}>{text}</em>;
          }
          return text;
        })
      : [];

    switch (node.type) {
      case "heading": {
        const headingText =
          node.children?.map((child: { text?: string }) => child.text ?? "").join("") ?? "";
        return <BlogPostHeading key={i} level={node.tag || 3} text={headingText} />;
      }
      case "list":
        const ListTag = node.listType === "ordered" ? "ol" : "ul";
        return (
          <ListTag key={i} className="blog-post__list">
            {node.children.map((item: any, idx: number) => (
              <li key={idx}>
                {item.children ? item.children.map((child: any) => child.text || "").join("") : ""}
              </li>
            ))}
          </ListTag>
        );
      default:
        return (
          <p key={i} className="blog-post__paragraph">
            {childrenText}
          </p>
        );
    }
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();

  // 1. Fetch post from Payload news collection with correct locale
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "news",
    locale,
    where: {
      slug: { equals: slug },
      status: { equals: "published" },
    },
  });
  const post = docs[0];

  if (!post) {
    notFound();
  }

  const categoryLabels = locale === "ar" ? CATEGORY_LABELS_AR : CATEGORY_LABELS_EN;
  const categoryLabel = (post.category && categoryLabels[post.category]) || (locale === "ar" ? "أخبار عامة" : "General News");
  const publishedDateFormatted = formatNewsDate(post.publishedDate);

  const coverImageObj = post.coverImage;
  const coverImageUrl =
    coverImageObj && typeof coverImageObj !== "string" ? coverImageObj.url : null;

  const backLabel = locale === "ar" ? "العودة إلى المقالات" : "Back to Articles";

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        <article className="blog-post">
          <div className="about-grid">
            <div className="about-grid__span-all">
              <ScrollReveal>
                <div className="blog-post__meta-container">
                  <span className="blog-post__category">{categoryLabel}</span>
                  <AnimatedHeadline title={post.title as string} className="blog-post__title" as="h1" />
                  <span className="blog-post__date">{publishedDateFormatted}</span>
                </div>
              </ScrollReveal>
            </div>

            {coverImageUrl ? (
              <div className="about-grid__span-all">
                <ScrollReveal delay={0.5}>
                  <div className="blog-post__cover-container">
                    <div
                      className="blog-post__cover-image"
                      style={{ backgroundImage: `url("${coverImageUrl}")` }}
                      role="img"
                      aria-label={`${post.title} cover image`}
                    />
                  </div>
                </ScrollReveal>
              </div>
            ) : null}

            <div className="about-grid__span-all">
              <ScrollReveal delay={0.7}>
                <div className="blog-post__body">
                  {serializeLexicalHTML(post.content)}
                </div>
              </ScrollReveal>
            </div>

            <div className="about-grid__span-all">
              <ScrollReveal delay={0.9}>
                <div className="blog-post__footer">
                  <Link href="/blogs" className="blog-post__back-link">
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      style={locale === "ar" ? { transform: "rotate(180deg)", marginLeft: "0.5rem" } : undefined}
                    >
                      <path d="M13 7H1M1 7l5-5M1 7l5 5" />
                    </svg>
                    {backLabel}
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </article>

        <ContactCta />

        <Footer />
      </SmoothScroll>
    </>
  );
}
