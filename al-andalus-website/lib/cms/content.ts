import type { Payload } from "payload";
import { getSiteCopy } from "@/lib/copy";
import { getFaqItems, type FaqItem } from "@/lib/faq";
import {
  getFeaturedServices,
  getServices,
  normalizeServiceSlug,
  getProductSlugCandidates,
  type Service,
  type ServiceCategoryId,
} from "@/lib/services";
import { getLocale } from "../locale";
import { serializeLexical } from "./lexical";
import { getMediaUrl } from "./media";
import { getCMSPayload } from "./payload";

const SERVICE_CATEGORIES = new Set<ServiceCategoryId>([
  "personal",
  "business",
  "industrial",
  "financial",
]);

function resolveServiceCategory(
  value: unknown,
  fallback: ServiceCategoryId = "business",
): ServiceCategoryId {
  if (typeof value === "string" && SERVICE_CATEGORIES.has(value as ServiceCategoryId)) {
    return value as ServiceCategoryId;
  }
  return fallback;
}

export type HeroContent = {
  headline: string;
  headlineRight: string;
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

/** Payload may return English defaultValue / locale fallback for unsaved globals. */
const ENGLISH_HERO_DEFAULT =
  "When the stakes are high,\nyour insurer should be too.";

function normalizeCmsText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n/g, "\n").trim();
}

function resolveLocalizedText(
  cmsValue: unknown,
  fallback: string,
  locale: string,
  englishDefaults: string[] = [],
): string {
  const text = normalizeCmsText(cmsValue);
  if (!text) return fallback;

  if (locale === "ar") {
    const normalizedDefaults = englishDefaults.map((entry) =>
      entry.replace(/\r\n/g, "\n").trim(),
    );
    if (normalizedDefaults.includes(text)) {
      return fallback;
    }
  }

  return text;
}

function pickLocaleValue(
  record: Record<string, unknown> | null | undefined,
  base: string,
  locale: string,
): unknown {
  if (!record) return undefined;
  const en = record[`${base}En`];
  const ar = record[`${base}Ar`];
  if (locale === "ar") {
    return ar || en;
  }
  return en || ar;
}

function pickLocaleText(
  record: Record<string, unknown> | null | undefined,
  base: string,
  locale: string,
  fallback = "",
): string {
  const value = pickLocaleValue(record, base, locale);
  return normalizeCmsText(value) || fallback;
}

export async function fetchHomepageContent(payload?: Payload) {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const siteCopy = getSiteCopy(currentLocale);
  const [homepage, siteSettings] = await Promise.all([
    cms.findGlobal({ slug: "homepage" }),
    cms.findGlobal({ slug: "site-settings" }),
  ]);

  const useArabic = currentLocale === "ar";
  const settingsHeroText = useArabic
    ? siteSettings.heroTextAr || siteSettings.heroTextEn
    : siteSettings.heroTextEn || siteSettings.heroTextAr;
  const settingsHeroSubtext = useArabic
    ? siteSettings.heroSubtextAr || siteSettings.heroSubtextEn
    : siteSettings.heroSubtextEn || siteSettings.heroSubtextAr;

  const heroSlide = (homepage.heroSlides?.[0] ?? null) as Record<
    string,
    unknown
  > | null;
  const intro = (homepage.intro ?? null) as Record<string, unknown> | null;
  const story = (homepage.story ?? null) as Record<string, unknown> | null;
  const aboutPreviewGroup = (homepage.aboutPreview ?? null) as Record<
    string,
    unknown
  > | null;
  const contactCtaGroup = (homepage.contactCta ?? null) as Record<
    string,
    unknown
  > | null;

  const hero: HeroContent = {
    headline: resolveLocalizedText(
      pickLocaleValue(heroSlide, "headline", currentLocale) ?? settingsHeroText,
      siteCopy.hero.headline,
      currentLocale,
      [ENGLISH_HERO_DEFAULT],
    ),
    headlineRight: resolveLocalizedText(
      pickLocaleValue(heroSlide, "subheadline", currentLocale) ??
        settingsHeroSubtext,
      siteCopy.hero.headlineRight,
      currentLocale,
    ),
    scrollLabel: siteCopy.hero.scrollLabel,
    videoUrl:
      getMediaUrl(heroSlide?.video as Parameters<typeof getMediaUrl>[0]) ??
      getMediaUrl(siteSettings.heroVideo),
    imageUrl:
      getMediaUrl(heroSlide?.image as Parameters<typeof getMediaUrl>[0]) ??
      getMediaUrl(siteSettings.heroImage),
  };

  const introLines = siteCopy.intro.headline;
  const introContent: IntroContent = {
    titleLines: [
      pickLocaleText(intro, "titleLine1", currentLocale, introLines[0]),
      pickLocaleText(intro, "titleLine2", currentLocale, introLines[1]),
      pickLocaleText(intro, "titleLine3", currentLocale, introLines[2]),
    ],
    lead: pickLocaleText(intro, "lead", currentLocale, siteCopy.intro.lead),
    imageUrl: getMediaUrl(intro?.image as Parameters<typeof getMediaUrl>[0]),
  };

  const storyDescription = pickLocaleText(
    story,
    "description",
    currentLocale,
    siteCopy.story.paragraphs.join("\n\n"),
  );
  const storyContent: StoryContent = {
    paragraphs: splitParagraphs(storyDescription),
    ctaText: pickLocaleText(story, "ctaText", currentLocale, siteCopy.story.cta),
    ctaLink: normalizeCmsText(story?.ctaLink) || "#about",
  };

  const aboutPreview: AboutPreviewContent = {
    label: siteCopy.aboutPinned.label,
    headline:
      pickLocaleText(
        aboutPreviewGroup,
        "title",
        currentLocale,
      ).replace(/\\n/g, "\n") || siteCopy.aboutPinned.headline,
    text:
      pickLocaleText(aboutPreviewGroup, "description", currentLocale) ||
      siteCopy.aboutPinned.text,
  };

  const contactDescription = pickLocaleText(
    contactCtaGroup,
    "description",
    currentLocale,
  );
  const contactCta: ContactCtaContent = {
    headline:
      pickLocaleText(contactCtaGroup, "title", currentLocale) ||
      siteCopy.contact.headline,
    lines: contactDescription
      ? splitLines(contactDescription)
      : [...siteCopy.contact.lines],
    cta:
      pickLocaleText(contactCtaGroup, "buttonText", currentLocale) ||
      siteCopy.contact.cta,
    ctaLink:
      normalizeCmsText(contactCtaGroup?.buttonLink) || "/request-quote",
  };

  return {
    hero,
    intro: introContent,
    story: storyContent,
    aboutPreview,
    contactCta,
  };
}

export async function fetchAboutPageContent(payload?: Payload): Promise<AboutPageContent> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const siteCopy = getSiteCopy(currentLocale);
  const about = (await cms.findGlobal({
    slug: "about-page",
  })) as Record<string, unknown>;

  const fallback = siteCopy.aboutPage;
  const missionDoc = pickLocaleValue(about, "mission", currentLocale);
  const missionText = missionDoc ? serializeLexical(missionDoc) : "";
  const missionParagraphs =
    missionText.length > 0
      ? splitParagraphs(missionText)
      : [...fallback.mission.paragraphs];

  const visionDoc = pickLocaleValue(about, "vision", currentLocale);
  const visionText = visionDoc ? serializeLexical(visionDoc) : "";
  const visionParagraphs =
    visionText.length > 0
      ? splitParagraphs(visionText)
      : [...fallback.vision.paragraphs];

  const historyDoc = pickLocaleValue(about, "history", currentLocale);
  const historyText = historyDoc ? serializeLexical(historyDoc) : "";
  const historyEvents =
    historyText.length > 0
      ? splitParagraphs(historyText).map((event, index) => ({
          year: fallback.history[index]?.year ?? String(index + 1),
          event,
        }))
      : [...fallback.history];

  const cmsLeaders = about.leadership as Array<Record<string, unknown>> | null;
  const leadership: readonly LeadershipEntry[] =
    cmsLeaders && cmsLeaders.length > 0
      ? cmsLeaders.map((cmsLeader, index) => {
          const fallbackLeader =
            index === 0 ? fallback.leadership.ceo : fallback.leadership.md;
          const bio = pickLocaleText(cmsLeader, "bio", currentLocale);
          return {
            name:
              pickLocaleText(cmsLeader, "name", currentLocale) ||
              fallbackLeader.signoff,
            role:
              pickLocaleText(cmsLeader, "role", currentLocale) ||
              fallbackLeader.role,
            bioParagraphs: bio
              ? splitParagraphs(bio)
              : [...fallbackLeader.paragraphs],
            photoUrl: getMediaUrl(
              cmsLeader.photo as Parameters<typeof getMediaUrl>[0],
            ),
          };
        })
      : [
          {
            name: fallback.leadership.ceo.signoff,
            role: fallback.leadership.ceo.role,
            bioParagraphs: fallback.leadership.ceo.paragraphs,
            photoUrl:
              "/al-and images/ChatGPT Image Jul 9, 2026, 05_09_09 PM.png",
          },
          {
            name: fallback.leadership.md.signoff,
            role: fallback.leadership.md.role,
            bioParagraphs: fallback.leadership.md.paragraphs,
            photoUrl:
              "/al-and images/ChatGPT Image Jul 15, 2026, 10_41_41 PM.png",
          },
        ];

  return {
    bannerTitle:
      pickLocaleText(about, "heroTitle", currentLocale) ||
      fallback.banner.title,
    bannerSubtitle: fallback.banner.subtitle,
    heroImageUrl: getMediaUrl(
      about.heroImage as Parameters<typeof getMediaUrl>[0],
    ),
    missionParagraphs,
    visionParagraphs,
    leadership,
    historyEvents,
  };
}

export async function fetchSiteSettings(payload?: Payload): Promise<SiteSettingsContent> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const siteCopy = getSiteCopy(currentLocale);
  const settings = await cms.findGlobal({
    slug: "site-settings",
  });

  const social = siteCopy.footer.social;
  const cmsSocial = settings.socialLinks;
  const useArabic = currentLocale === "ar";

  const socialLinks = [
    { label: "Facebook", href: cmsSocial?.facebook ?? social[0]?.href ?? "" },
    { label: "Instagram", href: cmsSocial?.instagram ?? social[1]?.href ?? "" },
    { label: "LinkedIn", href: cmsSocial?.linkedin ?? social[2]?.href ?? "" },
    { label: "TikTok", href: cmsSocial?.tiktok ?? social[3]?.href ?? "" },
  ].filter((link) => link.href);

  const companyName = useArabic
    ? settings.companyNameAr ||
      settings.companyNameEn ||
      "شركة الأندلس للتأمين الدولي"
    : settings.companyNameEn ||
      settings.companyNameAr ||
      "Al-Andalus International Insurance";

  return {
    companyName,
    phone: settings.contact?.phone ?? "+9647710006000",
    shortNumber: settings.contact?.shortNumber ?? "7366",
    email: settings.contact?.email ?? "info@alandalus-iq.com",
    whatsapp: settings.contact?.whatsapp ?? "+9647710006000",
    socialLinks,
  };
}

export async function fetchFeaturedProducts(payload?: Payload): Promise<Service[]> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const allServices = await fetchAllProducts(cms);
  const bySlug = new Map(allServices.map((service) => [service.slug, service]));

  const { docs } = await cms.find({
    collection: "products",
    limit: 100,
    sort: "order",
    overrideAccess: true,
    where: {
      and: [
        { isFeatured: { equals: true } },
        {
          or: [
            { status: { equals: "active" } },
            { status: { equals: "under-development" } },
          ],
        },
      ],
    },
  });

  if (docs.length > 0) {
    return docs
      .map((product) => {
        const slug = normalizeServiceSlug(product.slug as string);
        return bySlug.get(slug) ?? mapProductToService(product as Record<string, unknown>, currentLocale);
      })
      .filter((service): service is Service => Boolean(service));
  }

  return getFeaturedServices(currentLocale).map(
    (featured) => bySlug.get(featured.slug) ?? featured,
  );
}

export async function fetchFaqs(payload?: Payload): Promise<FaqItem[]> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const { docs } = await cms.find({
    collection: "faqs",
    limit: 20,
    sort: "order",
    overrideAccess: true,
  });

  if (docs.length === 0) {
    return getFaqItems(currentLocale);
  }

  const useArabic = currentLocale === "ar";

  return docs.map((item) => {
    const record = item as Record<string, unknown>;
    const question = useArabic
      ? ((record.questionAr as string) || (record.questionEn as string) || "")
      : ((record.questionEn as string) || (record.questionAr as string) || "");
    const answerDoc = useArabic
      ? record.answerAr || record.answerEn
      : record.answerEn || record.answerAr;

    return {
      question,
      answer: serializeLexical(answerDoc),
    };
  });
}

export type NewsListItem = {
  id: string | number;
  title: string;
  slug: string;
  publishedDate: string | null;
  category: string | null;
  excerpt: string | null;
  imageUrl: string | null;
};

export type JobListItem = {
  slug: string;
  title: string;
  department: string;
};

export type QuoteProduct = {
  id: string | number;
  slug: string;
  title: string;
};

function mapProductToService(
  product: Record<string, unknown>,
  locale: string,
): Service {
  const slug = normalizeServiceSlug(product.slug as string);
  const staticMatch = getServices(locale).find((s) => s.slug === slug);
  return {
    slug,
    title:
      pickLocaleText(product, "title", locale) ||
      staticMatch?.title ||
      slug,
    description:
      pickLocaleText(product, "shortDescription", locale) ||
      staticMatch?.description ||
      "",
    category: resolveServiceCategory(
      product.category,
      staticMatch?.category ?? "business",
    ),
    subtitle: staticMatch?.subtitle,
    underDevelopment:
      product.status === "under-development" || staticMatch?.underDevelopment,
  };
}

function mergeWithStaticServices(
  cmsServices: Service[],
  locale: string,
): Service[] {
  const cmsBySlug = new Map(cmsServices.map((service) => [service.slug, service]));
  const staticSlugs = new Set(getServices(locale).map((service) => service.slug));

  const merged = getServices(locale).map((staticService) => {
    const cmsService = cmsBySlug.get(staticService.slug);
    if (!cmsService) {
      return staticService;
    }

    return {
      ...staticService,
      title: cmsService.title || staticService.title,
      description: cmsService.description || staticService.description,
      category: cmsService.category || staticService.category,
      underDevelopment:
        cmsService.underDevelopment ?? staticService.underDevelopment,
    };
  });

  const cmsOnly = cmsServices.filter((service) => !staticSlugs.has(service.slug));
  return [...merged, ...cmsOnly];
}

export async function fetchAllProducts(payload?: Payload): Promise<Service[]> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const { docs } = await cms.find({
    collection: "products",
    limit: 100,
    sort: "order",
    overrideAccess: true,
    where: {
      or: [
        { status: { equals: "active" } },
        { status: { equals: "under-development" } },
      ],
    },
  });

  if (docs.length === 0) {
    return getServices(currentLocale);
  }

  const cmsServices = docs.map((product) =>
    mapProductToService(product as Record<string, unknown>, currentLocale),
  );

  return mergeWithStaticServices(cmsServices, currentLocale);
}

export async function fetchProductBySlug(
  slug: string,
  payload?: Payload,
): Promise<Record<string, unknown> | null> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const slugCandidates = getProductSlugCandidates(slug);
  const { docs } = await cms.find({
    collection: "products",
    limit: 1,
    depth: 1,
    overrideAccess: true,
    where: {
      slug: {
        in: slugCandidates,
      },
    },
  });

  const product = (docs[0] as Record<string, unknown>) ?? null;
  if (!product) return null;

  return {
    ...product,
    title: pickLocaleText(product, "title", currentLocale),
    shortDescription: pickLocaleText(product, "shortDescription", currentLocale),
    description: pickLocaleValue(product, "description", currentLocale),
  };
}

export async function fetchPublishedNews(
  payload?: Payload,
  limit = 50,
): Promise<NewsListItem[]> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const { docs } = await cms.find({
    collection: "news",
    limit,
    sort: "-publishedDate",
    depth: 1,
    overrideAccess: true,
    where: { status: { equals: "published" } },
  });

  return docs.map((item) => {
    const record = item as Record<string, unknown>;
    return {
      id: item.id,
      title: pickLocaleText(record, "title", currentLocale),
      slug: item.slug as string,
      publishedDate: (item.publishedDate as string) ?? null,
      category: (item.category as string) ?? null,
      excerpt: pickLocaleText(record, "excerpt", currentLocale) || null,
      imageUrl: getMediaUrl(item.coverImage as Parameters<typeof getMediaUrl>[0]),
    };
  });
}

export async function fetchNewsBySlug(
  slug: string,
  payload?: Payload,
): Promise<Record<string, unknown> | null> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const { docs } = await cms.find({
    collection: "news",
    limit: 1,
    depth: 1,
    overrideAccess: true,
    where: {
      and: [
        { slug: { equals: slug } },
        { status: { equals: "published" } },
      ],
    },
  });

  const post = (docs[0] as Record<string, unknown>) ?? null;
  if (!post) return null;

  return {
    ...post,
    title: pickLocaleText(post, "title", currentLocale),
    excerpt: pickLocaleText(post, "excerpt", currentLocale),
    content: pickLocaleValue(post, "content", currentLocale),
  };
}

export async function fetchPartners(
  payload?: Payload,
  limit = 100,
): Promise<Record<string, unknown>[]> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const { docs } = await cms.find({
    collection: "partners",
    locale: currentLocale,
    limit,
    sort: "order",
    depth: 1,
    overrideAccess: true,
  });
  return docs as Record<string, unknown>[];
}

export async function fetchOpenJobs(
  payload?: Payload,
): Promise<JobListItem[]> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const { docs } = await cms.find({
    collection: "jobs",
    limit: 100,
    sort: "-createdAt",
    overrideAccess: true,
    where: { status: { equals: "open" } },
  });

  if (docs.length === 0) {
    const siteCopy = getSiteCopy(currentLocale);
    return siteCopy.jobsPage.listings.jobs.map((job) => ({
      slug: job.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
      title: job.title,
      department: job.category,
    }));
  }

  return docs.map((job) => {
    const record = job as Record<string, unknown>;
    return {
      slug: record.slug as string,
      title: pickLocaleText(record, "title", currentLocale),
      department: pickLocaleText(record, "department", currentLocale),
    };
  });
}

export async function fetchJobBySlug(
  slug: string,
  payload?: Payload,
): Promise<Record<string, unknown> | null> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const { docs } = await cms.find({
    collection: "jobs",
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        { slug: { equals: slug } },
        { status: { equals: "open" } },
      ],
    },
  });

  const job = (docs[0] as Record<string, unknown>) ?? null;
  if (!job) return null;

  return {
    ...job,
    title: pickLocaleText(job, "title", currentLocale),
    department: pickLocaleText(job, "department", currentLocale),
    location: pickLocaleText(job, "location", currentLocale),
    description: pickLocaleValue(job, "description", currentLocale),
    requirements: pickLocaleValue(job, "requirements", currentLocale),
  };
}

export async function fetchQuoteProducts(
  payload?: Payload,
): Promise<QuoteProduct[]> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const { docs } = await cms.find({
    collection: "products",
    limit: 100,
    sort: "order",
    overrideAccess: true,
    where: { status: { equals: "active" } },
  });

  return docs.map((product) => {
    const record = product as Record<string, unknown>;
    return {
      id: product.id,
      slug: normalizeServiceSlug(product.slug as string),
      title: pickLocaleText(record, "title", currentLocale),
    };
  });
}
