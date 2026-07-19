import path from "path";
import { CollectionConfig } from "payload";
import { isAdmin, isAdminOrEditor } from "../access/roles";
import { bilingualLabel } from "../lib/cms/labels";

// Stored OUTSIDE `public/` so Next never serves these files statically.
// They are only reachable through Payload's access-controlled file API
// (/api/documents/file/...) or the token-gated proposal route.
const documentsDir = path.resolve(process.cwd(), "private-media");

export const Documents: CollectionConfig = {
  slug: "documents",
  labels: {
    singular: bilingualLabel("Document", "مستند"),
    plural: bilingualLabel("Documents", "المستندات"),
  },
  access: {
    // Private files: CVs, proposal PDFs. Staff only.
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  upload: {
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    staticDir: documentsDir,
    // Same proxy-related safe-fetch issue as Media; see comment there.
    skipSafeFetch: true,
  },
  admin: {
    useAsTitle: "title",
    description: {
      en: "Private documents (CVs, proposal PDFs). Not publicly accessible.",
      ar: "مستندات خاصة (السير الذاتية، ملفات العروض). غير متاحة للعموم.",
    },
    group: {
      en: "Media",
      ar: "الوسائط",
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: bilingualLabel("Title", "العنوان"),
    },
  ],
};
