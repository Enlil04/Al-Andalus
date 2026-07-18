import { CollectionConfig } from "payload";
import { isAdmin, isAdminOrEditor } from "../access/roles";
import crypto from "crypto";
import { bilingualFieldHint, bilingualLabel } from "../lib/cms/labels";

export const Proposals: CollectionConfig = {
  slug: "proposals",
  labels: {
    singular: bilingualLabel("Proposal", "عرض"),
    plural: bilingualLabel("Proposals", "العروض"),
  },
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
    // Public access only via token-gated page / file routes (overrideAccess).
    read: isAdminOrEditor,
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
      localized: true,
      label: bilingualLabel("Company / Proposal Title", "اسم الشركة / عنوان العرض"),
      admin: {
        description: bilingualFieldHint,
      },
    },
    {
      name: "pdf",
      type: "upload",
      relationTo: "documents",
      required: true,
      label: bilingualLabel("Proposal PDF Document", "ملف العرض (PDF)"),
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
        description: bilingualFieldHint,
      },
      label: bilingualLabel("Share Link", "رابط المشاركة الآمن"),
    },
    {
      name: "status",
      type: "select",
      defaultValue: "active",
      required: true,
      options: [
        {
          label: bilingualLabel("Draft", "مسودة"),
          value: "draft",
        },
        {
          label: bilingualLabel("Active", "نشط"),
          value: "active",
        },
        {
          label: bilingualLabel("Archived", "مؤرشف"),
          value: "archived",
        },
      ],
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Status", "الحالة"),
    },
  ],
};
