import { CollectionConfig } from "payload";

import { isAdminOrEditor } from "../access/roles";
import { bilingualLabel } from "../lib/cms/labels";

export const FAQs: CollectionConfig = {
  slug: "faqs",
  labels: {
    singular: bilingualLabel("FAQ", "سؤال شائع"),
    plural: bilingualLabel("FAQs", "الأسئلة الشائعة"),
  },
  admin: {
    useAsTitle: "questionEn",
    defaultColumns: ["questionEn", "questionAr", "category", "order"],
    description: {
      en: "Enter English and Arabic content in the tabs below.",
      ar: "أدخل المحتوى بالإنجليزية والعربية من التبويبات أدناه.",
    },
    group: {
      en: "Website",
      ar: "الموقع",
    },
    listSearchableFields: ["questionEn", "questionAr"],
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
          label: {
            en: "English",
            ar: "الإنجليزية",
          },
          fields: [
            {
              name: "questionEn",
              type: "text",
              required: true,
              label: bilingualLabel("Question (English)", "السؤال (إنجليزي)"),
            },
            {
              name: "answerEn",
              type: "richText",
              required: true,
              label: bilingualLabel("Answer (English)", "الإجابة (إنجليزي)"),
            },
          ],
        },
        {
          label: {
            en: "Arabic",
            ar: "العربية",
          },
          fields: [
            {
              name: "questionAr",
              type: "text",
              required: true,
              label: bilingualLabel("Question (Arabic)", "السؤال (عربي)"),
            },
            {
              name: "answerAr",
              type: "richText",
              required: true,
              label: bilingualLabel("Answer (Arabic)", "الإجابة (عربي)"),
            },
          ],
        },
      ],
    },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "general",
      options: [
        { label: bilingualLabel("General", "عام"), value: "general" },
        {
          label: bilingualLabel("Health Insurance", "التأمين الصحي"),
          value: "health",
        },
        {
          label: bilingualLabel("Motor Insurance", "تأمين السيارات"),
          value: "motor",
        },
        {
          label: bilingualLabel("Fire Insurance", "تأمين الحريق"),
          value: "fire",
        },
        {
          label: bilingualLabel("Personal Accident", "الحوادث الشخصية"),
          value: "accident",
        },
      ],
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Category", "التصنيف"),
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
