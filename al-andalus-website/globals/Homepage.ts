import { GlobalConfig } from "payload";

export const Homepage: GlobalConfig = {
  slug: "homepage",
  admin: {
    description: "محتوى الصفحة الرئيسية (Homepage Content)",
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
                {
                  name: "headline",
                  type: "text",
                  localized: true,
                  label: { en: "Headline", ar: "العنوان" },
                },
                {
                  name: "subheadline",
                  type: "textarea",
                  localized: true,
                  label: { en: "Subheadline", ar: "العنوان الفرعي" },
                },
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
                  name: "ctaText",
                  type: "text",
                  localized: true,
                  label: { en: "Button Text", ar: "نص الزر" },
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
                {
                  name: "titleLine1",
                  type: "text",
                  localized: true,
                  label: { en: "Title Line 1", ar: "السطر الأول" },
                },
                {
                  name: "titleLine2",
                  type: "text",
                  localized: true,
                  label: { en: "Title Line 2", ar: "السطر الثاني" },
                },
                {
                  name: "titleLine3",
                  type: "text",
                  localized: true,
                  label: { en: "Title Line 3", ar: "السطر الثالث" },
                },
                {
                  name: "lead",
                  type: "textarea",
                  localized: true,
                  label: { en: "Lead Text", ar: "النص التمهيدي" },
                },
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
                {
                  name: "title",
                  type: "text",
                  localized: true,
                  label: { en: "Title", ar: "العنوان" },
                },
                {
                  name: "description",
                  type: "textarea",
                  localized: true,
                  label: { en: "Description", ar: "الوصف" },
                },
                {
                  name: "ctaText",
                  type: "text",
                  localized: true,
                  label: { en: "Button Text", ar: "نص الزر" },
                },
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
                {
                  name: "title",
                  type: "text",
                  localized: true,
                  label: { en: "Title", ar: "العنوان" },
                },
                {
                  name: "description",
                  type: "textarea",
                  localized: true,
                  label: { en: "Description", ar: "الوصف" },
                },
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  label: { en: "Image", ar: "الصورة" },
                },
                {
                  name: "ctaText",
                  type: "text",
                  localized: true,
                  label: { en: "Button Text", ar: "نص الزر" },
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
                {
                  name: "title",
                  type: "text",
                  localized: true,
                  label: { en: "Title", ar: "العنوان" },
                },
                {
                  name: "description",
                  type: "textarea",
                  localized: true,
                  label: { en: "Description", ar: "الوصف" },
                },
                {
                  name: "ctaText",
                  type: "text",
                  localized: true,
                  label: { en: "Button Text", ar: "نص الزر" },
                },
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
                {
                  name: "title",
                  type: "text",
                  localized: true,
                  label: { en: "Title", ar: "العنوان" },
                },
                {
                  name: "description",
                  type: "textarea",
                  localized: true,
                  label: { en: "Description", ar: "الوصف" },
                },
                {
                  name: "buttonText",
                  type: "text",
                  localized: true,
                  label: { en: "Button Text", ar: "نص الزر" },
                },
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
