import { CollectionConfig } from "payload";

import { isAdmin, isAdminOrEditor } from "../access/roles";
import { bilingualLabel } from "../lib/cms/labels";

export const JobApplications: CollectionConfig = {
  slug: "job-applications",
  labels: {
    singular: bilingualLabel("Job Application", "طلب توظيف"),
    plural: bilingualLabel("Job Applications", "طلبات التوظيف"),
  },
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "job", "status", "createdAt"],
    description: {
      en: "Incoming job applications from the website (applicant-submitted; not bilingual content).",
      ar: "طلبات التوظيف الواردة من الموقع (بيانات مقدّم الطلب؛ ليست محتوى ثنائي اللغة).",
    },
    group: {
      en: "Careers",
      ar: "الوظائف",
    },
    listSearchableFields: ["fullName", "email", "phone"],
  },
  access: {
    read: isAdminOrEditor,
    // Public creates go through /api/careers/apply (overrideAccess + rate limit).
    create: () => false,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: "job",
      type: "relationship",
      relationTo: "jobs",
      required: true,
      label: bilingualLabel("Job Opening", "الوظيفة"),
    },
    {
      name: "fullName",
      type: "text",
      required: true,
      label: bilingualLabel("Full Name", "الاسم الكامل"),
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: bilingualLabel("Email", "البريد الإلكتروني"),
    },
    {
      name: "phone",
      type: "text",
      required: true,
      label: bilingualLabel("Phone Number", "رقم الهاتف"),
    },
    {
      name: "coverLetter",
      type: "textarea",
      label: bilingualLabel("Cover Letter", "رسالة التقديم"),
    },
    {
      name: "cv",
      type: "upload",
      relationTo: "media",
      required: true,
      label: bilingualLabel("CV / Resume", "السيرة الذاتية"),
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: bilingualLabel("New", "جديد"), value: "new" },
        { label: bilingualLabel("Reviewed", "تمت المراجعة"), value: "reviewed" },
        {
          label: bilingualLabel("Shortlisted", "القائمة المختصرة"),
          value: "shortlisted",
        },
        { label: bilingualLabel("Rejected", "مرفوض"), value: "rejected" },
        { label: bilingualLabel("Hired", "تم التوظيف"), value: "hired" },
      ],
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Application Status", "حالة الطلب"),
    },
    {
      name: "adminNotes",
      type: "textarea",
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Admin Notes", "ملاحظات الإدارة"),
    },
  ],
};
