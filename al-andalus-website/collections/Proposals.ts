import { CollectionConfig } from "payload";
import { isAdmin, isAdminOrEditor } from "../access/roles";
import crypto from "crypto";

export const Proposals: CollectionConfig = {
  slug: "proposals",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "createdAt"],
    description: "عروض الأسعار والاتفاقيات المشتركة (Shared Proposals & Agreements)",
    group: {
      en: "Business",
      ar: "الأعمال",
    },
  },
  access: {
    read: () => true, // Publicly readable for clients holding the link
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === "create") {
          const secureToken = crypto.randomUUID();
          return {
            ...data,
            token: secureToken,
          };
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: {
        en: "Company / Proposal Title",
        ar: "اسم الشركة / عنوان العرض",
      },
    },
    {
      name: "pdf",
      type: "upload",
      relationTo: "media",
      required: true,
      label: {
        en: "Proposal PDF Document",
        ar: "ملف العرض (PDF)",
      },
    },
    {
      name: "token",
      type: "text",
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        components: {
          Field: "./components/dashboard/ShareLinkField.tsx#default",
        },
        description: {
          en: "Secure unique link token. Automatically generated on save.",
          ar: "رمز الرابط الآمن الفريد. يتم إنشاؤه تلقائياً عند الحفظ.",
        },
      },
      label: {
        en: "Share Link",
        ar: "رابط المشاركة الآمن",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "active",
      required: true,
      options: [
        {
          label: { en: "Draft", ar: "مسودة" },
          value: "draft",
        },
        {
          label: { en: "Active", ar: "نشط" },
          value: "active",
        },
        {
          label: { en: "Archived", ar: "مؤرشف" },
          value: "archived",
        },
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
