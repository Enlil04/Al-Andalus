import { GlobalConfig } from "payload";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  admin: {
    description: "محتوى صفحة من نحن (About Us Page)",
    group: {
      en: "Website",
      ar: "الموقع",
    },
  },
  fields: [
    {
      name: "heroTitle",
      type: "text",
      localized: true,
      label: {
        en: "Page Title",
        ar: "عنوان الصفحة",
      },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      label: {
        en: "Hero Image",
        ar: "صورة البانر",
      },
    },
    {
      name: "intro",
      type: "richText",
      localized: true,
      label: {
        en: "Introduction",
        ar: "المقدمة",
      },
    },
    {
      name: "mission",
      type: "richText",
      localized: true,
      label: {
        en: "Mission",
        ar: "الرسالة",
      },
    },
    {
      name: "vision",
      type: "richText",
      localized: true,
      label: {
        en: "Vision",
        ar: "الرؤية",
      },
    },
    {
      name: "values",
      type: "array",
      label: {
        en: "Core Values",
        ar: "القيم الأساسية",
      },
      fields: [
        {
          name: "title",
          type: "text",
          localized: true,
          label: { en: "Value Title", ar: "عنوان القيمة" },
        },
        {
          name: "description",
          type: "textarea",
          localized: true,
          label: { en: "Description", ar: "الوصف" },
        },
      ],
    },
    {
      name: "history",
      type: "richText",
      localized: true,
      label: {
        en: "Company History",
        ar: "تاريخ الشركة",
      },
    },
    {
      name: "leadership",
      type: "array",
      label: {
        en: "Leadership Team",
        ar: "فريق القيادة",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          label: { en: "Name", ar: "الاسم" },
        },
        {
          name: "role",
          type: "text",
          localized: true,
          label: { en: "Role", ar: "المنصب" },
        },
        {
          name: "photo",
          type: "upload",
          relationTo: "media",
          label: { en: "Photo", ar: "الصورة" },
        },
        {
          name: "bio",
          type: "textarea",
          localized: true,
          label: { en: "Bio", ar: "نبذة" },
        },
      ],
    },
  ],
};
