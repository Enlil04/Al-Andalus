import { CollectionConfig } from "payload";

import { isAdmin, isAdminOrEditor } from "../access/roles";

export const Jobs: CollectionConfig = {
  slug: "jobs",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "department", "location", "status"],
    description: "الوظائف الشاغرة (Job Openings)",
    group: {
      en: "Careers",
      ar: "الوظائف",
    },
    listSearchableFields: ["title", "department", "location"],
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      label: {
        en: "Job Title",
        ar: "المسمى الوظيفي",
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
        ar: "رابط الوظيفة",
      },
    },
    {
      name: "department",
      type: "text",
      required: true,
      label: {
        en: "Department",
        ar: "القسم",
      },
    },
    {
      name: "location",
      type: "text",
      required: true,
      label: {
        en: "Location",
        ar: "الموقع",
      },
    },
    {
      name: "employmentType",
      type: "select",
      required: true,
      defaultValue: "full-time",
      options: [
        { label: { en: "Full Time", ar: "دوام كامل" }, value: "full-time" },
        { label: { en: "Part Time", ar: "دوام جزئي" }, value: "part-time" },
        { label: { en: "Contract", ar: "عقد" }, value: "contract" },
        { label: { en: "Internship", ar: "تدريب" }, value: "internship" },
      ],
      admin: {
        position: "sidebar",
      },
      label: {
        en: "Employment Type",
        ar: "نوع التوظيف",
      },
    },
    {
      name: "description",
      type: "richText",
      required: true,
      localized: true,
      label: {
        en: "Job Description",
        ar: "وصف الوظيفة",
      },
    },
    {
      name: "requirements",
      type: "richText",
      localized: true,
      label: {
        en: "Requirements",
        ar: "المتطلبات",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "open",
      options: [
        { label: { en: "Open", ar: "مفتوحة" }, value: "open" },
        { label: { en: "Closed", ar: "مغلقة" }, value: "closed" },
      ],
      admin: {
        position: "sidebar",
      },
      label: {
        en: "Status",
        ar: "الحالة",
      },
    },
  ],
};
