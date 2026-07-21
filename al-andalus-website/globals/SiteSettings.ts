import { GlobalConfig } from "payload";

import { bilingualLabel, mediaFieldHint } from "../lib/cms/labels";

const languageTabs = (
  englishFields: GlobalConfig["fields"],
  arabicFields: GlobalConfig["fields"],
) => ({
  type: "tabs" as const,
  tabs: [
    {
      label: { en: "English", ar: "الإنجليزية" },
      fields: englishFields,
    },
    {
      label: { en: "Arabic", ar: "العربية" },
      fields: arabicFields,
    },
  ],
});

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    description: {
      en: "General site settings. Enter English and Arabic content in the tabs below.",
      ar: "إعدادات الموقع العامة. أدخل المحتوى بالإنجليزية والعربية من التبويبات أدناه.",
    },
    group: {
      en: "Website",
      ar: "الموقع",
    },
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: {
            en: "English",
            ar: "الإنجليزية",
          },
          fields: [
            {
              name: "heroTextEn",
              type: "text",
              label: bilingualLabel("Hero Headline (English)", "عنوان البانر (إنجليزي)"),
              admin: {
        description: {
          en: "Shown as the main homepage hero headline in English.",
          ar: "يظهر كعنوان البانر الرئيسي بالإنجليزية.",
        },
      },
    },
    {
      name: "heroSubtextEn",
      type: "textarea",
      label: bilingualLabel("Hero Subtext (English)", "النص الفرعي (إنجليزي)"),
    },
          ],
        },
        {
          label: {
            en: "Arabic",
            ar: "العربية",
          },
          fields: [
            {
              name: "heroTextAr",
              type: "text",
              label: bilingualLabel("Hero Headline (Arabic)", "عنوان البانر (عربي)"),
              admin: {
                description: {
                  en: "Shown as the main homepage hero headline in Arabic.",
                  ar: "يظهر كعنوان البانر الرئيسي بالعربية.",
                },
              },
            },
            {
              name: "heroSubtextAr",
              type: "textarea",
              label: bilingualLabel("Hero Subtext (Arabic)", "النص الفرعي (عربي)"),
            },
          ],
        },
      ],
    },
    {
      name: "heroVideo",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "video" } },
      label: {
        en: "Hero Background Video",
        ar: "فيديو خلفية البانر",
      },
      admin: {
        description: mediaFieldHint(
          "the full-screen video background of the homepage hero",
          "خلفية الفيديو بملء الشاشة لبانر الصفحة الرئيسية",
          "MP4, 16:9, 1920×1080, compressed for web",
          "MP4 بنسبة 16:9 ودقة 1920×1080 ومضغوط للويب",
        ),
      },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
      label: {
        en: "Hero Fallback Image",
        ar: "صورة بديلة للبانر",
      },
      admin: {
        description: mediaFieldHint(
          "the homepage hero when no video is selected",
          "بانر الصفحة الرئيسية عند عدم اختيار فيديو",
          "JPG/WebP, 16:9, 1920×1080",
          "JPG/WebP بنسبة 16:9 ودقة 1920×1080",
        ),
      },
    },
    {
      name: "siteLogo",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
      label: {
        en: "Site Logo",
        ar: "شعار الموقع",
      },
      admin: {
        description: mediaFieldHint(
          "the logo in every page header and footer",
          "الشعار في ترويسة وتذييل جميع الصفحات",
          "transparent PNG or SVG with generous padding",
          "PNG شفاف أو SVG مع مساحة مناسبة حول الشعار",
        ),
      },
    },
    {
      type: "group",
      name: "contact",
      label: {
        en: "Contact Information",
        ar: "معلومات التواصل",
      },
      fields: [
        {
          name: "shortNumber",
          type: "text",
          defaultValue: "7366",
          label: {
            en: "Short Number",
            ar: "الرقم المختصر",
          },
        },
        {
          name: "phone",
          type: "text",
          defaultValue: "+9647710006000",
          label: {
            en: "Phone Number",
            ar: "رقم الهاتف",
          },
        },
        {
          name: "whatsapp",
          type: "text",
          defaultValue: "+9647710006000",
          label: {
            en: "WhatsApp Number",
            ar: "رقم الواتساب",
          },
        },
        {
          name: "email",
          type: "email",
          defaultValue: "info@alandalus-iq.com",
          label: {
            en: "Email",
            ar: "البريد الإلكتروني",
          },
        },
      ],
    },
    {
      type: "group",
      name: "contactCta",
      label: {
        en: "Contact Us Section",
        ar: "قسم اتصل بنا",
      },
      fields: [
        languageTabs(
          [
            {
              name: "titleEn",
              type: "text",
              label: bilingualLabel("Title (English)", "العنوان (إنجليزي)"),
            },
            {
              name: "descriptionEn",
              type: "textarea",
              label: bilingualLabel("Description (English)", "الوصف (إنجليزي)"),
            },
            {
              name: "buttonTextEn",
              type: "text",
              label: bilingualLabel("Button Text (English)", "نص الزر (إنجليزي)"),
            },
          ],
          [
            {
              name: "titleAr",
              type: "text",
              label: bilingualLabel("Title (Arabic)", "العنوان (عربي)"),
            },
            {
              name: "descriptionAr",
              type: "textarea",
              label: bilingualLabel("Description (Arabic)", "الوصف (عربي)"),
            },
            {
              name: "buttonTextAr",
              type: "text",
              label: bilingualLabel("Button Text (Arabic)", "نص الزر (عربي)"),
            },
          ],
        ),
        {
          name: "buttonLink",
          type: "text",
          label: { en: "Button Link", ar: "رابط الزر" },
        },
        {
          name: "backgroundImage",
          type: "upload",
          relationTo: "media",
          filterOptions: { mimeType: { contains: "image" } },
          label: { en: "Background Image", ar: "صورة الخلفية" },
          admin: {
            description: mediaFieldHint(
              "the expanding Contact Us background shown across the website",
              "خلفية قسم اتصل بنا المتوسعة في صفحات الموقع",
              "wide landscape image, 1920×1080",
              "صورة أفقية عريضة 1920×1080",
            ),
          },
        },
      ],
    },
    {
      type: "group",
      name: "socialLinks",
      label: {
        en: "Social Media Links",
        ar: "روابط التواصل الاجتماعي",
      },
      fields: [
        {
          name: "facebook",
          type: "text",
          label: "Facebook",
        },
        {
          name: "instagram",
          type: "text",
          label: "Instagram",
        },
        {
          name: "linkedin",
          type: "text",
          label: "LinkedIn",
        },
        {
          name: "tiktok",
          type: "text",
          label: "TikTok",
        },
        {
          name: "whatsappLink",
          type: "text",
          label: "WhatsApp Link",
        },
      ],
    },
    {
      name: "branches",
      type: "array",
      label: {
        en: "Office Branches",
        ar: "فروع الشركة",
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "branchId",
          type: "text",
          required: true,
          label: bilingualLabel("Branch Key/ID", "معرف الفرع"),
          admin: {
            description: {
              en: "Unique identifier (e.g. 'baghdad', 'basrah', 'erbil')",
              ar: "معرف فريد (مثال: 'baghdad', 'basrah', 'erbil')",
            },
          },
        },
        {
          name: "labelEn",
          type: "text",
          required: true,
          label: bilingualLabel("Branch Name (English)", "اسم الفرع (إنجليزي)"),
        },
        {
          name: "labelAr",
          type: "text",
          required: true,
          label: bilingualLabel("Branch Name (Arabic)", "اسم الفرع (عربي)"),
        },
        {
          name: "areaEn",
          type: "text",
          required: true,
          label: bilingualLabel("Address (English)", "العنوان (إنجليزي)"),
        },
        {
          name: "areaAr",
          type: "text",
          required: true,
          label: bilingualLabel("Address (Arabic)", "العنوان (عربي)"),
        },
        {
          name: "mapEmbedUrl",
          type: "text",
          required: true,
          label: bilingualLabel("Map Embed URL", "رابط خريطة التضمين"),
          admin: {
            description: {
              en: "The iframe source URL from Google Maps (src attribute only)",
              ar: "رابط مصدر iframe من خرائط جوجل (سمة src فقط)",
            },
          },
        },
        {
          name: "mapLinkUrl",
          type: "text",
          required: true,
          label: bilingualLabel("Map Search/Directions Link", "رابط الاتجاهات/البحث في الخريطة"),
        },
      ],
    },
  ],
};
