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
    // Editors may read the users list (dashboard UI), but only admins can
    // create/delete accounts. Updates: admins can edit anyone; editors may
    // only edit their own profile — never another user's email/password.
    read: isAdminOrEditor,
    create: isAdmin,
    update: ({ req: { user } }) => {
      if (!user) return false;
      if ((user as { role?: string }).role === "admin") return true;
      return { id: { equals: user.id } };
    },
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
