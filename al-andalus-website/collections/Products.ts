import { CollectionConfig } from "payload";

import { isAdminOrEditor } from "../access/roles";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "isFeatured", "order"],
    description: "إدارة الخدمات التأمينية (Insurance Services Management)",
    group: {
      en: "Insurance",
      ar: "التأمين",
    },
    listSearchableFields: ["title", "slug"],
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
        en: "Service Name",
        ar: "اسم الخدمة",
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
        ar: "رابط الخدمة",
      },
    },
    {
      name: "shortDescription",
      type: "textarea",
      required: true,
      localized: true,
      label: {
        en: "Short Description",
        ar: "وصف مختصر",
      },
    },
    {
      name: "description",
      type: "richText",
      localized: true,
      label: {
        en: "Full Description",
        ar: "الوصف الكامل",
      },
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "media",
      label: {
        en: "Service Icon",
        ar: "أيقونة الخدمة",
      },
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      label: {
        en: "Service Image",
        ar: "صورة الخدمة",
      },
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
      label: {
        en: "Featured on Homepage",
        ar: "مميز في الصفحة الرئيسية",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "active",
      options: [
        { label: { en: "Available", ar: "متاح" }, value: "active" },
        {
          label: { en: "Coming Soon", ar: "قريباً" },
          value: "under-development",
        },
      ],
      admin: {
        position: "sidebar",
      },
      label: {
        en: "Availability",
        ar: "التوفر",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
      },
      label: {
        en: "Display Order",
        ar: "ترتيب العرض",
      },
    },
  ],
};
