import path from "path";
import { buildConfig, type WidgetWidth } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { ar } from "@payloadcms/translations/languages/ar";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { resolveSqliteDatabaseUri } from "./lib/sqliteDatabaseUri";

// Collections
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Documents } from "./collections/Documents";
import { Products } from "./collections/Products";
import { News } from "./collections/News";
import { NewsCategories } from "./collections/NewsCategories";
import { Partners } from "./collections/Partners";
import {
  ensureDefaultNewsCategories,
  remapLegacyNewsCategories,
} from "./lib/cms/ensureNewsCategories";
import { FAQs } from "./collections/FAQs";
import { ContactMessages } from "./collections/ContactMessages";
import { InsuranceRequests } from "./collections/InsuranceRequests";
import { Jobs } from "./collections/Jobs";
import { JobApplications } from "./collections/JobApplications";
import { Proposals } from "./collections/Proposals";

// Globals
import { SiteSettings } from "./globals/SiteSettings";
import { Homepage } from "./globals/Homepage";
import { AboutPage } from "./globals/AboutPage";
import { Pages } from "./globals/Pages";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const smtpHost = process.env.SMTP_HOST;
const smtpFromAddress =
  process.env.SMTP_FROM_ADDRESS || "website@alandalus-iq.com";
const smtpFromName = process.env.SMTP_FROM_NAME || "Al-Andalus Insurance";

// Public origin of the deployed site (e.g. https://alandalus-iq.com).
// Used for CSRF/CORS whitelisting of the admin panel and REST API.
// Include both apex and www — both currently resolve on Hostinger, and
// admin mutations fail with a generic "unknown error" if Origin is missing
// from csrf.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const siteOrigins = siteUrl
  ? Array.from(
      new Set([
        siteUrl,
        siteUrl.replace("://www.", "://"),
        siteUrl.includes("://www.")
          ? siteUrl
          : siteUrl.replace("://", "://www."),
      ]),
    )
  : [];

export default buildConfig({
  ...(siteUrl
    ? {
        serverURL: siteUrl,
        cors: siteOrigins,
        csrf: siteOrigins,
      }
    : {}),
  admin: {
    user: Users.slug,
    theme: "light",
    meta: {
      titleSuffix: " | Al-Andalus Insurance",
      icons: [{ url: "/favicon.ico" }],
    },
    dashboard: {
      defaultLayout: ({ req }) => {
        type UserWithRole = { role?: "admin" | "editor" };
        const isAdmin = (req.user as UserWithRole | null)?.role === "admin";

        const layout: Array<{ widgetSlug: string; width: WidgetWidth }> = [
          { widgetSlug: "welcome", width: "full" },
          { widgetSlug: "stats", width: "full" },
          { widgetSlug: "recent-requests", width: "large" },
        ];

        if (isAdmin) {
          layout.push({ widgetSlug: "recent-messages", width: "medium" });
        }

        layout.push({ widgetSlug: "collections", width: "full" });

        return layout;
      },
      widgets: [
        {
          slug: "welcome",
          label: {
            en: "Welcome",
            ar: "مرحباً",
          },
          Component: "./components/dashboard/WelcomeWidget.tsx#default",
          minWidth: "medium",
          maxWidth: "full",
        },
        {
          slug: "stats",
          label: {
            en: "Quick Statistics",
            ar: "إحصائيات سريعة",
          },
          Component: "./components/dashboard/StatsWidget.tsx#default",
          minWidth: "medium",
          maxWidth: "full",
        },
        {
          slug: "recent-requests",
          label: {
            en: "Recent Requests",
            ar: "الطلبات الأخيرة",
          },
          Component: "./components/dashboard/RecentRequestsWidget.tsx#default",
          minWidth: "medium",
          maxWidth: "large",
        },
        {
          slug: "recent-messages",
          label: {
            en: "Contact Messages",
            ar: "رسائل التواصل",
          },
          Component: "./components/dashboard/RecentMessagesWidget.tsx#default",
          minWidth: "medium",
          maxWidth: "medium",
        },
      ],
    },
  },

  collections: [
    Users,
    Media,
    Documents,
    Products,
    InsuranceRequests,
    NewsCategories,
    News,
    Partners,
    FAQs,
    Jobs,
    JobApplications,
    ContactMessages,
    Proposals,
  ],

  onInit: async (payload) => {
    try {
      const bySlug = await ensureDefaultNewsCategories(payload);
      const remapped = await remapLegacyNewsCategories(payload, bySlug);
      if (remapped > 0) {
        payload.logger.info(
          `[news-categories] Remapped ${remapped} article(s) from legacy category slugs.`,
        );
      }
    } catch (error) {
      payload.logger.error(
        `[news-categories] Failed to seed/remap categories: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  },

  globals: [SiteSettings, Homepage, AboutPage, Pages],

  localization: {
    locales: [
      {
        label: {
          en: "Arabic",
          ar: "العربية",
        },
        code: "ar",
        rtl: true,
      },
      {
        label: {
          en: "English",
          ar: "الإنجليزية",
        },
        code: "en",
      },
    ],
    defaultLocale: "ar",
    fallback: true,
  },

  i18n: {
    supportedLanguages: { en, ar },
    fallbackLanguage: "en",
  },

  editor: lexicalEditor(),

  ...(smtpHost
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: smtpFromAddress,
          defaultFromName: smtpFromName,
          skipVerify: process.env.SMTP_SKIP_VERIFY !== "false",
          transportOptions: {
            host: smtpHost,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === "true",
            auth:
              process.env.SMTP_USER && process.env.SMTP_PASS
                ? {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                  }
                : undefined,
          },
        }),
      }
    : {}),

  db: sqliteAdapter({
    client: {
      url: (() => {
        const raw = process.env.DATABASE_URI;
        const url = resolveSqliteDatabaseUri(raw);
        if (!raw?.trim()) {
          console.warn(
            `[payload] DATABASE_URI is unset at runtime — using ${url}. ` +
              "On Hostinger, create nodejs/.env with the absolute file path if panel env vars are not injected.",
          );
        } else {
          console.info(`[payload] SQLite DATABASE_URI → ${url}`);
        }
        return url;
      })(),
      authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
    },
    // Schema push is opt-in only. Auto-push in `next dev` repeatedly fails on
    // SQLite with "index already exists" when Drizzle's snapshot is out of sync.
    // Set PAYLOAD_DATABASE_PUSH=true only when you intentionally need a schema update.
    push: process.env.PAYLOAD_DATABASE_PUSH === "true",
  }),

  secret: (() => {
    const secret = process.env.PAYLOAD_SECRET;
    const isMissing =
      !secret ||
      secret === "default-secret-change-me" ||
      secret === "change-me-to-a-long-random-string" ||
      secret === "change-me-to-a-long-random-string-at-least-32";

    if (isMissing) {
      if (process.env.NODE_ENV === "production") {
        throw new Error(
          "PAYLOAD_SECRET must be set to a strong random string in production.",
        );
      }
      console.warn(
        "[payload] PAYLOAD_SECRET is missing or still a placeholder — set a strong secret before production.",
      );
      return "default-secret-change-me-dev-only";
    }

    if (secret.length < 32) {
      console.warn(
        "[payload] PAYLOAD_SECRET should be at least 32 characters.",
      );
    }

    return secret;
  })(),

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
