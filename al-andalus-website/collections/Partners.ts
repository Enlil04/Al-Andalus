import { CollectionConfig } from "payload";

import { isAdminOrEditor } from "../access/roles";
import { bilingualLabel, mediaFieldHint } from "../lib/cms/labels";

export const Partners: CollectionConfig = {
  slug: "partners",
  labels: {
    singular: bilingualLabel("Partner", "شريك"),
    plural: bilingualLabel("Partners", "الشركاء"),
  },
  admin: {
    useAsTitle: "nameEn",
    defaultColumns: ["nameEn", "nameAr", "order"],
    description: {
      en: "Partners & clients. Enter English and Arabic names in the language tabs below.",
      ar: "شركاء النجاح والعملاء. أدخل الاسم بالإنجليزية والعربية من تبويبات اللغة أدناه.",
    },
    group: {
      en: "Content",
      ar: "المحتوى",
    },
    listSearchableFields: ["nameEn", "nameAr"],
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
              name: "nameEn",
              type: "text",
              required: true,
              label: bilingualLabel("Partner Name (English)", "اسم الشريك (إنجليزي)"),
            },
          ],
        },
        {
          label: { en: "Arabic", ar: "العربية" },
          fields: [
            {
              name: "nameAr",
              type: "text",
              required: true,
              label: bilingualLabel("Partner Name (Arabic)", "اسم الشريك (عربي)"),
            },
          ],
        },
      ],
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
      required: true,
      label: bilingualLabel("Logo", "الشعار"),
      admin: {
        description: mediaFieldHint(
          "this partner's logo on the homepage and Partners page. Prefer a dark or full-color logo on a transparent background (PNG/SVG). Avoid white-only logos — they disappear on the white Partners page.",
          "شعار هذا الشريك في الصفحة الرئيسية وصفحة الشركاء. يُفضّل شعار داكن أو ملون على خلفية شفافة (PNG/SVG). تجنّب الشعارات البيضاء فقط — تختفي على صفحة الشركاء البيضاء.",
          "transparent PNG/SVG, wide format, at least 800px",
          "PNG/SVG شفاف وعريض وبحجم لا يقل عن 800 بكسل",
        ),
      },
    },
    {
      name: "website",
      type: "text",
      label: bilingualLabel("Website URL", "رابط الموقع"),
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
