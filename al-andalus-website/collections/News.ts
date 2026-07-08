import { CollectionConfig } from "payload";

import { isAdminOrEditor } from "../access/roles";

export const News: CollectionConfig = {
  slug: "news",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedDate", "status"],
    description: "إدارة المدونة والأخبار (Blog Management)",
    group: {
      en: "Blog",
      ar: "المدونة",
    },
    listSearchableFields: ["title", "slug", "excerpt"],
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      label: {
        en: "Article Title",
        ar: "عنوان المقال",
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
      label: {
        en: "URL Slug",
        ar: "رابط المقال",
      },
    },
    {
      name: "content",
      type: "richText",
      localized: true,
      label: {
        en: "Content",
        ar: "المحتوى",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      label: {
        en: "Excerpt",
        ar: "مقتطف",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: {
        en: "Cover Image",
        ar: "صورة الغلاف",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: { en: "Company News", ar: "أخبار الشركة" }, value: "company" },
        { label: { en: "Motor Insurance", ar: "تأمين السيارات" }, value: "motor" },
        { label: { en: "Health Insurance", ar: "التأمين الصحي" }, value: "health" },
        { label: { en: "Travel Insurance", ar: "تأمين السفر" }, value: "travel" },
        { label: { en: "Fire Insurance", ar: "تأمين الحريق" }, value: "fire" },
        { label: { en: "General", ar: "عام" }, value: "general" },
      ],
      admin: {
        position: "sidebar",
      },
      label: {
        en: "Category",
        ar: "التصنيف",
      },
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
      label: {
        en: "Published Date",
        ar: "تاريخ النشر",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: { en: "Draft", ar: "مسودة" }, value: "draft" },
        { label: { en: "Published", ar: "منشور" }, value: "published" },
      ],
      admin: {
        position: "sidebar",
      },
      label: {
        en: "Publish Status",
        ar: "حالة النشر",
      },
    },
  ],
};
