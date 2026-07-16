import { GlobalConfig } from "payload";

import { bilingualLabel } from "../lib/cms/labels";

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

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  admin: {
    description: {
      en: "About page content. Enter English and Arabic in the language tabs below.",
      ar: "محتوى صفحة من نحن. أدخل الإنجليزية والعربية من تبويبات اللغة أدناه.",
    },
    group: {
      en: "Website",
      ar: "الموقع",
    },
  },
  fields: [
    languageTabs(
      [
        {
          name: "heroTitleEn",
          type: "text",
          label: bilingualLabel("Page Title (English)", "عنوان الصفحة (إنجليزي)"),
        },
        {
          name: "introEn",
          type: "richText",
          label: bilingualLabel("Introduction (English)", "المقدمة (إنجليزي)"),
        },
        {
          name: "missionEn",
          type: "richText",
          label: bilingualLabel("Mission (English)", "الرسالة (إنجليزي)"),
        },
        {
          name: "visionEn",
          type: "richText",
          label: bilingualLabel("Vision (English)", "الرؤية (إنجليزي)"),
        },
        {
          name: "historyEn",
          type: "richText",
          label: bilingualLabel("Company History (English)", "تاريخ الشركة (إنجليزي)"),
        },
      ],
      [
        {
          name: "heroTitleAr",
          type: "text",
          label: bilingualLabel("Page Title (Arabic)", "عنوان الصفحة (عربي)"),
        },
        {
          name: "introAr",
          type: "richText",
          label: bilingualLabel("Introduction (Arabic)", "المقدمة (عربي)"),
        },
        {
          name: "missionAr",
          type: "richText",
          label: bilingualLabel("Mission (Arabic)", "الرسالة (عربي)"),
        },
        {
          name: "visionAr",
          type: "richText",
          label: bilingualLabel("Vision (Arabic)", "الرؤية (عربي)"),
        },
        {
          name: "historyAr",
          type: "richText",
          label: bilingualLabel("Company History (Arabic)", "تاريخ الشركة (عربي)"),
        },
      ],
    ),
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      label: {
        en: "Hero Image",
        ar: "صورة البانر",
      },
    },
    {
      name: "values",
      type: "array",
      label: {
        en: "Core Values",
        ar: "القيم الأساسية",
      },
      fields: [
        languageTabs(
          [
            {
              name: "titleEn",
              type: "text",
              label: bilingualLabel("Value Title (English)", "عنوان القيمة (إنجليزي)"),
            },
            {
              name: "descriptionEn",
              type: "textarea",
              label: bilingualLabel("Description (English)", "الوصف (إنجليزي)"),
            },
          ],
          [
            {
              name: "titleAr",
              type: "text",
              label: bilingualLabel("Value Title (Arabic)", "عنوان القيمة (عربي)"),
            },
            {
              name: "descriptionAr",
              type: "textarea",
              label: bilingualLabel("Description (Arabic)", "الوصف (عربي)"),
            },
          ],
        ),
      ],
    },
    {
      name: "leadership",
      type: "array",
      label: {
        en: "Leadership Team",
        ar: "فريق القيادة",
      },
      fields: [
        languageTabs(
          [
            {
              name: "nameEn",
              type: "text",
              required: true,
              label: bilingualLabel("Name (English)", "الاسم (إنجليزي)"),
            },
            {
              name: "roleEn",
              type: "text",
              label: bilingualLabel("Role (English)", "المنصب (إنجليزي)"),
            },
            {
              name: "bioEn",
              type: "textarea",
              label: bilingualLabel("Bio (English)", "نبذة (إنجليزي)"),
            },
          ],
          [
            {
              name: "nameAr",
              type: "text",
              required: true,
              label: bilingualLabel("Name (Arabic)", "الاسم (عربي)"),
            },
            {
              name: "roleAr",
              type: "text",
              label: bilingualLabel("Role (Arabic)", "المنصب (عربي)"),
            },
            {
              name: "bioAr",
              type: "textarea",
              label: bilingualLabel("Bio (Arabic)", "نبذة (عربي)"),
            },
          ],
        ),
        {
          name: "photo",
          type: "upload",
          relationTo: "media",
          label: { en: "Photo", ar: "الصورة" },
        },
      ],
    },
  ],
};
