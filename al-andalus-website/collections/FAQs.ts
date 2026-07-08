import { CollectionConfig } from "payload";

import { isAdminOrEditor } from "../access/roles";

export const FAQs: CollectionConfig = {
  slug: "faqs",
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "category", "order"],
    description: "الأسئلة الشائعة (FAQ Management)",
    group: {
      en: "Website",
      ar: "الموقع",
    },
    listSearchableFields: ["question"],
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: "question",
      type: "text",
      required: true,
      localized: true,
      label: {
        en: "Question",
        ar: "السؤال",
      },
    },
    {
      name: "answer",
      type: "richText",
      required: true,
      localized: true,
      label: {
        en: "Answer",
        ar: "الإجابة",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "general",
      options: [
        { label: { en: "General", ar: "عام" }, value: "general" },
        { label: { en: "Health Insurance", ar: "التأمين الصحي" }, value: "health" },
        { label: { en: "Motor Insurance", ar: "تأمين السيارات" }, value: "motor" },
        { label: { en: "Fire Insurance", ar: "تأمين الحريق" }, value: "fire" },
        { label: { en: "Personal Accident", ar: "الحوادث الشخصية" }, value: "accident" },
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
