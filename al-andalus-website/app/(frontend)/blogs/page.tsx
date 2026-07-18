import HeaderServer from "../../components/HeaderServer";
import Loader from "../../components/Loader";
import ScrollReveal from "../../components/ScrollReveal";
import SmoothScroll from "../../components/SmoothScroll";
import GSAPAnimations from "../../components/GSAPAnimations";
import PageBanner from "../../components/PageBanner";
import AnimatedHeadline from "../../components/AnimatedHeadline";
import NewsGrid from "../../components/NewsGrid";
import ContactCtaServer from "../../components/ContactCtaServer";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";
import { fetchPagesContent, fetchPublishedNews } from "@/lib/cms/content";
import FooterServer from "../../components/FooterServer";

export async function generateMetadata() {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  return {
    title: siteCopy.meta.blogs.title,
    description: siteCopy.meta.blogs.description,
  };
}

export default async function BlogsPage() {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  const { blogsPage } = siteCopy;

  const [blogItems, pages] = await Promise.all([
    fetchPublishedNews(undefined, 50),
    fetchPagesContent(),
  ]);
  const cms = pages.blogs;

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <HeaderServer />

        <PageBanner
          title={cms.bannerTitle || blogsPage.banner.title}
          subtitle={cms.bannerSubtitle || blogsPage.banner.subtitle}
          imageSrc={
            cms.bannerImageUrl ??
            "/al-and images/laptop-and-newspapers-with-coffee-cup-on-desk-2026-01-06-00-37-05-utc.jpg"
          }
        />

        <section className="news" id="blogs">
          <div className="news__header">
            <div>
              <ScrollReveal>
                <p className="news__label">{cms.sectionLabel}</p>
              </ScrollReveal>
              <AnimatedHeadline title={cms.sectionTitle} className="news__title" />
            </div>
          </div>

          <NewsGrid
            itemBasePath="/blogs"
            items={blogItems}
          />
        </section>

        <ContactCtaServer />

        <FooterServer />
      </SmoothScroll>
    </>
  );
}
