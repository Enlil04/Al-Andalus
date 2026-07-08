import { CollectionConfig } from "payload";

import { isAdmin, isAdminOrEditor } from "../access/roles";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
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
    create: () => true,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: "name",
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
      label: {
        en: "Phone Number",
        ar: "رقم الهاتف",
      },
    },
    {
      name: "subject",
      type: "text",
      required: true,
      label: {
        en: "Subject",
        ar: "الموضوع",
      },
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      label: {
        en: "Message",
        ar: "الرسالة",
      },
    },
    {
      name: "isRead",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
      label: {
        en: "Read",
        ar: "مقروءة",
      },
    },
  ],
};
