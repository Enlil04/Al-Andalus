import { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    description: "إعدادات الموقع العامة (General Site Settings)",
    group: {
      en: "Website",
      ar: "الموقع",
    },
  },
  fields: [
    {
      name: "companyName",
      type: "text",
      required: true,
      localized: true,
      defaultValue: "Al-Andalus International Insurance",
      label: {
        en: "Company Name",
        ar: "اسم الشركة",
      },
    },
    {
      name: "heroText",
      type: "text",
      localized: true,
      defaultValue: "Protecting What Matters Most",
      label: {
        en: "Hero Headline",
        ar: "عنوان البانر الرئيسي",
      },
    },
    {
      name: "heroSubtext",
      type: "textarea",
      localized: true,
      label: {
        en: "Hero Subtext",
        ar: "النص الفرعي للبانر",
      },
    },
    {
      name: "heroVideo",
      type: "upload",
      relationTo: "media",
      label: {
        en: "Hero Background Video",
        ar: "فيديو خلفية البانر",
      },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      label: {
        en: "Hero Fallback Image",
        ar: "صورة بديلة للبانر",
      },
    },
    {
      type: "group",
      name: "contact",
      label: {
        en: "Contact Information",
        ar: "معلومات التواصل",
      },
      fields: [
        {
          name: "shortNumber",
          type: "text",
          defaultValue: "7366",
          label: {
            en: "Short Number",
            ar: "الرقم المختصر",
          },
        },
        {
          name: "phone",
          type: "text",
          defaultValue: "+9647710006000",
          label: {
            en: "Phone Number",
            ar: "رقم الهاتف",
          },
        },
        {
          name: "whatsapp",
          type: "text",
          defaultValue: "+9647710006000",
          label: {
            en: "WhatsApp Number",
            ar: "رقم الواتساب",
          },
        },
        {
          name: "email",
          type: "email",
          defaultValue: "info@alandalus-iq.com",
          label: {
            en: "Email",
            ar: "البريد الإلكتروني",
          },
        },
      ],
    },
    {
      type: "group",
      name: "analytics",
      label: {
        en: "Website Analytics",
        ar: "إحصائيات الموقع",
      },
      fields: [
        {
          name: "monthlyVisitors",
          type: "number",
          defaultValue: 0,
          label: {
            en: "Monthly Visitors",
            ar: "زوار الشهر",
          },
          admin: {
            description: {
              en: "Update manually or connect analytics later",
              ar: "حدّث يدوياً أو اربط التحليلات لاحقاً",
            },
          },
        },
        {
          name: "totalVisitors",
          type: "number",
          defaultValue: 0,
          label: {
            en: "Total Visitors",
            ar: "إجمالي الزوار",
          },
        },
      ],
    },
    {
      type: "group",
      name: "socialLinks",
      label: {
        en: "Social Media Links",
        ar: "روابط التواصل الاجتماعي",
      },
      fields: [
        {
          name: "facebook",
          type: "text",
          label: "Facebook",
        },
        {
          name: "instagram",
          type: "text",
          label: "Instagram",
        },
        {
          name: "linkedin",
          type: "text",
          label: "LinkedIn",
        },
        {
          name: "tiktok",
          type: "text",
          label: "TikTok",
        },
        {
          name: "whatsappLink",
          type: "text",
          label: "WhatsApp Link",
        },
      ],
    },
  ],
};
