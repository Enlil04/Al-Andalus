import { CollectionConfig } from "payload";

import { isAdmin, isAdminField, isAdminOrEditor } from "../access/roles";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    description: "مستخدمو لوحة التحكم (Dashboard Users)",
    group: {
      en: "System",
      ar: "النظام",
    },
  },
  access: {
    read: isAdminOrEditor,
    create: isAdmin,
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
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      label: {
        en: "Role",
        ar: "الصلاحية",
      },
      access: {
        update: isAdminField,
      },
    },
  ],
};
