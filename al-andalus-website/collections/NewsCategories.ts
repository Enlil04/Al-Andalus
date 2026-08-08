import { CollectionConfig } from "payload";

import { isAdminOrEditor } from "../access/roles";
import { bilingualLabel } from "../lib/cms/labels";
import { slugify } from "../lib/cms/format";

export const NewsCategories: CollectionConfig = {
  slug: "news-categories",
  labels: {
    singular: bilingualLabel("Blog Category", "تصنيف المدونة"),
    plural: bilingualLabel("Blog Categories", "تصنيفات المدونة"),
  },
  admin: {
    useAsTitle: "nameEn",
    defaultColumns: ["nameEn", "nameAr", "slug", "order"],
    description: {
      en: "Categories for blog posts. Add new ones here — they appear in the Category dropdown when creating articles.",
      ar: "تصنيفات مقالات المدونة. أضف تصنيفات جديدة هنا — تظهر في قائمة التصنيف عند إنشاء المقالات.",
    },
    group: {
      en: "Blog",
      ar: "المدونة",
    },
    listSearchableFields: ["nameEn", "nameAr", "slug"],
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: { en: "English", ar: "الإنجليزية" },
          fields: [
            {
              name: "nameEn",
              type: "text",
              required: true,
              label: bilingualLabel("Name (English)", "الاسم (إنجليزي)"),
            },
          ],
        },
        {
          label: { en: "Arabic", ar: "العربية" },
          fields: [
            {
              name: "nameAr",
              type: "text",
              required: true,
              label: bilingualLabel("Name (Arabic)", "الاسم (عربي)"),
            },
          ],
        },
      ],
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description: {
          en: "Short code used internally (e.g. company, motor). Auto-filled from the English name if left blank on create.",
          ar: "رمز قصير للاستخدام الداخلي (مثل company أو motor). يُملأ تلقائياً من الاسم الإنجليزي إن تُرك فارغاً عند الإنشاء.",
        },
      },
      label: bilingualLabel("Slug", "المعرّف"),
      hooks: {
        beforeValidate: [
          ({ value, data, operation }) => {
            if (value && String(value).trim()) {
              return slugify(String(value).trim());
            }
            if (operation === "create" && data?.nameEn) {
              return slugify(String(data.nameEn));
            }
            return value;
          },
        ],
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: {
          en: "Lower numbers appear first in the category list.",
          ar: "الأرقام الأصغر تظهر أولاً في قائمة التصنيفات.",
        },
      },
      label: bilingualLabel("Order", "الترتيب"),
    },
  ],
};
