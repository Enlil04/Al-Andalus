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

export const Homepage: GlobalConfig = {
  slug: "homepage",
  admin: {
    description: {
      en: "Homepage content. Enter English and Arabic in the language tabs inside each section.",
      ar: "محتوى الصفحة الرئيسية. أدخل الإنجليزية والعربية من تبويبات اللغة داخل كل قسم.",
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
          label: { en: "Hero Slider", ar: "البانر الرئيسي" },
          fields: [
            {
              name: "heroSlides",
              type: "array",
              label: {
                en: "Hero Slides",
                ar: "شرائح البانر",
              },
              fields: [
                languageTabs(
                  [
                    {
                      name: "headlineEn",
                      type: "text",
                      label: bilingualLabel("Headline (English)", "العنوان (إنجليزي)"),
                    },
                    {
                      name: "subheadlineEn",
                      type: "textarea",
                      label: bilingualLabel("Subheadline (English)", "العنوان الفرعي (إنجليزي)"),
                    },
                    {
                      name: "ctaTextEn",
                      type: "text",
                      label: bilingualLabel("Button Text (English)", "نص الزر (إنجليزي)"),
                    },
                  ],
                  [
                    {
                      name: "headlineAr",
                      type: "text",
                      label: bilingualLabel("Headline (Arabic)", "العنوان (عربي)"),
                    },
                    {
                      name: "subheadlineAr",
                      type: "textarea",
                      label: bilingualLabel("Subheadline (Arabic)", "العنوان الفرعي (عربي)"),
                    },
                    {
                      name: "ctaTextAr",
                      type: "text",
                      label: bilingualLabel("Button Text (Arabic)", "نص الزر (عربي)"),
                    },
                  ],
                ),
                {
                  name: "video",
                  type: "upload",
                  relationTo: "media",
                  label: { en: "Background Video", ar: "فيديو الخلفية" },
                },
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  label: { en: "Fallback Image", ar: "صورة بديلة" },
                },
                {
                  name: "ctaLink",
                  type: "text",
                  label: { en: "Button Link", ar: "رابط الزر" },
                },
              ],
            },
          ],
        },
        {
          label: { en: "Introduction", ar: "المقدمة" },
          fields: [
            {
              type: "group",
              name: "intro",
              fields: [
                languageTabs(
                  [
                    {
                      name: "titleLine1En",
                      type: "text",
                      label: bilingualLabel("Title Line 1 (English)", "السطر الأول (إنجليزي)"),
                    },
                    {
                      name: "titleLine2En",
                      type: "text",
                      label: bilingualLabel("Title Line 2 (English)", "السطر الثاني (إنجليزي)"),
                    },
                    {
                      name: "titleLine3En",
                      type: "text",
                      label: bilingualLabel("Title Line 3 (English)", "السطر الثالث (إنجليزي)"),
                    },
                    {
                      name: "leadEn",
                      type: "textarea",
                      label: bilingualLabel("Lead Text (English)", "النص التمهيدي (إنجليزي)"),
                    },
                  ],
                  [
                    {
                      name: "titleLine1Ar",
                      type: "text",
                      label: bilingualLabel("Title Line 1 (Arabic)", "السطر الأول (عربي)"),
                    },
                    {
                      name: "titleLine2Ar",
                      type: "text",
                      label: bilingualLabel("Title Line 2 (Arabic)", "السطر الثاني (عربي)"),
                    },
                    {
                      name: "titleLine3Ar",
                      type: "text",
                      label: bilingualLabel("Title Line 3 (Arabic)", "السطر الثالث (عربي)"),
                    },
                    {
                      name: "leadAr",
                      type: "textarea",
                      label: bilingualLabel("Lead Text (Arabic)", "النص التمهيدي (عربي)"),
                    },
                  ],
                ),
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  label: { en: "Section Image", ar: "صورة القسم" },
                },
              ],
            },
          ],
        },
        {
          label: { en: "Story & About", ar: "القصة ومن نحن" },
          fields: [
            {
              type: "group",
              name: "story",
              label: { en: "Story Section", ar: "قسم القصة" },
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
                      name: "ctaTextEn",
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
                      name: "ctaTextAr",
                      type: "text",
                      label: bilingualLabel("Button Text (Arabic)", "نص الزر (عربي)"),
                    },
                  ],
                ),
                {
                  name: "ctaLink",
                  type: "text",
                  label: { en: "Button Link", ar: "رابط الزر" },
                },
              ],
            },
            {
              type: "group",
              name: "aboutPreview",
              label: { en: "About Preview", ar: "معاينة من نحن" },
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
                      name: "ctaTextEn",
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
                      name: "ctaTextAr",
                      type: "text",
                      label: bilingualLabel("Button Text (Arabic)", "نص الزر (عربي)"),
                    },
                  ],
                ),
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  label: { en: "Image", ar: "الصورة" },
                },
                {
                  name: "ctaLink",
                  type: "text",
                  label: { en: "Button Link", ar: "رابط الزر" },
                },
              ],
            },
          ],
        },
        {
          label: { en: "Sections & CTAs", ar: "الأقسام والأزرار" },
          fields: [
            {
              type: "group",
              name: "recruit",
              label: { en: "Careers Section", ar: "قسم الوظائف" },
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
                      name: "ctaTextEn",
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
                      name: "ctaTextAr",
                      type: "text",
                      label: bilingualLabel("Button Text (Arabic)", "نص الزر (عربي)"),
                    },
                  ],
                ),
                {
                  name: "ctaLink",
                  type: "text",
                  label: { en: "Button Link", ar: "رابط الزر" },
                },
              ],
            },
            {
              type: "group",
              name: "contactCta",
              label: { en: "Contact CTA", ar: "دعوة التواصل" },
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
              ],
            },
          ],
        },
      ],
    },
  ],
};
