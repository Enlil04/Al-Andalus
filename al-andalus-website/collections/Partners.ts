import { CollectionConfig } from "payload";

import { isAdminOrEditor } from "../access/roles";
import {
  bilingualFieldHint,
  bilingualLabel,
  mediaFieldHint,
} from "../lib/cms/labels";

export const Partners: CollectionConfig = {
  slug: "partners",
  labels: {
    singular: bilingualLabel("Partner", "شريك"),
    plural: bilingualLabel("Partners", "الشركاء"),
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order"],
    description: {
      en: `Partners & clients. ${bilingualFieldHint.en}`,
      ar: `شركاء النجاح والعملاء. ${bilingualFieldHint.ar}`,
    },
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
      localized: true,
      label: bilingualLabel("Partner Name", "اسم الشريك"),
      admin: {
        description: bilingualFieldHint,
      },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
      required: true,
      label: bilingualLabel("Logo", "الشعار"),
      admin: {
        description: mediaFieldHint(
          "this partner's logo on the homepage and Partners page",
          "شعار هذا الشريك في الصفحة الرئيسية وصفحة الشركاء",
          "transparent PNG/SVG, wide format, at least 800px",
          "PNG/SVG شفاف وعريض وبحجم لا يقل عن 800 بكسل",
        ),
      },
    },
    {
      name: "website",
      type: "text",
      label: bilingualLabel("Website URL", "رابط الموقع"),
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Display Order", "ترتيب العرض"),
    },
  ],
};
