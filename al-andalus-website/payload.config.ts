import path from "path";
import { buildConfig, type WidgetWidth } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { ar } from "@payloadcms/translations/languages/ar";
import sharp from "sharp";
import { fileURLToPath } from "url";

// Collections
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Documents } from "./collections/Documents";
import { Products } from "./collections/Products";
import { News } from "./collections/News";
import { Partners } from "./collections/Partners";
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
  process.env.SMTP_FROM_ADDRESS || "info@alandalus-iq.com";
const smtpFromName = process.env.SMTP_FROM_NAME || "Al-Andalus Insurance";

// Public origin of the deployed site (e.g. https://alandalus-iq.com).
// Used for CSRF/CORS whitelisting of the admin panel and REST API.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export default buildConfig({
  ...(siteUrl
    ? {
        serverURL: siteUrl,
        cors: [siteUrl],
        csrf: [siteUrl],
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
    News,
    Partners,
    FAQs,
    Jobs,
    JobApplications,
    ContactMessages,
    Proposals,
  ],

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
      url: process.env.DATABASE_URI || "file:./database.db",
      authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
    },
    // Avoid silent schema push in production unless explicitly enabled.
    // Set PAYLOAD_DATABASE_PUSH=false to skip push when the DB schema is already current.
    push:
      process.env.PAYLOAD_DATABASE_PUSH === "false"
        ? false
        : process.env.PAYLOAD_DATABASE_PUSH === "true" ||
          process.env.NODE_ENV !== "production",
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
