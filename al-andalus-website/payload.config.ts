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
    },
  }),

  secret: process.env.PAYLOAD_SECRET || "default-secret-change-me",

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
