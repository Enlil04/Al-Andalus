import { CollectionConfig } from "payload";

import { isAdminOrEditor } from "../access/roles";

export const BlogCategories: CollectionConfig = {
  slug: "blog-categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug"],
    description: "تصنيفات المدونة (Blog Categories)",
    group: {
      en: "Blog",
      ar: "المدونة",
    },
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
      localized: true,
      label: {
        en: "Category Name",
        ar: "اسم التصنيف",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: {
        en: "URL Slug",
        ar: "رابط التصنيف",
      },
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      label: {
        en: "Description",
        ar: "الوصف",
      },
    },
  ],
};
