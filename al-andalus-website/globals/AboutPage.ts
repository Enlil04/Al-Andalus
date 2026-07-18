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

const imageField = (
  name: string,
  labelEn: string,
  labelAr: string,
  locationEn: string,
  locationAr: string,
) => ({
  name,
  type: "upload" as const,
  relationTo: "media" as const,
  filterOptions: { mimeType: { contains: "image" } },
  label: { en: labelEn, ar: labelAr },
  admin: {
    description: mediaFieldHint(
      locationEn,
      locationAr,
      "high-resolution image matching the current shape",
      "صورة عالية الدقة تناسب الشكل الحالي",
    ),
  },
});

const pillarGroup = (number: number) => ({
  type: "group" as const,
  name: `whyPillar${number}`,
  label: {
    en: `Why Al-Andalus Item ${number}`,
    ar: `عنصر لماذا الأندلس ${number}`,
  },
  fields: [
    languageTabs(
      [
        {
          name: "circleLabelEn",
          type: "text",
          label: bilingualLabel("Circle Label (English)", "تسمية الدائرة (إنجليزي)"),
        },
        {
          name: "titleEn",
          type: "text",
          label: bilingualLabel("Title (English)", "العنوان (إنجليزي)"),
        },
        {
          name: "itemsEn",
          type: "textarea",
          label: bilingualLabel("Bullet Points (English)", "النقاط (إنجليزي)"),
          admin: { description: "One bullet point per line." },
        },
      ],
      [
        {
          name: "circleLabelAr",
          type: "text",
          label: bilingualLabel("Circle Label (Arabic)", "تسمية الدائرة (عربي)"),
        },
        {
          name: "titleAr",
          type: "text",
          label: bilingualLabel("Title (Arabic)", "العنوان (عربي)"),
        },
        {
          name: "itemsAr",
          type: "textarea",
          label: bilingualLabel("Bullet Points (Arabic)", "النقاط (عربي)"),
          admin: { description: "نقطة واحدة في كل سطر." },
        },
      ],
    ),
  ],
});

const snapshotGroup = (number: number) => ({
  type: "group" as const,
  name: `companyRow${number}`,
  label: { en: `Company Row ${number}`, ar: `صف الشركة ${number}` },
  fields: [
    languageTabs(
      [
        {
          name: "labelEn",
          type: "text",
          label: bilingualLabel("Label (English)", "التسمية (إنجليزي)"),
        },
        {
          name: "valueEn",
          type: "textarea",
          label: bilingualLabel("Value (English)", "القيمة (إنجليزي)"),
        },
      ],
      [
        {
          name: "labelAr",
          type: "text",
          label: bilingualLabel("Label (Arabic)", "التسمية (عربي)"),
        },
        {
          name: "valueAr",
          type: "textarea",
          label: bilingualLabel("Value (Arabic)", "القيمة (عربي)"),
        },
      ],
    ),
  ],
});

const boardMemberGroup = (number: number) => ({
  type: "group" as const,
  name: `boardMember${number}`,
  label: { en: `Board Member ${number}`, ar: `عضو مجلس الإدارة ${number}` },
  fields: [
    languageTabs(
      [
        {
          name: "roleEn",
          type: "text",
          label: bilingualLabel("Role (English)", "المنصب (إنجليزي)"),
        },
        {
          name: "nameEn",
          type: "text",
          label: bilingualLabel("Name (English)", "الاسم (إنجليزي)"),
        },
      ],
      [
        {
          name: "roleAr",
          type: "text",
          label: bilingualLabel("Role (Arabic)", "المنصب (عربي)"),
        },
        {
          name: "nameAr",
          type: "text",
          label: bilingualLabel("Name (Arabic)", "الاسم (عربي)"),
        },
      ],
    ),
  ],
});

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  admin: {
    description: {
      en: "Every visible section of the About Us page, in page order.",
      ar: "جميع أقسام صفحة من نحن الظاهرة، مرتبة حسب ظهورها في الصفحة.",
    },
    group: { en: "Website", ar: "الموقع" },
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: { en: "Page Banner", ar: "بانر الصفحة" },
          fields: [
            languageTabs(
              [
                {
                  name: "heroTitleEn",
                  type: "text",
                  label: bilingualLabel("Page Title (English)", "عنوان الصفحة (إنجليزي)"),
                },
                {
                  name: "heroSubtitleEn",
                  type: "text",
                  label: bilingualLabel("Subtitle (English)", "العنوان الفرعي (إنجليزي)"),
                },
              ],
              [
                {
                  name: "heroTitleAr",
                  type: "text",
                  label: bilingualLabel("Page Title (Arabic)", "عنوان الصفحة (عربي)"),
                },
                {
                  name: "heroSubtitleAr",
                  type: "text",
                  label: bilingualLabel("Subtitle (Arabic)", "العنوان الفرعي (عربي)"),
                },
              ],
            ),
            imageField(
              "heroImage",
              "Page Banner Image",
              "صورة البانر",
              "the wide banner below the About page header",
              "البانر العريض أسفل ترويسة صفحة من نحن",
            ),
          ],
        },
        {
          label: { en: "Mission", ar: "الرسالة" },
          fields: [
            languageTabs(
              [
                { name: "missionLabelEn", type: "text", label: "Small Label" },
                { name: "missionHeadlineEn", type: "textarea", label: "Large Headline" },
                { name: "missionSublineEn", type: "textarea", label: "Headline Subtext" },
                { name: "missionBodyTitleEn", type: "textarea", label: "Body Title" },
                {
                  name: "missionBodyEn",
                  type: "textarea",
                  label: "Body Paragraphs",
                  admin: { description: "Separate paragraphs with a blank line." },
                },
              ],
              [
                { name: "missionLabelAr", type: "text", label: "التسمية الصغيرة" },
                { name: "missionHeadlineAr", type: "textarea", label: "العنوان الكبير" },
                { name: "missionSublineAr", type: "textarea", label: "النص الفرعي" },
                { name: "missionBodyTitleAr", type: "textarea", label: "عنوان النص" },
                {
                  name: "missionBodyAr",
                  type: "textarea",
                  label: "فقرات النص",
                  admin: { description: "افصل بين الفقرات بسطر فارغ." },
                },
              ],
            ),
            imageField(
              "missionImage",
              "Main Mission Image",
              "صورة الرسالة الرئيسية",
              "the main image beside the Mission headline",
              "الصورة الرئيسية بجانب عنوان الرسالة",
            ),
            imageField(
              "missionAccentImage",
              "Mission Accent Image",
              "صورة الرسالة الجانبية",
              "the smaller image in the lower Mission layout",
              "الصورة الصغيرة في الجزء السفلي من قسم الرسالة",
            ),
          ],
        },
        {
          label: { en: "Vision & Mission", ar: "الرؤية والرسالة" },
          fields: [
            languageTabs(
              [
                { name: "visionLabelEn", type: "text", label: "Small Label" },
                { name: "visionHeadlineEn", type: "textarea", label: "Headline" },
                {
                  name: "visionBodyEn",
                  type: "textarea",
                  label: "Three Cards",
                  admin: { description: "Separate the three cards with blank lines." },
                },
              ],
              [
                { name: "visionLabelAr", type: "text", label: "التسمية الصغيرة" },
                { name: "visionHeadlineAr", type: "textarea", label: "العنوان" },
                {
                  name: "visionBodyAr",
                  type: "textarea",
                  label: "البطاقات الثلاث",
                  admin: { description: "افصل بين البطاقات بسطر فارغ." },
                },
              ],
            ),
            imageField(
              "visionImage",
              "Main Vision Image",
              "صورة الرؤية الرئيسية",
              "the large floating image in Vision & Mission",
              "الصورة العائمة الكبيرة في قسم الرؤية والرسالة",
            ),
            imageField(
              "visionAccentImage",
              "Vision Accent Image",
              "صورة الرؤية الجانبية",
              "the small overlapping image in Vision & Mission",
              "الصورة الصغيرة المتداخلة في قسم الرؤية والرسالة",
            ),
          ],
        },
        {
          label: { en: "Why Al-Andalus", ar: "لماذا الأندلس" },
          fields: [
            languageTabs(
              [
                { name: "whyLabelEn", type: "text", label: "Small Label" },
                { name: "whyHeadlineEn", type: "textarea", label: "Headline" },
              ],
              [
                { name: "whyLabelAr", type: "text", label: "التسمية الصغيرة" },
                { name: "whyHeadlineAr", type: "textarea", label: "العنوان" },
              ],
            ),
            pillarGroup(1),
            pillarGroup(2),
            pillarGroup(3),
            pillarGroup(4),
          ],
        },
        {
          label: { en: "Leadership", ar: "القيادة" },
          fields: [
            languageTabs(
              [{ name: "leadershipLabelEn", type: "text", label: "Section Label" }],
              [{ name: "leadershipLabelAr", type: "text", label: "تسمية القسم" }],
            ),
            {
              name: "leadership",
              type: "array",
              label: { en: "Leadership Messages", ar: "رسائل القيادة" },
              fields: [
                languageTabs(
                  [
                    { name: "messageTitleEn", type: "text", label: "Message Title" },
                    { name: "nameEn", type: "text", required: true, label: "Name" },
                    { name: "roleEn", type: "text", label: "Role" },
                    {
                      name: "bioEn",
                      type: "textarea",
                      label: "Message",
                      admin: { description: "Separate paragraphs with a blank line." },
                    },
                  ],
                  [
                    { name: "messageTitleAr", type: "text", label: "عنوان الرسالة" },
                    { name: "nameAr", type: "text", required: true, label: "الاسم" },
                    { name: "roleAr", type: "text", label: "المنصب" },
                    {
                      name: "bioAr",
                      type: "textarea",
                      label: "الرسالة",
                      admin: { description: "افصل بين الفقرات بسطر فارغ." },
                    },
                  ],
                ),
                imageField(
                  "photo",
                  "Portrait",
                  "الصورة الشخصية",
                  "this leader's full-height portrait",
                  "الصورة الشخصية الكاملة لهذا القائد",
                ),
              ],
            },
          ],
        },
        {
          label: { en: "Company Information", ar: "معلومات الشركة" },
          fields: [
            languageTabs(
              [
                { name: "companyTitleEn", type: "text", label: "Section Title" },
                { name: "boardLabelEn", type: "text", label: "Board Members Label" },
              ],
              [
                { name: "companyTitleAr", type: "text", label: "عنوان القسم" },
                { name: "boardLabelAr", type: "text", label: "تسمية أعضاء مجلس الإدارة" },
              ],
            ),
            snapshotGroup(1),
            snapshotGroup(2),
            snapshotGroup(3),
            snapshotGroup(4),
            boardMemberGroup(1),
            boardMemberGroup(2),
          ],
        },
      ],
    },
  ],
};
