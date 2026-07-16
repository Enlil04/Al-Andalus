import Header from "../../components/Header";
import Loader from "../../components/Loader";
import ScrollReveal from "../../components/ScrollReveal";
import SmoothScroll from "../../components/SmoothScroll";
import GSAPAnimations from "../../components/GSAPAnimations";
import PageBanner from "../../components/PageBanner";
import AnimatedHeadline from "../../components/AnimatedHeadline";
import NewsGrid from "../../components/NewsGrid";
import ContactCta from "../../components/ContactCta";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";
import { fetchPublishedNews } from "@/lib/cms/content";
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

  const blogItems = await fetchPublishedNews(undefined, 50);

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        <PageBanner
          title={blogsPage.banner.title}
          subtitle={blogsPage.banner.subtitle}
          imageSrc="/al-and images/laptop-and-newspapers-with-coffee-cup-on-desk-2026-01-06-00-37-05-utc.jpg"
        />

        <section className="news" id="blogs">
          <div className="news__header">
            <div>
              <ScrollReveal>
                <p className="news__label">{blogsPage.section.label}</p>
              </ScrollReveal>
              <AnimatedHeadline title={blogsPage.section.title} className="news__title" />
            </div>
          </div>

          <NewsGrid
            itemBasePath="/blogs"
            items={blogItems}
          />
        </section>

        <ContactCta />

        <FooterServer />
      </SmoothScroll>
    </>
  );
}
