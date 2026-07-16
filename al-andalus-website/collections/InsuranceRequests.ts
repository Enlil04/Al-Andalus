import type { CollectionConfig, Endpoint } from "payload";

import { isAdmin, isAdminOrEditor } from "../access/roles";
import { exportInsuranceRequestsCSV, exportInsuranceRequestsPDF } from "../lib/exportInsuranceRequests";
import { bilingualLabel } from "../lib/cms/labels";

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
  labels: {
    singular: bilingualLabel("Insurance Request", "طلب تأمين"),
    plural: bilingualLabel("Insurance Requests", "طلبات التأمين"),
  },
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
    // Public creates go through /api/insurance-requests (overrideAccess + rate limit).
    create: () => false,
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
      label: bilingualLabel("Reference #", "رقم المرجع"),
    },
    {
      name: "fullName",
      type: "text",
      required: true,
      label: bilingualLabel("Full Name", "الاسم الكامل"),
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: bilingualLabel("Email", "البريد الإلكتروني"),
    },
    {
      name: "phone",
      type: "text",
      required: true,
      label: bilingualLabel("Phone Number", "رقم الهاتف"),
    },
    {
      name: "insuranceService",
      type: "relationship",
      relationTo: "products",
      required: true,
      label: bilingualLabel("Insurance Service", "الخدمة التأمينية"),
    },
    {
      name: "city",
      type: "text",
      label: bilingualLabel("City", "المدينة"),
    },
    {
      name: "details",
      type: "textarea",
      label: bilingualLabel("Additional Details", "تفاصيل إضافية"),
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: bilingualLabel("New", "جديد"), value: "new" },
        { label: bilingualLabel("In Review", "قيد المراجعة"), value: "in-review" },
        { label: bilingualLabel("Approved", "موافق عليه"), value: "approved" },
        { label: bilingualLabel("Rejected", "مرفوض"), value: "rejected" },
        { label: bilingualLabel("Completed", "مكتمل"), value: "completed" },
      ],
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Status", "الحالة"),
    },
    {
      name: "adminNotes",
      type: "textarea",
      admin: {
        position: "sidebar",
      },
      label: bilingualLabel("Admin Notes", "ملاحظات الإدارة"),
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
