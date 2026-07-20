import { cache } from "react";
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
import { IMAGE_FALLBACKS } from "./fallbacks";
import { serializeLexical } from "./lexical";
import { getMediaUrl } from "./media";
import { getCMSPayload } from "./payload";
import { slugify } from "./format";

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
  imageLargeUrl: string | null;
  imageSmallUrl: string | null;
};

export type AboutPreviewContent = {
  label: string;
  headline: string;
  text: string;
  image1Url: string | null;
  image2Url: string | null;
  image3Url: string | null;
  image4Url: string | null;
};

export type ContactCtaContent = {
  headline: string;
  lines: readonly string[];
  cta: string;
  ctaLink: string;
  backgroundImageUrl: string | null;
};

export type WhyUsContent = {
  label: string;
  headline: string;
  desc: string;
  img1Url: string | null;
  img2Url: string | null;
  img3Url: string | null;
  img4Url: string | null;
  img5Url: string | null;
  img6Url: string | null;
};

export type LeadershipEntry = {
  messageTitle: string;
  name: string;
  role: string;
  bioParagraphs: readonly string[];
  photoUrl: string | null;
};

export type AboutPageContent = {
  bannerTitle: string;
  bannerSubtitle: string;
  heroImageUrl: string | null;
  missionLabel: string;
  missionHeadline: string;
  missionSubline: string;
  missionBodyTitle: string;
  missionImageUrl: string | null;
  missionAccentImage: string | null;
  missionParagraphs: readonly string[];
  vision: {
    label: string;
    headline: string;
    paragraphs: readonly string[];
    imageUrl: string | null;
    accentImageUrl: string | null;
  };
  whyChoose: {
    label: string;
    headline: string;
    pillars: readonly {
      id: string;
      circleLabel: string;
      title: string;
      items: readonly string[];
    }[];
  };
  leadershipLabel: string;
  leadership: readonly LeadershipEntry[];
  companyTitle: string;
  companyRows: readonly { label: string; value: string }[];
  boardLabel: string;
  boardMembers: readonly { role: string; name: string }[];
};

export type SiteSettingsContent = {
  companyName: string;
  phone: string;
  shortNumber: string;
  email: string;
  whatsapp: string;
  socialLinks: { label: string; href: string }[];
  branches?: {
    id: string;
    label: string;
    area: string;
    mapEmbedUrl: string;
    mapLinkUrl: string;
  }[];
  siteLogo: string | null;
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

export const fetchHomepageContent = cache(async function fetchHomepageContent(payload?: Payload) {
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
    scrollLabel: pickLocaleText(
      heroSlide,
      "scrollLabel",
      currentLocale,
      siteCopy.hero.scrollLabel,
    ),
    videoUrl: getMediaUrl(siteSettings.heroVideo),
    imageUrl: getMediaUrl(siteSettings.heroImage),
  };

  const introLines = siteCopy.intro.headline;
  const introContent: IntroContent = {
    titleLines: [
      pickLocaleText(intro, "titleLine1", currentLocale, introLines[0]),
      pickLocaleText(intro, "titleLine2", currentLocale, introLines[1]),
      pickLocaleText(intro, "titleLine3", currentLocale, introLines[2]),
    ],
    lead: pickLocaleText(intro, "lead", currentLocale, siteCopy.intro.lead),
    imageUrl: getMediaUrl(intro?.image),
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
    imageLargeUrl:
      getMediaUrl(story?.storyImageLarge) || IMAGE_FALLBACKS.storyLarge,
    imageSmallUrl:
      getMediaUrl(story?.storyImageSmall) || IMAGE_FALLBACKS.storySmall,
  };

  const aboutPreview: AboutPreviewContent = {
    label:
      pickLocaleText(aboutPreviewGroup, "label", currentLocale) ||
      siteCopy.aboutPinned.label,
    headline:
      pickLocaleText(
        aboutPreviewGroup,
        "title",
        currentLocale,
      ).replace(/\\n/g, "\n") || siteCopy.aboutPinned.headline,
    text:
      pickLocaleText(aboutPreviewGroup, "description", currentLocale) ||
      siteCopy.aboutPinned.text,
    image1Url:
      getMediaUrl(aboutPreviewGroup?.aboutImg1) || IMAGE_FALLBACKS.aboutPinned1,
    image2Url:
      getMediaUrl(aboutPreviewGroup?.aboutImg2) || IMAGE_FALLBACKS.aboutPinned2,
    image3Url:
      getMediaUrl(aboutPreviewGroup?.aboutImg3) || IMAGE_FALLBACKS.aboutPinned3,
    image4Url:
      getMediaUrl(aboutPreviewGroup?.aboutImg4) || IMAGE_FALLBACKS.aboutPinned4,
  };

  const whyUsGroup = (homepage.whyUs ?? null) as Record<string, unknown> | null;
  const whyUs: WhyUsContent = {
    label:
      pickLocaleText(whyUsGroup, "label", currentLocale) ||
      siteCopy.whyUs.label,
    headline:
      pickLocaleText(whyUsGroup, "title", currentLocale).replace(/\\n/g, "\n") ||
      siteCopy.whyUs.headline,
    desc:
      pickLocaleText(whyUsGroup, "description", currentLocale) ||
      siteCopy.whyUs.desc,
    img1Url: getMediaUrl(whyUsGroup?.img1) || IMAGE_FALLBACKS.whyUs1,
    img2Url: getMediaUrl(whyUsGroup?.img2) || IMAGE_FALLBACKS.whyUs2,
    img3Url: getMediaUrl(whyUsGroup?.img3) || IMAGE_FALLBACKS.whyUs3,
    img4Url: getMediaUrl(whyUsGroup?.img4) || IMAGE_FALLBACKS.whyUs4,
    img5Url: getMediaUrl(whyUsGroup?.img5) || IMAGE_FALLBACKS.whyUs5,
    img6Url: getMediaUrl(whyUsGroup?.img6) || IMAGE_FALLBACKS.whyUs6,
  };

  const expandingImageUrl =
    getMediaUrl(homepage.expandingImage) || IMAGE_FALLBACKS.heroExpanding;

  return {
    hero,
    intro: introContent,
    story: storyContent,
    expandingImageUrl,
    aboutPreview,
    whyUs,
  };
})

export type PagesContent = {
  services: {
    bannerTitle: string;
    bannerSubtitle: string;
    bannerImageUrl: string | null;
    messageLabel: string;
    messageHeadline: string;
    messageBodyTitle: string;
    messageParagraphs: readonly string[];
    messageImageUrl: string | null;
    messageBottomImageUrl: string | null;
    industriesLabel: string;
    industriesHeadline: string;
    industriesCoreTitle: string;
    industriesButtonText: string;
    industriesButtonLink: string;
    industriesImageUrl: string | null;
    sectors: readonly { title: string; desc: string }[];
  };
  jobs: {
    bannerTitle: string;
    bannerSubtitle: string;
    bannerImageUrl: string | null;
    messageLabel: string;
    messageHeadline: string;
    messageImageUrl: string | null;
    listingsEyebrow: string;
    listingsTitle: string;
  };
  blogs: {
    bannerTitle: string;
    bannerSubtitle: string;
    bannerImageUrl: string | null;
    sectionLabel: string;
    sectionTitle: string;
  };
  partners: {
    bannerTitle: string;
    bannerSubtitle: string;
    bannerImageUrl: string | null;
    introLabel: string;
    introHeadline: string;
    introDescription: string;
  };
  contact: {
    bannerTitle: string;
    bannerSubtitle: string;
    bannerImageUrl: string | null;
    formLabel: string;
    formHeadline: string;
    formIntro: string;
    visitLabel: string;
    visitHeadline: string;
    visitIntro: string;
  };
  requestQuote: {
    bannerTitle: string;
    bannerSubtitle: string;
    formLabel: string;
    formHeadline: string;
    formIntro: string;
    visitLabel: string;
    visitHeadline: string;
    visitIntro: string;
  };
  application: {
    bannerTitle: string;
    bannerSubtitle: string;
    title: string;
    paragraphs: readonly string[];
    imageUrl: string | null;
    downloads: readonly { label: string; url: string }[];
  };
  privacy: {
    bannerTitle: string;
    bannerSubtitle: string;
    sections: readonly {
      title: string;
      paragraphs: readonly string[];
      list: readonly string[];
    }[];
  };
};

/** Banner/section content for secondary pages; empty values fall back to static copy. */
export const fetchPagesContent = cache(async function fetchPagesContent(payload?: Payload): Promise<PagesContent> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const siteCopy = getSiteCopy(currentLocale);
  const pages = (await cms.findGlobal({ slug: "pages" })) as Record<
    string,
    unknown
  >;

  const group = (name: string) =>
    (pages[name] ?? null) as Record<string, unknown> | null;
  const services = group("services");
  const jobs = group("jobs");
  const blogs = group("blogs");
  const partners = group("partners");
  const contact = group("contact");
  const requestQuote = group("requestQuote");
  const application = group("application");
  const privacy = group("privacy");

  const banner = (record: Record<string, unknown> | null) => ({
    bannerTitle: pickLocaleText(record, "bannerTitle", currentLocale),
    bannerSubtitle: pickLocaleText(record, "bannerSubtitle", currentLocale),
    bannerImageUrl: getMediaUrl(
      record?.bannerImage,
    ),
  });

  const staticSectors = [
    ...siteCopy.servicesPage.industries.coreItems,
    ...siteCopy.servicesPage.industries.nodes,
  ];
  const sectors = [1, 2, 3, 4, 5].map((number, index) => {
    const sector = (services?.[`sector${number}`] ?? null) as Record<
      string,
      unknown
    > | null;
    const fallback = staticSectors[index];
    return {
      title: pickLocaleText(sector, "title", currentLocale) || fallback.title,
      desc: pickLocaleText(sector, "desc", currentLocale) || fallback.desc,
    };
  });

  const privacySectionsCms = privacy?.sections as
    | Array<Record<string, unknown>>
    | null
    | undefined;

  return {
    services: {
      ...banner(services),
      messageLabel:
        pickLocaleText(services, "messageLabel", currentLocale) ||
        siteCopy.servicesPage.message.label,
      messageHeadline:
        pickLocaleText(services, "messageHeadline", currentLocale) ||
        siteCopy.servicesPage.message.headline,
      messageBodyTitle:
        pickLocaleText(services, "messageBodyTitle", currentLocale) ||
        siteCopy.servicesPage.message.bodyTitle,
      messageParagraphs: (() => {
        const body = pickLocaleText(services, "messageBody", currentLocale);
        return body
          ? splitParagraphs(body)
          : [...siteCopy.servicesPage.message.paragraphs];
      })(),
      messageImageUrl:
        getMediaUrl(services?.messageImage) ||
        "/al-and images/5f32f6eefa193becbdd238d11fdd52aa.jpg",
      messageBottomImageUrl:
        getMediaUrl(
          services?.messageBottomImage,
        ) || "/al-and images/Modern Office Interior.png",
      industriesLabel:
        pickLocaleText(services, "industriesLabel", currentLocale) ||
        siteCopy.servicesPage.industries.label,
      industriesHeadline:
        pickLocaleText(services, "industriesHeadline", currentLocale) ||
        siteCopy.servicesPage.industries.headline,
      industriesCoreTitle:
        pickLocaleText(services, "industriesCoreTitle", currentLocale) ||
        siteCopy.servicesPage.industries.coreTitle,
      industriesButtonText:
        pickLocaleText(services, "industriesButtonText", currentLocale) ||
        (currentLocale === "ar" ? "اقرأ المزيد" : "Read more"),
      industriesButtonLink:
        normalizeCmsText(services?.industriesButtonLink) || "/request-quote",
      industriesImageUrl:
        getMediaUrl(
          services?.industriesImage,
        ) || "/al-and images/Urban Skyline Under Blue Sky.png",
      sectors,
    },
    jobs: {
      ...banner(jobs),
      messageLabel:
        pickLocaleText(jobs, "messageLabel", currentLocale) ||
        siteCopy.jobsPage.message.label,
      messageHeadline:
        pickLocaleText(jobs, "messageHeadline", currentLocale) ||
        siteCopy.jobsPage.message.headline,
      messageImageUrl:
        getMediaUrl(jobs?.messageImage) ||
        "/al-and images/Misty Urban Development.png",
      listingsEyebrow:
        pickLocaleText(jobs, "listingsEyebrow", currentLocale) ||
        siteCopy.jobsPage.listings.eyebrow,
      listingsTitle:
        pickLocaleText(jobs, "listingsTitle", currentLocale) ||
        siteCopy.jobsPage.listings.title,
    },
    blogs: {
      ...banner(blogs),
      sectionLabel:
        pickLocaleText(blogs, "sectionLabel", currentLocale) ||
        siteCopy.blogsPage.section.label,
      sectionTitle:
        pickLocaleText(blogs, "sectionTitle", currentLocale) ||
        siteCopy.blogsPage.section.title,
    },
    partners: {
      ...banner(partners),
      introLabel:
        pickLocaleText(partners, "introLabel", currentLocale) ||
        (currentLocale === "ar" ? "( الشبكة )" : "( Network )"),
      introHeadline:
        pickLocaleText(partners, "introHeadline", currentLocale) ||
        (currentLocale === "ar"
          ? "بناء الثقة في جميع أنحاء العراق"
          : "Building Trust Across Iraq"),
      introDescription:
        pickLocaleText(partners, "introDescription", currentLocale) ||
        (currentLocale === "ar"
          ? "تعمل شركة الأندلس للتأمين الدولي جنباً إلى جنب مع كبرى المصارف، الشركات، المؤسسات الحكومية، وشركات القطاع الخاص في العراق. تعكس هذه الشراكات سنوات من الاكتتاب الموثوق، والالتزام المستمر بتسوية المطالبات، والمساهمة الفاعلة في النمو الاقتصادي."
          : "Al-Andalus Insurance works alongside leading banks, corporations, government institutions, and private businesses across Iraq. These partnerships reflect years of reliable underwriting, consistent claim settlement, and shared commitment to economic growth."),
    },
    contact: {
      ...banner(contact),
      formLabel:
        pickLocaleText(contact, "formLabel", currentLocale) ||
        siteCopy.contactPage.form.label,
      formHeadline:
        pickLocaleText(contact, "formHeadline", currentLocale) ||
        siteCopy.contactPage.form.headline,
      formIntro:
        pickLocaleText(contact, "formIntro", currentLocale) ||
        siteCopy.contactPage.form.intro,
      visitLabel:
        pickLocaleText(contact, "visitLabel", currentLocale) ||
        siteCopy.requestQuotePage.contact.label,
      visitHeadline:
        pickLocaleText(contact, "visitHeadline", currentLocale) ||
        siteCopy.requestQuotePage.contact.headline,
      visitIntro:
        pickLocaleText(contact, "visitIntro", currentLocale) ||
        siteCopy.requestQuotePage.contact.intro,
    },
    requestQuote: {
      bannerTitle:
        pickLocaleText(requestQuote, "bannerTitle", currentLocale) ||
        siteCopy.requestQuotePage.banner.title,
      bannerSubtitle:
        pickLocaleText(requestQuote, "bannerSubtitle", currentLocale) ||
        siteCopy.requestQuotePage.banner.subtitle,
      formLabel:
        pickLocaleText(requestQuote, "formLabel", currentLocale) ||
        siteCopy.requestQuotePage.form.label,
      formHeadline:
        pickLocaleText(requestQuote, "formHeadline", currentLocale) ||
        siteCopy.requestQuotePage.form.headline,
      formIntro:
        pickLocaleText(requestQuote, "formIntro", currentLocale) ||
        siteCopy.requestQuotePage.form.intro,
      visitLabel:
        pickLocaleText(requestQuote, "visitLabel", currentLocale) ||
        siteCopy.requestQuotePage.contact.label,
      visitHeadline:
        pickLocaleText(requestQuote, "visitHeadline", currentLocale) ||
        siteCopy.requestQuotePage.contact.headline,
      visitIntro:
        pickLocaleText(requestQuote, "visitIntro", currentLocale) ||
        siteCopy.requestQuotePage.contact.intro,
    },
    application: {
      bannerTitle:
        pickLocaleText(application, "bannerTitle", currentLocale) ||
        (currentLocale === "ar" ? "تطبيق الأندلس" : "Al-Andalus App"),
      bannerSubtitle:
        pickLocaleText(application, "bannerSubtitle", currentLocale) ||
        (currentLocale === "ar"
          ? "التأمين في جيبك"
          : "Insurance in your pocket"),
      title:
        pickLocaleText(application, "title", currentLocale) ||
        (currentLocale === "ar"
          ? "تطبيق الأندلس للتأمين"
          : "Al-Andalus Insurance App"),
      paragraphs: (() => {
        const body = pickLocaleText(application, "description", currentLocale);
        if (body) return splitParagraphs(body);
        return currentLocale === "ar"
          ? [
              "أول منصة لتأمين السيارات في العراق. أصدر وثيقتك، تابع مطالباتك، وأدر تأمينك بالكامل من هاتفك — بأمان وراحة.",
              "حمّل التطبيق الآن وابدأ رحلتك التأمينية بكل سهولة.",
            ]
          : [
              "The first motor insurance platform in Iraq. Issue your policy, track your claims, and manage your entire insurance from your phone — safely and comfortably.",
              "Download the app now and start your insurance journey with ease.",
            ];
      })(),
      imageUrl:
        getMediaUrl(application?.appImage) ||
        "/al-and images/application.jpeg",
      downloads: (
        [
          ["downloadIos", currentLocale === "ar" ? "آب ستور" : "App Store"],
          ["downloadAndroid", currentLocale === "ar" ? "جوجل بلاي" : "Google Play"],
          ["downloadDirect", currentLocale === "ar" ? "آب غاليري" : "AppGallery"],
        ] as const
      ).map(([key, fallbackLabel]) => {
        const button = (application?.[key] ?? null) as Record<
          string,
          unknown
        > | null;
        return {
          label: pickLocaleText(button, "label", currentLocale) || fallbackLabel,
          url: normalizeCmsText(button?.url) || "",
        };
      }),
    },
    privacy: {
      bannerTitle:
        pickLocaleText(privacy, "bannerTitle", currentLocale) ||
        (currentLocale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"),
      bannerSubtitle:
        pickLocaleText(privacy, "bannerSubtitle", currentLocale) ||
        (currentLocale === "ar"
          ? "كيفية حماية بياناتك"
          : "How we protect your data"),
      sections: (privacySectionsCms ?? [])
        .map((section) => ({
          title: pickLocaleText(section, "title", currentLocale),
          paragraphs: splitParagraphs(
            pickLocaleText(section, "body", currentLocale),
          ),
          list: splitLines(pickLocaleText(section, "list", currentLocale)),
        }))
        // Skip half-filled rows so a blank CMS entry can't hide the
        // static bilingual fallback copy.
        .filter(
          (section) =>
            section.title &&
            (section.paragraphs.length > 0 || section.list.length > 0),
        ),
    },
  };
})

export const fetchContactCtaContent = cache(async function fetchContactCtaContent(
  payload?: Payload,
): Promise<ContactCtaContent> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const siteCopy = getSiteCopy(currentLocale);
  const siteSettings = await cms.findGlobal({ slug: "site-settings" });
  const contactCtaGroup = (siteSettings.contactCta ?? null) as Record<
    string,
    unknown
  > | null;
  const contactDescription = pickLocaleText(
    contactCtaGroup,
    "description",
    currentLocale,
  );

  return {
    headline:
      pickLocaleText(contactCtaGroup, "title", currentLocale) ||
      siteCopy.contact.headline,
    lines: contactDescription
      ? splitLines(contactDescription)
      : [...siteCopy.contact.lines],
    cta:
      pickLocaleText(contactCtaGroup, "buttonText", currentLocale) ||
      siteCopy.contact.cta,
    ctaLink: normalizeCmsText(contactCtaGroup?.buttonLink) || "/request-quote",
    backgroundImageUrl: getMediaUrl(
      contactCtaGroup?.backgroundImage,
    ),
  };
})

export const fetchAboutPageContent = cache(async function fetchAboutPageContent(payload?: Payload): Promise<AboutPageContent> {
  const cms = payload ?? (await getCMSPayload());
  const currentLocale = await getLocale();
  const siteCopy = getSiteCopy(currentLocale);
  const about = (await cms.findGlobal({
    slug: "about-page",
  })) as Record<string, unknown>;

  const fallback = siteCopy.aboutPage;
  const missionBody = pickLocaleText(about, "missionBody", currentLocale);
  const visionBody = pickLocaleText(about, "visionBody", currentLocale);

  const cmsLeaders = about.leadership as Array<Record<string, unknown>> | null;
  const leadership: readonly LeadershipEntry[] =
    cmsLeaders && cmsLeaders.length > 0
      ? cmsLeaders.map((cmsLeader, index) => {
          const fallbackLeader =
            index === 0 ? fallback.leadership.ceo : fallback.leadership.md;
          const bio = pickLocaleText(cmsLeader, "bio", currentLocale);
          return {
            messageTitle:
              pickLocaleText(cmsLeader, "messageTitle", currentLocale) ||
              fallbackLeader.title,
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
              cmsLeader.photo,
            ) || (index === 0
              ? "/al-and images/ChatGPT Image Jul 9, 2026, 05_09_09 PM.png"
              : "/al-and images/ChatGPT Image Jul 15, 2026, 10_41_41 PM.png"),
          };
        })
      : [
          {
            messageTitle: fallback.leadership.ceo.title,
            name: fallback.leadership.ceo.signoff,
            role: fallback.leadership.ceo.role,
            bioParagraphs: fallback.leadership.ceo.paragraphs,
            photoUrl:
              "/al-and images/ChatGPT Image Jul 9, 2026, 05_09_09 PM.png",
          },
          {
            messageTitle: fallback.leadership.md.title,
            name: fallback.leadership.md.signoff,
            role: fallback.leadership.md.role,
            bioParagraphs: fallback.leadership.md.paragraphs,
            photoUrl:
              "/al-and images/ChatGPT Image Jul 15, 2026, 10_41_41 PM.png",
          },
        ];

  const pillarIds = ["licensed", "capital", "branches", "services"];
  const whyPillars = pillarIds.map((id, index) => {
    const group = (about[`whyPillar${index + 1}`] ?? null) as Record<
      string,
      unknown
    > | null;
    const staticPillar = siteCopy.whyChoosePillars[index];
    const staticCircle =
      siteCopy.whyChooseSection.circleLabels[
        id as keyof typeof siteCopy.whyChooseSection.circleLabels
      ];
    return {
      id,
      circleLabel:
        pickLocaleText(group, "circleLabel", currentLocale) || staticCircle,
      title: pickLocaleText(group, "title", currentLocale) || staticPillar.title,
      items: splitLines(
        pickLocaleText(group, "items", currentLocale) ||
          staticPillar.items.join("\n"),
      ),
    };
  });

  const companyRows = fallback.companySnapshot.map((staticRow, index) => {
    const group = (about[`companyRow${index + 1}`] ?? null) as Record<
      string,
      unknown
    > | null;
    return {
      label: pickLocaleText(group, "label", currentLocale) || staticRow.label,
      value: pickLocaleText(group, "value", currentLocale) || staticRow.value,
    };
  });

  const boardMembers = fallback.boardMembers.map((staticMember, index) => {
    const group = (about[`boardMember${index + 1}`] ?? null) as Record<
      string,
      unknown
    > | null;
    return {
      role: pickLocaleText(group, "role", currentLocale) || staticMember.role,
      name: pickLocaleText(group, "name", currentLocale) || staticMember.name,
    };
  });

  return {
    bannerTitle:
      pickLocaleText(about, "heroTitle", currentLocale) ||
      fallback.banner.title,
    bannerSubtitle:
      pickLocaleText(about, "heroSubtitle", currentLocale) ||
      fallback.banner.subtitle,
    heroImageUrl: getMediaUrl(
      about.heroImage,
    ),
    missionLabel:
      pickLocaleText(about, "missionLabel", currentLocale) ||
      fallback.mission.label,
    missionHeadline:
      pickLocaleText(about, "missionHeadline", currentLocale) ||
      fallback.mission.headline,
    missionSubline:
      pickLocaleText(about, "missionSubline", currentLocale) ||
      fallback.mission.subline,
    missionBodyTitle:
      pickLocaleText(about, "missionBodyTitle", currentLocale) ||
      fallback.mission.bodyTitle,
    missionImageUrl: getMediaUrl(
      about.missionImage,
    ) || "/al-and images/Misty Urban Development.png",
    missionAccentImage: getMediaUrl(
      about.missionAccentImage,
    ) || "/al-and images/ChatGPT Image Jul 15, 2026, 09_57_27 PM.png",
    missionParagraphs: missionBody
      ? splitParagraphs(missionBody)
      : [...fallback.mission.paragraphs],
    vision: {
      label:
        pickLocaleText(about, "visionLabel", currentLocale) ||
        fallback.vision.label,
      headline:
        pickLocaleText(about, "visionHeadline", currentLocale) ||
        fallback.vision.headline,
      paragraphs: visionBody
        ? splitParagraphs(visionBody)
        : [...fallback.vision.paragraphs],
      imageUrl:
        getMediaUrl(about.visionImage) ||
        "/al-and images/empty-conference-room-with-city-view-2026-01-09-10-22-57-utc.jpg",
      accentImageUrl:
        getMediaUrl(
          about.visionAccentImage,
        ) || "/al-and images/8aa6ff11-0f2d-4242-8d20-2ffab6670122.png",
    },
    whyChoose: {
      label:
        pickLocaleText(about, "whyLabel", currentLocale) ||
        siteCopy.whyChooseSection.label,
      headline:
        pickLocaleText(about, "whyHeadline", currentLocale) ||
        siteCopy.whyChooseSection.headline,
      pillars: whyPillars,
    },
    leadershipLabel:
      pickLocaleText(about, "leadershipLabel", currentLocale) ||
      fallback.leadership.label,
    leadership,
    companyTitle:
      pickLocaleText(about, "companyTitle", currentLocale) ||
      (currentLocale === "ar" ? "( الشركة )" : "( COMPANY )"),
    companyRows,
    boardLabel:
      pickLocaleText(about, "boardLabel", currentLocale) ||
      (currentLocale === "ar" ? "أعضاء مجلس الإدارة" : "Board member"),
    boardMembers,
  };
})

export const fetchSiteSettings = cache(async function fetchSiteSettings(payload?: Payload): Promise<SiteSettingsContent> {
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

  const mappedBranches = settings.branches
    ?.map((b: any) => ({
      id: b.branchId,
      label: useArabic ? b.labelAr || b.labelEn : b.labelEn || b.labelAr,
      area: useArabic ? b.areaAr || b.areaEn : b.areaEn || b.areaAr,
      mapEmbedUrl: b.mapEmbedUrl,
      mapLinkUrl: b.mapLinkUrl,
    }))
    // Incomplete rows (no label or no map) fall back to static branches.
    .filter((b: { label?: string; mapEmbedUrl?: string }) => b.label && b.mapEmbedUrl);
  const branches = mappedBranches?.length ? mappedBranches : undefined;

  return {
    companyName,
    phone: settings.contact?.phone ?? "+9647710006000",
    shortNumber: settings.contact?.shortNumber ?? "7366",
    email: settings.contact?.email ?? "info@alandalus-iq.com",
    whatsapp: settings.contact?.whatsapp ?? "+9647710006000",
    socialLinks,
    branches,
    siteLogo: getMediaUrl(settings.siteLogo) || IMAGE_FALLBACKS.siteLogo,
  };
})

export const fetchFeaturedProducts = cache(async function fetchFeaturedProducts(payload?: Payload): Promise<Service[]> {
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
})

export const fetchFaqs = cache(async function fetchFaqs(payload?: Payload): Promise<FaqItem[]> {
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
})

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

export const fetchAllProducts = cache(async function fetchAllProducts(payload?: Payload): Promise<Service[]> {
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
})

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

export const fetchPublishedNews = cache(async function fetchPublishedNews(
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
      imageUrl: getMediaUrl(item.coverImage),
    };
  });
})

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

export const fetchPartners = cache(async function fetchPartners(
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
})

export const fetchOpenJobs = cache(async function fetchOpenJobs(
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
      slug: slugify(job.title),
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
})

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

export const fetchQuoteProducts = cache(async function fetchQuoteProducts(
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
})
