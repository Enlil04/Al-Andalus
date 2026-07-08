import { CollectionConfig } from "payload";

import { isAdmin, isAdminOrEditor } from "../access/roles";

export const JobApplications: CollectionConfig = {
  slug: "job-applications",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "job", "status", "createdAt"],
    description: "طلبات التوظيف (Job Applications)",
    group: {
      en: "Careers",
      ar: "الوظائف",
    },
    listSearchableFields: ["fullName", "email", "phone"],
  },
  access: {
    read: isAdminOrEditor,
    create: () => true,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: "job",
      type: "relationship",
      relationTo: "jobs",
      required: true,
      label: {
        en: "Job Opening",
        ar: "الوظيفة",
      },
    },
    {
      name: "fullName",
      type: "text",
      required: true,
      label: {
        en: "Full Name",
        ar: "الاسم الكامل",
      },
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: {
        en: "Email",
        ar: "البريد الإلكتروني",
      },
    },
    {
      name: "phone",
      type: "text",
      required: true,
      label: {
        en: "Phone Number",
        ar: "رقم الهاتف",
      },
    },
    {
      name: "coverLetter",
      type: "textarea",
      label: {
        en: "Cover Letter",
        ar: "رسالة التقديم",
      },
    },
    {
      name: "cv",
      type: "upload",
      relationTo: "media",
      required: true,
      label: {
        en: "CV / Resume",
        ar: "السيرة الذاتية",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: { en: "New", ar: "جديد" }, value: "new" },
        { label: { en: "Reviewed", ar: "تمت المراجعة" }, value: "reviewed" },
        { label: { en: "Shortlisted", ar: "القائمة المختصرة" }, value: "shortlisted" },
        { label: { en: "Rejected", ar: "مرفوض" }, value: "rejected" },
        { label: { en: "Hired", ar: "تم التوظيف" }, value: "hired" },
      ],
      admin: {
        position: "sidebar",
      },
      label: {
        en: "Application Status",
        ar: "حالة الطلب",
      },
    },
    {
      name: "adminNotes",
      type: "textarea",
      admin: {
        position: "sidebar",
      },
      label: {
        en: "Admin Notes",
        ar: "ملاحظات الإدارة",
      },
    },
  ],
};
