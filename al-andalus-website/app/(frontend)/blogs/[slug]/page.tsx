import React from "react";
import { notFound } from "next/navigation";
import PageShell from "../../../components/PageShell";
import ScrollReveal from "../../../components/ScrollReveal";
import AnimatedHeadline from "../../../components/AnimatedHeadline";
import BlogPostHeading from "../../../components/BlogPostHeading";
import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { fetchNewsBySlug } from "@/lib/cms/content";
import { getMediaUrl } from "@/lib/cms/media";
import { formatNewsDate, getNewsCategoryLabel } from "@/lib/cms/format";
import "./BlogDetail.css";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await fetchNewsBySlug(slug);
  if (!post) {
    return {
      title:
        locale === "ar"
          ? "المقال غير موجود | الأندلس للتأمين"
          : "Post not found | Al-Andalus Insurance",
    };
  }
  const title = (post.title as string) || slug;
  const excerpt = (post.excerpt as string) || "";
  return {
    title:
      locale === "ar"
        ? `${title} | أخبار الأندلس`
        : `${title} | Al-Andalus News`,
    description: excerpt || undefined,
  };
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

  const post = await fetchNewsBySlug(slug);

  if (!post) {
    notFound();
  }

  const categoryLabel = getNewsCategoryLabel(post.category as string | null, locale);
  const publishedDateFormatted = formatNewsDate(post.publishedDate as string);

  const coverImageUrl = getMediaUrl(
    post.coverImage as Parameters<typeof getMediaUrl>[0],
  );

  const backLabel = locale === "ar" ? "العودة إلى المقالات" : "Back to Articles";

  return (
    <PageShell>
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
    </PageShell>
  );
}
