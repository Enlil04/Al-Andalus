import { GlobalConfig } from "payload";

import { bilingualLabel } from "../lib/cms/labels";

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
              name: "companyNameEn",
              type: "text",
              required: true,
              defaultValue: "Al-Andalus International Insurance",
              label: bilingualLabel("Company Name (English)", "اسم الشركة (إنجليزي)"),
            },
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
              name: "companyNameAr",
              type: "text",
              required: true,
              defaultValue: "شركة الأندلس للتأمين الدولي",
              label: bilingualLabel("Company Name (Arabic)", "اسم الشركة (عربي)"),
            },
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
      label: {
        en: "Hero Background Video",
        ar: "فيديو خلفية البانر",
      },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      label: {
        en: "Hero Fallback Image",
        ar: "صورة بديلة للبانر",
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
  ],
};
