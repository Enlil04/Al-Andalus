import path from "path";
import { CollectionConfig } from "payload";
import { isAdminOrEditor } from "../access/roles";
import { bilingualFieldHint, bilingualLabel } from "../lib/cms/labels";

const mediaDir = path.resolve(process.cwd(), "public/media");

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    // Public can read images/videos for the marketing site.
    // PDFs (CVs, proposals) require staff — serve proposals via /api/proposals/[token]/file.
    read: ({ req }) => {
      if (isAdminOrEditor({ req })) return true;
      return {
        or: [
          { mimeType: { contains: "image/" } },
          { mimeType: { contains: "video/" } },
        ],
      };
    },
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  upload: {
    mimeTypes: ["image/*", "video/*", "application/pdf"],
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
