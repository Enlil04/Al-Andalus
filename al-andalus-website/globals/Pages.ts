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
      "high-resolution image matching the current layout",
      "صورة عالية الدقة تناسب التخطيط الحالي",
    ),
  },
});

const bannerFields = (pageEn: string, pageAr: string, withImage = true) => [
  languageTabs(
    [
      {
        name: "bannerTitleEn",
        type: "text" as const,
        label: bilingualLabel("Banner Title (English)", "عنوان البانر (إنجليزي)"),
      },
      {
        name: "bannerSubtitleEn",
        type: "text" as const,
        label: bilingualLabel("Banner Subtitle (English)", "العنوان الفرعي (إنجليزي)"),
      },
    ],
    [
      {
        name: "bannerTitleAr",
        type: "text" as const,
        label: bilingualLabel("Banner Title (Arabic)", "عنوان البانر (عربي)"),
      },
      {
        name: "bannerSubtitleAr",
        type: "text" as const,
        label: bilingualLabel("Banner Subtitle (Arabic)", "العنوان الفرعي (عربي)"),
      },
    ],
  ),
  ...(withImage
    ? [
        imageField(
          "bannerImage",
          "Banner Image",
          "صورة البانر",
          `the wide banner below the header on the ${pageEn} page`,
          `البانر العريض أسفل الترويسة في صفحة ${pageAr}`,
        ),
      ]
    : []),
];

const sectorGroup = (name: string, labelEn: string, labelAr: string) => ({
  type: "group" as const,
  name,
  label: { en: labelEn, ar: labelAr },
  fields: [
    languageTabs(
      [
        { name: "titleEn", type: "text" as const, label: "Title" },
        { name: "descEn", type: "textarea" as const, label: "Description" },
      ],
      [
        { name: "titleAr", type: "text" as const, label: "العنوان" },
        { name: "descAr", type: "textarea" as const, label: "الوصف" },
      ],
    ),
  ],
});

export const Pages: GlobalConfig = {
  slug: "pages",
  label: { en: "Other Pages", ar: "الصفحات الأخرى" },
  admin: {
    description: {
      en: "Every visible section of Services, Jobs, Blogs, Partners, Contact, Request Quote, Application, and Privacy — in page order.",
      ar: "جميع أقسام صفحات الخدمات والوظائف والمدونة والشركاء والتواصل وطلب التسعيرة والتطبيق والخصوصية، مرتبة حسب ظهورها.",
    },
    group: { en: "Website", ar: "الموقع" },
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: { en: "Services", ar: "الخدمات" },
          fields: [
            {
              type: "group",
              name: "services",
              label: { en: "Services Page", ar: "صفحة الخدمات" },
              fields: [
                ...bannerFields("Services", "الخدمات"),
                {
                  type: "collapsible",
                  label: { en: "Message Section", ar: "قسم الرسالة" },
                  fields: [
                    languageTabs(
                      [
                        { name: "messageLabelEn", type: "text", label: "Small Label" },
                        { name: "messageHeadlineEn", type: "textarea", label: "Headline" },
                        { name: "messageBodyTitleEn", type: "textarea", label: "Body Title" },
                        {
                          name: "messageBodyEn",
                          type: "textarea",
                          label: "Body Paragraphs",
                          admin: { description: "Separate paragraphs with a blank line." },
                        },
                      ],
                      [
                        { name: "messageLabelAr", type: "text", label: "التسمية الصغيرة" },
                        { name: "messageHeadlineAr", type: "textarea", label: "العنوان" },
                        { name: "messageBodyTitleAr", type: "textarea", label: "عنوان النص" },
                        {
                          name: "messageBodyAr",
                          type: "textarea",
                          label: "فقرات النص",
                          admin: { description: "افصل بين الفقرات بسطر فارغ." },
                        },
                      ],
                    ),
                    imageField(
                      "messageImage",
                      "Message Image",
                      "صورة الرسالة",
                      "the large image beside the Services message headline",
                      "الصورة الكبيرة بجانب عنوان رسالة صفحة الخدمات",
                    ),
                    imageField(
                      "messageBottomImage",
                      "Message Bottom Image",
                      "الصورة السفلية",
                      "the smaller photo under the Services message section",
                      "الصورة الأصغر أسفل قسم رسالة الخدمات",
                    ),
                  ],
                },
                {
                  type: "collapsible",
                  label: { en: "Industries Section", ar: "قسم القطاعات" },
                  fields: [
                    languageTabs(
                      [
                        { name: "industriesLabelEn", type: "text", label: "Small Label" },
                        { name: "industriesHeadlineEn", type: "textarea", label: "Headline" },
                        { name: "industriesCoreTitleEn", type: "text", label: "Diagram Center Title" },
                        { name: "industriesButtonTextEn", type: "text", label: "Button Text" },
                      ],
                      [
                        { name: "industriesLabelAr", type: "text", label: "التسمية الصغيرة" },
                        { name: "industriesHeadlineAr", type: "textarea", label: "العنوان" },
                        { name: "industriesCoreTitleAr", type: "text", label: "عنوان مركز المخطط" },
                        { name: "industriesButtonTextAr", type: "text", label: "نص الزر" },
                      ],
                    ),
                    {
                      name: "industriesButtonLink",
                      type: "text",
                      label: { en: "Button Link", ar: "رابط الزر" },
                    },
                    imageField(
                      "industriesImage",
                      "Industries Image",
                      "صورة القطاعات",
                      "the image beside the Industries headline",
                      "الصورة بجانب عنوان القطاعات",
                    ),
                    sectorGroup("sector1", "Sector 1", "القطاع 1"),
                    sectorGroup("sector2", "Sector 2", "القطاع 2"),
                    sectorGroup("sector3", "Sector 3", "القطاع 3"),
                    sectorGroup("sector4", "Sector 4", "القطاع 4"),
                    sectorGroup("sector5", "Sector 5", "القطاع 5"),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { en: "Jobs", ar: "الوظائف" },
          fields: [
            {
              type: "group",
              name: "jobs",
              label: { en: "Jobs Page", ar: "صفحة الوظائف" },
              fields: [
                ...bannerFields("Jobs", "الوظائف"),
                languageTabs(
                  [
                    { name: "messageLabelEn", type: "text", label: "Message Label" },
                    { name: "messageHeadlineEn", type: "textarea", label: "Message Headline" },
                    { name: "listingsEyebrowEn", type: "text", label: "Listings Eyebrow" },
                    { name: "listingsTitleEn", type: "text", label: "Listings Title" },
                  ],
                  [
                    { name: "messageLabelAr", type: "text", label: "تسمية الرسالة" },
                    { name: "messageHeadlineAr", type: "textarea", label: "عنوان الرسالة" },
                    { name: "listingsEyebrowAr", type: "text", label: "عنوان القائمة الفرعي" },
                    { name: "listingsTitleAr", type: "text", label: "عنوان القائمة" },
                  ],
                ),
                imageField(
                  "messageImage",
                  "Message Image",
                  "صورة الرسالة",
                  "the large image beside the Jobs message headline",
                  "الصورة الكبيرة بجانب عنوان رسالة صفحة الوظائف",
                ),
              ],
            },
          ],
        },
        {
          label: { en: "Blogs", ar: "المدونة" },
          fields: [
            {
              type: "group",
              name: "blogs",
              label: { en: "Blogs Page", ar: "صفحة المدونة" },
              fields: [
                ...bannerFields("Blogs", "المدونة"),
                languageTabs(
                  [
                    { name: "sectionLabelEn", type: "text", label: "Section Label" },
                    { name: "sectionTitleEn", type: "text", label: "Section Title" },
                  ],
                  [
                    { name: "sectionLabelAr", type: "text", label: "تسمية القسم" },
                    { name: "sectionTitleAr", type: "text", label: "عنوان القسم" },
                  ],
                ),
              ],
            },
          ],
        },
        {
          label: { en: "Partners", ar: "الشركاء" },
          fields: [
            {
              type: "group",
              name: "partners",
              label: { en: "Partners Page", ar: "صفحة الشركاء" },
              fields: [
                ...bannerFields("Partners", "الشركاء"),
                languageTabs(
                  [
                    { name: "introLabelEn", type: "text", label: "Intro Label" },
                    { name: "introHeadlineEn", type: "text", label: "Intro Headline" },
                    { name: "introDescriptionEn", type: "textarea", label: "Intro Description" },
                  ],
                  [
                    { name: "introLabelAr", type: "text", label: "تسمية المقدمة" },
                    { name: "introHeadlineAr", type: "text", label: "عنوان المقدمة" },
                    { name: "introDescriptionAr", type: "textarea", label: "وصف المقدمة" },
                  ],
                ),
              ],
            },
          ],
        },
        {
          label: { en: "Contact", ar: "التواصل" },
          fields: [
            {
              type: "group",
              name: "contact",
              label: { en: "Contact Page", ar: "صفحة التواصل" },
              fields: [
                ...bannerFields("Contact", "التواصل"),
                languageTabs(
                  [
                    { name: "formLabelEn", type: "text", label: "Form Label" },
                    { name: "formHeadlineEn", type: "textarea", label: "Form Headline" },
                    { name: "formIntroEn", type: "textarea", label: "Form Intro" },
                    { name: "visitLabelEn", type: "text", label: "Visit Section Label" },
                    { name: "visitHeadlineEn", type: "text", label: "Visit Section Headline" },
                    { name: "visitIntroEn", type: "textarea", label: "Visit Section Intro" },
                  ],
                  [
                    { name: "formLabelAr", type: "text", label: "تسمية النموذج" },
                    { name: "formHeadlineAr", type: "textarea", label: "عنوان النموذج" },
                    { name: "formIntroAr", type: "textarea", label: "مقدمة النموذج" },
                    { name: "visitLabelAr", type: "text", label: "تسمية قسم الزيارة" },
                    { name: "visitHeadlineAr", type: "text", label: "عنوان قسم الزيارة" },
                    { name: "visitIntroAr", type: "textarea", label: "مقدمة قسم الزيارة" },
                  ],
                ),
              ],
            },
          ],
        },
        {
          label: { en: "Request Quote", ar: "طلب التسعيرة" },
          fields: [
            {
              type: "group",
              name: "requestQuote",
              label: { en: "Request Quote Page", ar: "صفحة طلب التسعيرة" },
              fields: [
                ...bannerFields("Request Quote", "طلب التسعيرة", false),
                languageTabs(
                  [
                    { name: "formLabelEn", type: "text", label: "Form Label" },
                    { name: "formHeadlineEn", type: "text", label: "Form Headline" },
                    { name: "formIntroEn", type: "textarea", label: "Form Intro" },
                    { name: "visitLabelEn", type: "text", label: "Visit Section Label" },
                    { name: "visitHeadlineEn", type: "text", label: "Visit Section Headline" },
                    { name: "visitIntroEn", type: "textarea", label: "Visit Section Intro" },
                  ],
                  [
                    { name: "formLabelAr", type: "text", label: "تسمية النموذج" },
                    { name: "formHeadlineAr", type: "text", label: "عنوان النموذج" },
                    { name: "formIntroAr", type: "textarea", label: "مقدمة النموذج" },
                    { name: "visitLabelAr", type: "text", label: "تسمية قسم الزيارة" },
                    { name: "visitHeadlineAr", type: "text", label: "عنوان قسم الزيارة" },
                    { name: "visitIntroAr", type: "textarea", label: "مقدمة قسم الزيارة" },
                  ],
                ),
              ],
            },
          ],
        },
        {
          label: { en: "Application", ar: "التطبيق" },
          fields: [
            {
              type: "group",
              name: "application",
              label: { en: "Application Page", ar: "صفحة التطبيق" },
              fields: [
                languageTabs(
                  [
                    { name: "titleEn", type: "text", label: "App Title" },
                    {
                      name: "descriptionEn",
                      type: "textarea",
                      label: "App Description",
                      admin: { description: "Separate paragraphs with a blank line." },
                    },
                  ],
                  [
                    { name: "titleAr", type: "text", label: "عنوان التطبيق" },
                    {
                      name: "descriptionAr",
                      type: "textarea",
                      label: "وصف التطبيق",
                      admin: { description: "افصل بين الفقرات بسطر فارغ." },
                    },
                  ],
                ),
                imageField(
                  "appImage",
                  "App Screenshot",
                  "صورة التطبيق",
                  "the phone screenshot beside the app description",
                  "صورة شاشة الهاتف بجانب وصف التطبيق",
                ),
                {
                  type: "group",
                  name: "downloadIos",
                  label: { en: "Download Button 1 (App Store)", ar: "زر التحميل 1 (آب ستور)" },
                  fields: [
                    languageTabs(
                      [{ name: "labelEn", type: "text", label: "Button Label" }],
                      [{ name: "labelAr", type: "text", label: "نص الزر" }],
                    ),
                    {
                      name: "url",
                      type: "text",
                      label: { en: "Download Link", ar: "رابط التحميل" },
                      admin: {
                        description: {
                          en: "Leave empty to hide this button.",
                          ar: "اتركه فارغاً لإخفاء هذا الزر.",
                        },
                      },
                    },
                  ],
                },
                {
                  type: "group",
                  name: "downloadAndroid",
                  label: { en: "Download Button 2 (Google Play)", ar: "زر التحميل 2 (جوجل بلاي)" },
                  fields: [
                    languageTabs(
                      [{ name: "labelEn", type: "text", label: "Button Label" }],
                      [{ name: "labelAr", type: "text", label: "نص الزر" }],
                    ),
                    {
                      name: "url",
                      type: "text",
                      label: { en: "Download Link", ar: "رابط التحميل" },
                      admin: {
                        description: {
                          en: "Leave empty to hide this button.",
                          ar: "اتركه فارغاً لإخفاء هذا الزر.",
                        },
                      },
                    },
                  ],
                },
                {
                  type: "group",
                  name: "downloadDirect",
                  label: {
                    en: "Download Button 3 (Huawei AppGallery)",
                    ar: "زر التحميل 3 (هواوي آب غاليري)",
                  },
                  fields: [
                    languageTabs(
                      [{ name: "labelEn", type: "text", label: "Button Label" }],
                      [{ name: "labelAr", type: "text", label: "نص الزر" }],
                    ),
                    {
                      name: "url",
                      type: "text",
                      label: { en: "AppGallery Link", ar: "رابط آب غاليري" },
                      admin: {
                        description: {
                          en: "Huawei AppGallery store URL. Leave empty to show as Coming Soon.",
                          ar: "رابط متجر هواوي آب غاليري. اتركه فارغاً لإظهار الزر كـ «قريباً».",
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { en: "Privacy", ar: "الخصوصية" },
          fields: [
            {
              type: "group",
              name: "privacy",
              label: { en: "Privacy Page", ar: "صفحة الخصوصية" },
              fields: [
                ...bannerFields("Privacy", "الخصوصية", false),
                {
                  name: "sections",
                  type: "array",
                  label: { en: "Policy Sections", ar: "أقسام السياسة" },
                  fields: [
                    languageTabs(
                      [
                        { name: "titleEn", type: "text", required: true, label: "Section Title" },
                        {
                          name: "bodyEn",
                          type: "textarea",
                          label: "Paragraphs",
                          admin: { description: "Separate paragraphs with a blank line." },
                        },
                        {
                          name: "listEn",
                          type: "textarea",
                          label: "Bullet List",
                          admin: { description: "One bullet per line. Leave empty if unused." },
                        },
                      ],
                      [
                        { name: "titleAr", type: "text", required: true, label: "عنوان القسم" },
                        {
                          name: "bodyAr",
                          type: "textarea",
                          label: "الفقرات",
                          admin: { description: "افصل بين الفقرات بسطر فارغ." },
                        },
                        {
                          name: "listAr",
                          type: "textarea",
                          label: "قائمة النقاط",
                          admin: { description: "نقطة واحدة في كل سطر. اتركه فارغاً إن لم يُستخدم." },
                        },
                      ],
                    ),
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
