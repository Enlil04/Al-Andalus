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
          label: { en: "Hero", ar: "البانر الرئيسي" },
          fields: [
            {
              name: "heroSlides",
              type: "array",
              maxRows: 1,
              label: {
                en: "Hero Text",
                ar: "نص البانر",
              },
              labels: {
                singular: { en: "Hero Text", ar: "نص البانر" },
                plural: { en: "Hero Text", ar: "نص البانر" },
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
                      name: "scrollLabelEn",
                      type: "text",
                      label: bilingualLabel(
                        "Scroll Hint Text (English)",
                        "نص تلميح التمرير (إنجليزي)",
                      ),
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
                      name: "scrollLabelAr",
                      type: "text",
                      label: bilingualLabel(
                        "Scroll Hint Text (Arabic)",
                        "نص تلميح التمرير (عربي)",
                      ),
                    },
                  ],
                ),
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
                  filterOptions: { mimeType: { contains: "image" } },
                  label: { en: "Section Image", ar: "صورة القسم" },
                  admin: {
                    description: mediaFieldHint(
                      "the large image in the homepage Introduction section",
                      "الصورة الكبيرة في قسم المقدمة بالصفحة الرئيسية",
                      "portrait image, about 1200×1600",
                      "صورة عمودية بحجم يقارب 1200×1600",
                    ),
                  },
                },
              ],
            },
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
                {
                  name: "storyImageLarge",
                  type: "upload",
                  relationTo: "media",
                  filterOptions: { mimeType: { contains: "image" } },
                  label: { en: "Story Image (Large)", ar: "صورة القصة (كبيرة)" },
                  admin: {
                    description: mediaFieldHint(
                      "the large image in the homepage Story section",
                      "الصورة الكبيرة في قسم القصة بالصفحة الرئيسية",
                      "landscape image, about 1600×1000",
                      "صورة أفقية بحجم يقارب 1600×1000",
                    ),
                  },
                },
                {
                  name: "storyImageSmall",
                  type: "upload",
                  relationTo: "media",
                  filterOptions: { mimeType: { contains: "image" } },
                  label: { en: "Story Image (Small)", ar: "صورة القصة (صغيرة)" },
                  admin: {
                    description: mediaFieldHint(
                      "the smaller overlapping image in the Story section",
                      "الصورة الصغيرة المتداخلة في قسم القصة",
                      "portrait image, about 900×1200",
                      "صورة عمودية بحجم يقارب 900×1200",
                    ),
                  },
                },
              ],
            },
            {
              name: "expandingImage",
              type: "upload",
              relationTo: "media",
              filterOptions: { mimeType: { contains: "image" } },
              label: { en: "Expanding Image", ar: "الصورة المتوسعة" },
              admin: {
                description: mediaFieldHint(
                  "the full-width expanding image between the Story and About sections",
                  "الصورة المتوسعة بعرض الشاشة بين قسمي القصة ومن نحن",
                  "wide landscape image, 1920×1080",
                  "صورة أفقية عريضة 1920×1080",
                ),
              },
            },
          ],
        },
        {
          label: { en: "About & Why Al-Andalus", ar: "من نحن ولماذا الأندلس" },
          fields: [
            {
              type: "group",
              name: "aboutPreview",
              label: { en: "About Preview", ar: "معاينة من نحن" },
              fields: [
                languageTabs(
                  [
                    {
                      name: "labelEn",
                      type: "text",
                      label: bilingualLabel("Small Label (English)", "التسمية الصغيرة (إنجليزي)"),
                    },
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
                      name: "labelAr",
                      type: "text",
                      label: bilingualLabel("Small Label (Arabic)", "التسمية الصغيرة (عربي)"),
                    },
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
                  name: "aboutImg1",
                  type: "upload",
                  relationTo: "media",
                  filterOptions: { mimeType: { contains: "image" } },
                  label: { en: "About Image 1", ar: "صورة من نحن 1" },
                  admin: {
                    description: mediaFieldHint(
                      "tile 1 in the homepage About image collage",
                      "الصورة 1 في شبكة صور من نحن بالصفحة الرئيسية",
                      "landscape image, 1200×800",
                      "صورة أفقية 1200×800",
                    ),
                  },
                },
                {
                  name: "aboutImg2",
                  type: "upload",
                  relationTo: "media",
                  filterOptions: { mimeType: { contains: "image" } },
                  label: { en: "About Image 2", ar: "صورة من نحن 2" },
                  admin: {
                    description: mediaFieldHint(
                      "tile 2 in the homepage About image collage",
                      "الصورة 2 في شبكة صور من نحن بالصفحة الرئيسية",
                      "landscape image, 1200×800",
                      "صورة أفقية 1200×800",
                    ),
                  },
                },
                {
                  name: "aboutImg3",
                  type: "upload",
                  relationTo: "media",
                  filterOptions: { mimeType: { contains: "image" } },
                  label: { en: "About Image 3", ar: "صورة من نحن 3" },
                  admin: {
                    description: mediaFieldHint(
                      "tile 3 in the homepage About image collage",
                      "الصورة 3 في شبكة صور من نحن بالصفحة الرئيسية",
                      "landscape image, 1200×800",
                      "صورة أفقية 1200×800",
                    ),
                  },
                },
                {
                  name: "aboutImg4",
                  type: "upload",
                  relationTo: "media",
                  filterOptions: { mimeType: { contains: "image" } },
                  label: { en: "About Image 4", ar: "صورة من نحن 4" },
                  admin: {
                    description: mediaFieldHint(
                      "tile 4 in the homepage About image collage",
                      "الصورة 4 في شبكة صور من نحن بالصفحة الرئيسية",
                      "landscape image, 1200×800",
                      "صورة أفقية 1200×800",
                    ),
                  },
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
              name: "whyUs",
              label: { en: "Why Choose Us Section", ar: "قسم لماذا الأندلس" },
              fields: [
                languageTabs(
                  [
                    {
                      name: "labelEn",
                      type: "text",
                      label: bilingualLabel("Small Label (English)", "التسمية الصغيرة (إنجليزي)"),
                    },
                    {
                      name: "titleEn",
                      type: "textarea",
                      label: bilingualLabel("Headline (English)", "العنوان (إنجليزي)"),
                    },
                    {
                      name: "descriptionEn",
                      type: "textarea",
                      label: bilingualLabel("Description (English)", "الوصف (إنجليزي)"),
                    },
                  ],
                  [
                    {
                      name: "labelAr",
                      type: "text",
                      label: bilingualLabel("Small Label (Arabic)", "التسمية الصغيرة (عربي)"),
                    },
                    {
                      name: "titleAr",
                      type: "textarea",
                      label: bilingualLabel("Headline (Arabic)", "العنوان (عربي)"),
                    },
                    {
                      name: "descriptionAr",
                      type: "textarea",
                      label: bilingualLabel("Description (Arabic)", "الوصف (عربي)"),
                    },
                  ],
                ),
                {
                  name: "img1",
                  type: "upload",
                  relationTo: "media",
                  filterOptions: { mimeType: { contains: "image" } },
                  label: { en: "Grid Image 1", ar: "صورة الشبكة 1" },
                  admin: {
                    description: mediaFieldHint(
                      "position 1 in the Why Choose Us image grid",
                      "الموضع 1 في شبكة صور لماذا الأندلس",
                      "landscape image, 1200×800",
                      "صورة أفقية 1200×800",
                    ),
                  },
                },
                {
                  name: "img2",
                  type: "upload",
                  relationTo: "media",
                  filterOptions: { mimeType: { contains: "image" } },
                  label: { en: "Grid Image 2", ar: "صورة الشبكة 2" },
                  admin: {
                    description: mediaFieldHint(
                      "position 2 in the Why Choose Us image grid",
                      "الموضع 2 في شبكة صور لماذا الأندلس",
                      "landscape image, 1200×800",
                      "صورة أفقية 1200×800",
                    ),
                  },
                },
                {
                  name: "img3",
                  type: "upload",
                  relationTo: "media",
                  filterOptions: { mimeType: { contains: "image" } },
                  label: { en: "Grid Image 3", ar: "صورة الشبكة 3" },
                  admin: {
                    description: mediaFieldHint(
                      "position 3 in the Why Choose Us image grid",
                      "الموضع 3 في شبكة صور لماذا الأندلس",
                      "landscape image, 1200×800",
                      "صورة أفقية 1200×800",
                    ),
                  },
                },
                {
                  name: "img4",
                  type: "upload",
                  relationTo: "media",
                  filterOptions: { mimeType: { contains: "image" } },
                  label: { en: "Grid Image 4", ar: "صورة الشبكة 4" },
                  admin: {
                    description: mediaFieldHint(
                      "position 4 in the Why Choose Us image grid",
                      "الموضع 4 في شبكة صور لماذا الأندلس",
                      "landscape image, 1200×800",
                      "صورة أفقية 1200×800",
                    ),
                  },
                },
                {
                  name: "img5",
                  type: "upload",
                  relationTo: "media",
                  filterOptions: { mimeType: { contains: "image" } },
                  label: { en: "Grid Image 5", ar: "صورة الشبكة 5" },
                  admin: {
                    description: mediaFieldHint(
                      "position 5 in the Why Choose Us image grid",
                      "الموضع 5 في شبكة صور لماذا الأندلس",
                      "landscape image, 1200×800",
                      "صورة أفقية 1200×800",
                    ),
                  },
                },
                {
                  name: "img6",
                  type: "upload",
                  relationTo: "media",
                  filterOptions: { mimeType: { contains: "image" } },
                  label: { en: "Grid Image 6", ar: "صورة الشبكة 6" },
                  admin: {
                    description: mediaFieldHint(
                      "position 6 in the Why Choose Us image grid",
                      "الموضع 6 في شبكة صور لماذا الأندلس",
                      "landscape image, 1200×800",
                      "صورة أفقية 1200×800",
                    ),
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
