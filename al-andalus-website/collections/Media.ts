import path from "path";
import { CollectionConfig } from "payload";
import { isAdminOrEditor } from "../access/roles";
import { bilingualFieldHint, bilingualLabel } from "../lib/cms/labels";

const mediaDir = path.resolve(process.cwd(), "public/media");

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    // Public marketing media only. Private files (CVs, proposal PDFs) live in
    // the `documents` collection, stored outside `public/`.
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  upload: {
    mimeTypes: ["image/*", "video/*"],
    // Absolute path so Hostinger volume mounts resolve correctly regardless of cwd.
    staticDir: mediaDir,
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 512,
        position: "centre",
      },
      {
        name: "hero",
        width: 1920,
        height: undefined,
        position: "centre",
      },
    ],
  },
  admin: {
    useAsTitle: "alt",
    description: "الصور والفيديوهات (Images & Videos)",
    group: {
      en: "Media",
      ar: "الوسائط",
    },
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
      label: bilingualLabel("Alt Text", "النص البديل"),
      admin: {
        description: bilingualFieldHint,
      },
    },
  ],
};
