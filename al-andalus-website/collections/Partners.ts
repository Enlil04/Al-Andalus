import { CollectionConfig } from "payload";

import { isAdminOrEditor } from "../access/roles";

export const Partners: CollectionConfig = {
  slug: "partners",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order"],
    description: "شركاء النجاح والعملاء (Partners & Clients Management)",
    group: {
      en: "Content",
      ar: "المحتوى",
    },
    listSearchableFields: ["name"],
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: {
        en: "Partner Name",
        ar: "اسم الشريك",
      },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      required: true,
      label: {
        en: "Logo",
        ar: "الشعار",
      },
    },
    {
      name: "website",
      type: "text",
      label: {
        en: "Website URL",
        ar: "رابط الموقع",
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
