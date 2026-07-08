import type { CollectionConfig, Endpoint } from "payload";

import { isAdmin, isAdminOrEditor } from "../access/roles";
import { exportInsuranceRequestsCSV, exportInsuranceRequestsPDF } from "../lib/exportInsuranceRequests";

const exportEndpoints: Omit<Endpoint, "root">[] = [
  {
    path: "/export/csv",
    method: "get",
    handler: exportInsuranceRequestsCSV,
  },
  {
    path: "/export/pdf",
    method: "get",
    handler: exportInsuranceRequestsPDF,
  },
];

export const InsuranceRequests: CollectionConfig = {
  slug: "insurance-requests",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "insuranceService", "status", "createdAt"],
    description: "طلبات التأمين (Insurance Requests)",
    group: {
      en: "Insurance",
      ar: "التأمين",
    },
    listSearchableFields: ["fullName", "email", "phone", "referenceNumber"],
    components: {
      beforeListTable: [
        "./components/admin/InsuranceRequestsExport.tsx#InsuranceRequestsExport",
      ],
    },
  },
  access: {
    read: isAdminOrEditor,
    create: () => true,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  endpoints: exportEndpoints,
  fields: [
    {
      name: "referenceNumber",
      type: "text",
      unique: true,
      admin: {
        readOnly: true,
        position: "sidebar",
      },
      label: {
        en: "Reference #",
        ar: "رقم المرجع",
      },
    },
    {
      name: "fullName",
      type: "text",
      required: true,
      label: {
        en: "Full Name",
        ar: "الاسم الكامل",
      },
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: {
        en: "Email",
        ar: "البريد الإلكتروني",
      },
    },
    {
      name: "phone",
      type: "text",
      required: true,
      label: {
        en: "Phone Number",
        ar: "رقم الهاتف",
      },
    },
    {
      name: "insuranceService",
      type: "relationship",
      relationTo: "products",
      required: true,
      label: {
        en: "Insurance Service",
        ar: "الخدمة التأمينية",
      },
    },
    {
      name: "city",
      type: "text",
      label: {
        en: "City",
        ar: "المدينة",
      },
    },
    {
      name: "details",
      type: "textarea",
      label: {
        en: "Additional Details",
        ar: "تفاصيل إضافية",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: { en: "New", ar: "جديد" }, value: "new" },
        { label: { en: "In Review", ar: "قيد المراجعة" }, value: "in-review" },
        { label: { en: "Approved", ar: "موافق عليه" }, value: "approved" },
        { label: { en: "Rejected", ar: "مرفوض" }, value: "rejected" },
        { label: { en: "Completed", ar: "مكتمل" }, value: "completed" },
      ],
      admin: {
        position: "sidebar",
      },
      label: {
        en: "Status",
        ar: "الحالة",
      },
    },
    {
      name: "adminNotes",
      type: "textarea",
      admin: {
        position: "sidebar",
      },
      label: {
        en: "Admin Notes",
        ar: "ملاحظات الإدارة",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === "create" && !data.referenceNumber) {
          const timestamp = Date.now().toString(36).toUpperCase();
          data.referenceNumber = `REQ-${timestamp}`;
        }
        return data;
      },
    ],
  },
};
