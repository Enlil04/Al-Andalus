import { CollectionConfig } from "payload";

import { isAdminOrEditor } from "../access/roles";
import { bilingualLabel, mediaFieldHint } from "../lib/cms/labels";

export const Products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: bilingualLabel("Product", "خدمة"),
    plural: bilingualLabel("Products", "الخدمات"),
  },
  admin: {
    useAsTitle: "titleEn",
    defaultColumns: ["titleEn", "titleAr", "category", "status", "isFeatured", "order"],
    description: {
      en: "Insurance services. Enter English and Arabic in the language tabs below.",
      ar: "إدارة الخدمات التأمينية. أدخل الإنجليزية والعربية من تبويبات اللغة أدناه.",
    },
    group: {
      en: "Insurance",
      ar: "التأمين",
    },
    listSearchableFields: ["titleEn", "titleAr", "slug"],
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
              label: bilingualLabel("Service Name (English)", "اسم الخدمة (إنجليزي)"),
            },
            {
              name: "shortDescriptionEn",
              type: "textarea",
              required: true,
              label: bilingualLabel("Short Description (English)", "وصف مختصر (إنجليزي)"),
            },
            {
              name: "descriptionEn",
              type: "richText",
              label: bilingualLabel("Full Description (English)", "الوصف الكامل (إنجليزي)"),
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
              label: bilingualLabel("Service Name (Arabic)", "اسم الخدمة (عربي)"),
            },
            {
              name: "shortDescriptionAr",
              type: "textarea",
              required: true,
              label: bilingualLabel("Short Description (Arabic)", "وصف مختصر (عربي)"),
            },
            {
              name: "descriptionAr",
              type: "richText",
              label: bilingualLabel("Full Description (Arabic)", "الوصف الكامل (عربي)"),
            },
          ],
        },
      ],
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
      label: bilingualLabel("Service Image", "صورة الخدمة"),
      admin: {
        description: mediaFieldHint(
          "the service card and service detail page image",
          "صورة بطاقة الخدمة وصفحة تفاصيل الخدمة",
          "landscape image, 1600×1000",
          "صورة أفقية 1600×1000",
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
      label: bilingualLabel("URL Slug", "رابط الخدمة"),
    },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "business",
      options: [
        { label: bilingualLabel("Personal", "شخصي"), value: "personal" },
        { label: bilingualLabel("Business", "أعمال"), value: "business" },
        { label: bilingualLabel("Industrial", "صناعي"), value: "industrial" },
        { label: bilingualLabel("Financial", "مالي"), value: "financial" },
      ],
      admin: {
        position: "sidebar",
        description: {
          en: "Controls which tab the service appears under on the Services page.",
          ar: "يحدد التبويب الذي تظهر تحته الخدمة في صفحة الخدمات.",
        },
      },
      label: bilingualLabel("Display Category", "فئة العرض"),
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Featured on Homepage", "مميز في الصفحة الرئيسية"),
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "active",
      options: [
        { label: bilingualLabel("Available", "متاح"), value: "active" },
        {
          label: bilingualLabel("Coming Soon", "قريباً"),
          value: "under-development",
        },
      ],
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Availability", "التوفر"),
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Display Order", "ترتيب العرض"),
    },
  ],
};
