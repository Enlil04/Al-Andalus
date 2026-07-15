import type { Payload } from "payload";
import { siteCopy } from "@/lib/copy/en";
import { faqItems, type FaqItem } from "@/lib/faq";
import { getFeaturedServices, type Service } from "@/lib/services";
import { FRONTEND_LOCALE } from "./locale";
import { serializeLexical } from "./lexical";
import { getMediaUrl } from "./media";
import { getCMSPayload } from "./payload";

export type HeroContent = {
  headline: string;
  scrollLabel: string;
  videoUrl: string | null;
  imageUrl: string | null;
};

export type IntroContent = {
  titleLines: [string, string, string];
  lead: string;
  imageUrl: string | null;
};

export type StoryContent = {
  paragraphs: string[];
  ctaText: string;
  ctaLink: string;
};

export type AboutPreviewContent = {
  label: string;
  headline: string;
  text: string;
};

export type ContactCtaContent = {
  headline: string;
  lines: readonly string[];
  cta: string;
  ctaLink: string;
};

export type LeadershipEntry = {
  name: string;
  role: string;
  bioParagraphs: readonly string[];
  photoUrl: string | null;
};

export type AboutPageContent = {
  bannerTitle: string;
  bannerSubtitle: string;
  heroImageUrl: string | null;
  missionParagraphs: readonly string[];
  visionParagraphs: readonly string[];
  leadership: readonly LeadershipEntry[];
  historyEvents: readonly { year: string; event: string }[];
};

export type SiteSettingsContent = {
  companyName: string;
  phone: string;
  shortNumber: string;
  email: string;
  whatsapp: string;
  socialLinks: { label: string; href: string }[];
};

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function fetchHomepageContent(payload?: Payload) {
  const cms = payload ?? (await getCMSPayload());
  const [homepage, siteSettings] = await Promise.all([
    cms.findGlobal({ slug: "homepage", locale: FRONTEND_LOCALE }),
    cms.findGlobal({ slug: "site-settings", locale: FRONTEND_LOCALE }),
  ]);

  const heroSlide = homepage.heroSlides?.[0];
  const hero: HeroContent = {
    headline:
      heroSlide?.headline ??
      siteSettings.heroText ??
      siteCopy.hero.headline,
    scrollLabel: siteCopy.hero.scrollLabel,
    videoUrl:
      getMediaUrl(heroSlide?.video) ??
      getMediaUrl(siteSettings.heroVideo),
    imageUrl:
      getMediaUrl(heroSlide?.image) ??
      getMediaUrl(siteSettings.heroImage),
  };

  const introLines = siteCopy.intro.headline;
  const intro: IntroContent = {
    titleLines: [
      homepage.intro?.titleLine1 ?? introLines[0],
      homepage.intro?.titleLine2 ?? introLines[1],
      homepage.intro?.titleLine3 ?? introLines[2],
    ],
    lead: homepage.intro?.lead ?? siteCopy.intro.lead,
    imageUrl: getMediaUrl(homepage.intro?.image),
  };

  const storyDescription =
    homepage.story?.description ??
    siteCopy.story.paragraphs.join("\n\n");
  const story: StoryContent = {
    paragraphs: splitParagraphs(storyDescription),
    ctaText: homepage.story?.ctaText ?? siteCopy.story.cta,
    ctaLink: homepage.story?.ctaLink ?? "#about",
  };

  const aboutPreview: AboutPreviewContent = {
    label: siteCopy.aboutPinned.label,
    headline:
      homepage.aboutPreview?.title?.replace(/\\n/g, "\n") ??
      siteCopy.aboutPinned.headline,
    text:
      homepage.aboutPreview?.description ??
      siteCopy.aboutPinned.text,
  };

  const contactCta: ContactCtaContent = {
    headline:
      homepage.contactCta?.title ?? siteCopy.contact.headline,
    lines: homepage.contactCta?.description
      ? splitLines(homepage.contactCta.description)
      : [...siteCopy.contact.lines],
    cta:
      homepage.contactCta?.buttonText ?? siteCopy.contact.cta,
    ctaLink:
      homepage.contactCta?.buttonLink ?? "/request-quote",
  };

  return { hero, intro, story, aboutPreview, contactCta };
}

export async function fetchAboutPageContent(payload?: Payload): Promise<AboutPageContent> {
  const cms = payload ?? (await getCMSPayload());
  const about = await cms.findGlobal({
    slug: "about-page",
    locale: FRONTEND_LOCALE,
  });

  const fallback = siteCopy.aboutPage;
  const missionText = about.mission
    ? serializeLexical(about.mission)
    : "";
  const missionParagraphs =
    missionText.length > 0
      ? splitParagraphs(missionText)
      : [...fallback.mission.paragraphs];

  const visionText = about.vision
    ? serializeLexical(about.vision)
    : "";
  const visionParagraphs =
    visionText.length > 0
      ? splitParagraphs(visionText)
      : [...fallback.vision.paragraphs];

  const historyText = about.history ? serializeLexical(about.history) : "";
  const historyEvents =
    historyText.length > 0
      ? splitParagraphs(historyText).map((event, index) => ({
          year: fallback.history[index]?.year ?? String(index + 1),
          event,
        }))
      : [...fallback.history];

  const cmsLeaders = about.leadership;
  const leadership: readonly LeadershipEntry[] = (cmsLeaders && cmsLeaders.length > 0)
    ? (cmsLeaders as any[]).map((cmsLeader: any, index: number) => {
        const fallbackLeader = index === 0 ? fallback.leadership.ceo : fallback.leadership.md;
        return {
          name: cmsLeader.name,
          role: (cmsLeader.role as string) ?? fallbackLeader.role,
          bioParagraphs: cmsLeader.bio
            ? splitParagraphs(cmsLeader.bio as string)
            : [...fallbackLeader.paragraphs],
          photoUrl: getMediaUrl(cmsLeader.photo),
        };
      })
    : [
        {
          name: fallback.leadership.ceo.signoff,
          role: fallback.leadership.ceo.role,
          bioParagraphs: fallback.leadership.ceo.paragraphs,
          photoUrl: "/al-and images/ChatGPT Image Jul 9, 2026, 05_09_09 PM.png",
        },
        {
          name: fallback.leadership.md.signoff,
          role: fallback.leadership.md.role,
          bioParagraphs: fallback.leadership.md.paragraphs,
          photoUrl: "/al-and images/Modern Office Interior.png",
        },
      ];

  return {
    bannerTitle: about.heroTitle ?? fallback.banner.title,
    bannerSubtitle: fallback.banner.subtitle,
    heroImageUrl: getMediaUrl(about.heroImage),
    missionParagraphs,
    visionParagraphs,
    leadership,
    historyEvents,
  };
}

export async function fetchSiteSettings(payload?: Payload): Promise<SiteSettingsContent> {
  const cms = payload ?? (await getCMSPayload());
  const settings = await cms.findGlobal({
    slug: "site-settings",
    locale: FRONTEND_LOCALE,
  });

  const social = siteCopy.footer.social;
  const cmsSocial = settings.socialLinks;

  const socialLinks = [
    { label: "Facebook", href: cmsSocial?.facebook ?? social[0]?.href ?? "" },
    { label: "Instagram", href: cmsSocial?.instagram ?? social[1]?.href ?? "" },
    { label: "LinkedIn", href: cmsSocial?.linkedin ?? social[2]?.href ?? "" },
    { label: "TikTok", href: cmsSocial?.tiktok ?? social[3]?.href ?? "" },
  ].filter((link) => link.href);

  return {
    companyName:
      settings.companyName ?? "Al-Andalus International Insurance",
    phone: settings.contact?.phone ?? "+9647710006000",
    shortNumber: settings.contact?.shortNumber ?? "7366",
    email: settings.contact?.email ?? "info@alandalus-iq.com",
    whatsapp: settings.contact?.whatsapp ?? "+9647710006000",
    socialLinks,
  };
}

export async function fetchFeaturedProducts(payload?: Payload): Promise<Service[]> {
  const cms = payload ?? (await getCMSPayload());
  const { docs } = await cms.find({
    collection: "products",
    locale: FRONTEND_LOCALE,
    limit: 10,
    sort: "order",
    where: {
      and: [
        { isFeatured: { equals: true } },
        { status: { equals: "active" } },
      ],
    },
  });

  if (docs.length === 0) {
    return getFeaturedServices();
  }

  return docs.map((product) => ({
    slug: product.slug as string,
    title: product.title as string,
    description: product.shortDescription as string,
    category: (product.category as any) ?? "personal",
  }));
}

export async function fetchFaqs(payload?: Payload): Promise<FaqItem[]> {
  const cms = payload ?? (await getCMSPayload());
  const { docs } = await cms.find({
    collection: "faqs",
    locale: FRONTEND_LOCALE,
    limit: 20,
    sort: "order",
  });

  if (docs.length === 0) {
    return faqItems;
  }

  return docs.map((item) => ({
    question: item.question as string,
    answer: serializeLexical(item.answer),
  }));
}
