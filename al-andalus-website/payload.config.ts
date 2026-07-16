import path from "path";
import { buildConfig, type WidgetWidth } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { fileURLToPath } from "url";

// Collections
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Products } from "./collections/Products";
import { News } from "./collections/News";
import { BlogCategories } from "./collections/BlogCategories";
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

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
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
    Products,
    InsuranceRequests,
    News,
    BlogCategories,
    Partners,
    FAQs,
    Jobs,
    JobApplications,
    ContactMessages,
    Proposals,
  ],

  globals: [SiteSettings, Homepage, AboutPage],

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

  editor: lexicalEditor(),

  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./database.db",
      authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
    },
    // Avoid silent schema push in production unless explicitly enabled.
    push:
      process.env.PAYLOAD_DATABASE_PUSH === "true" ||
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
