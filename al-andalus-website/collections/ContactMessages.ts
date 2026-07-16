import { CollectionConfig } from "payload";

import { isAdmin, isAdminOrEditor } from "../access/roles";
import { bilingualLabel } from "../lib/cms/labels";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  labels: {
    singular: bilingualLabel("Contact Message", "رسالة تواصل"),
    plural: bilingualLabel("Contact Messages", "رسائل التواصل"),
  },
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["name", "email", "subject", "isRead", "createdAt"],
    description: "رسائل الزوار (Contact Form Submissions)",
    group: {
      en: "Communication",
      ar: "التواصل",
    },
  },
  access: {
    read: isAdminOrEditor,
    // Public creates go through /api/contact (overrideAccess + rate limit).
    create: () => false,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: "name",
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
      label: bilingualLabel("Phone Number", "رقم الهاتف"),
    },
    {
      name: "subject",
      type: "text",
      required: true,
      label: bilingualLabel("Subject", "الموضوع"),
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      label: bilingualLabel("Message", "الرسالة"),
    },
    {
      name: "isRead",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Read", "مقروءة"),
    },
  ],
};
