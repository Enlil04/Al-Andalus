import { CollectionConfig } from "payload";

import { isAdmin, isAdminOrEditor } from "../access/roles";
import { bilingualLabel } from "../lib/cms/labels";

export const Jobs: CollectionConfig = {
  slug: "jobs",
  labels: {
    singular: bilingualLabel("Job", "وظيفة"),
    plural: bilingualLabel("Jobs", "الوظائف"),
  },
  admin: {
    useAsTitle: "titleEn",
    defaultColumns: ["titleEn", "titleAr", "departmentEn", "status"],
    description: {
      en: "Job openings. Enter English and Arabic in the language tabs below.",
      ar: "الوظائف الشاغرة. أدخل الإنجليزية والعربية من تبويبات اللغة أدناه.",
    },
    group: {
      en: "Careers",
      ar: "الوظائف",
    },
    listSearchableFields: ["titleEn", "titleAr", "departmentEn", "departmentAr", "locationEn", "locationAr"],
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
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
              label: bilingualLabel("Job Title (English)", "المسمى الوظيفي (إنجليزي)"),
            },
            {
              name: "departmentEn",
              type: "text",
              required: true,
              label: bilingualLabel("Department (English)", "القسم (إنجليزي)"),
            },
            {
              name: "locationEn",
              type: "text",
              required: true,
              label: bilingualLabel("Location (English)", "الموقع (إنجليزي)"),
            },
            {
              name: "descriptionEn",
              type: "richText",
              required: true,
              label: bilingualLabel("Job Description (English)", "وصف الوظيفة (إنجليزي)"),
            },
            {
              name: "requirementsEn",
              type: "richText",
              label: bilingualLabel("Requirements (English)", "المتطلبات (إنجليزي)"),
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
              label: bilingualLabel("Job Title (Arabic)", "المسمى الوظيفي (عربي)"),
            },
            {
              name: "departmentAr",
              type: "text",
              required: true,
              label: bilingualLabel("Department (Arabic)", "القسم (عربي)"),
            },
            {
              name: "locationAr",
              type: "text",
              required: true,
              label: bilingualLabel("Location (Arabic)", "الموقع (عربي)"),
            },
            {
              name: "descriptionAr",
              type: "richText",
              required: true,
              label: bilingualLabel("Job Description (Arabic)", "وصف الوظيفة (عربي)"),
            },
            {
              name: "requirementsAr",
              type: "richText",
              label: bilingualLabel("Requirements (Arabic)", "المتطلبات (عربي)"),
            },
          ],
        },
      ],
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("URL Slug", "رابط الوظيفة"),
    },
    {
      name: "employmentType",
      type: "select",
      required: true,
      defaultValue: "full-time",
      options: [
        { label: bilingualLabel("Full Time", "دوام كامل"), value: "full-time" },
        { label: bilingualLabel("Part Time", "دوام جزئي"), value: "part-time" },
        { label: bilingualLabel("Contract", "عقد"), value: "contract" },
        { label: bilingualLabel("Internship", "تدريب"), value: "internship" },
      ],
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Employment Type", "نوع التوظيف"),
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "open",
      options: [
        { label: bilingualLabel("Open", "مفتوحة"), value: "open" },
        { label: bilingualLabel("Closed", "مغلقة"), value: "closed" },
      ],
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Status", "الحالة"),
    },
  ],
};
