import { CollectionConfig } from "payload";

import { isAdminOrEditor } from "../access/roles";
import { bilingualLabel, mediaFieldHint } from "../lib/cms/labels";

export const News: CollectionConfig = {
  slug: "news",
  labels: {
    singular: bilingualLabel("News Article", "مقال"),
    plural: bilingualLabel("News", "الأخبار"),
  },
  admin: {
    useAsTitle: "titleEn",
    defaultColumns: ["titleEn", "titleAr", "category", "publishedDate", "status"],
    description: {
      en: "Blog & news articles. Enter English and Arabic in the language tabs below.",
      ar: "إدارة المدونة والأخبار. أدخل الإنجليزية والعربية من تبويبات اللغة أدناه.",
    },
    group: {
      en: "Blog",
      ar: "المدونة",
    },
    listSearchableFields: ["titleEn", "titleAr", "slug", "excerptEn", "excerptAr"],
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: { en: "English", ar: "الإنجليزية" },
          fields: [
            {
              name: "titleEn",
              type: "text",
              required: true,
              label: bilingualLabel("Article Title (English)", "عنوان المقال (إنجليزي)"),
            },
            {
              name: "contentEn",
              type: "richText",
              label: bilingualLabel("Content (English)", "المحتوى (إنجليزي)"),
            },
            {
              name: "excerptEn",
              type: "textarea",
              label: bilingualLabel("Excerpt (English)", "مقتطف (إنجليزي)"),
            },
          ],
        },
        {
          label: { en: "Arabic", ar: "العربية" },
          fields: [
            {
              name: "titleAr",
              type: "text",
              required: true,
              label: bilingualLabel("Article Title (Arabic)", "عنوان المقال (عربي)"),
            },
            {
              name: "contentAr",
              type: "richText",
              label: bilingualLabel("Content (Arabic)", "المحتوى (عربي)"),
            },
            {
              name: "excerptAr",
              type: "textarea",
              label: bilingualLabel("Excerpt (Arabic)", "مقتطف (عربي)"),
            },
          ],
        },
      ],
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
      label: bilingualLabel("Cover Image", "صورة الغلاف"),
      admin: {
        description: mediaFieldHint(
          "this article's card in the news list and its detail-page cover",
          "بطاقة هذا المقال في قائمة الأخبار وغلاف صفحة المقال",
          "landscape image, 1600×900",
          "صورة أفقية 1600×900",
        ),
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("URL Slug", "رابط المقال"),
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        {
          label: bilingualLabel("Company News", "أخبار الشركة"),
          value: "company",
        },
        {
          label: bilingualLabel("Motor Insurance", "تأمين السيارات"),
          value: "motor",
        },
        {
          label: bilingualLabel("Health Insurance", "التأمين الصحي"),
          value: "health",
        },
        {
          label: bilingualLabel("Travel Insurance", "تأمين السفر"),
          value: "travel",
        },
        {
          label: bilingualLabel("Fire Insurance", "تأمين الحريق"),
          value: "fire",
        },
        { label: bilingualLabel("General", "عام"), value: "general" },
      ],
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Category", "التصنيف"),
    },
    {
      name: "publishedDate",
      type: "date",
      required: true,
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "yyyy.MM.dd",
        },
      },
      label: bilingualLabel("Published Date", "تاريخ النشر"),
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: bilingualLabel("Draft", "مسودة"), value: "draft" },
        { label: bilingualLabel("Published", "منشور"), value: "published" },
      ],
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Publish Status", "حالة النشر"),
    },
  ],
};
