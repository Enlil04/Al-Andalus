export type ServiceCategoryId = "personal" | "business" | "industrial" | "financial";

export type ServiceCategory = {
  id: ServiceCategoryId;
  label: string;
};

export const serviceCategoriesEn: ServiceCategory[] = [
  { id: "personal", label: "Personal" },
  { id: "business", label: "Business" },
  { id: "industrial", label: "Industrial" },
  { id: "financial", label: "Financial" },
];

export const serviceCategoriesAr: ServiceCategory[] = [
  { id: "personal", label: "شخصي" },
  { id: "business", label: "أعمال" },
  { id: "industrial", label: "صناعي" },
  { id: "financial", label: "مالي" },
];

export function getServiceCategories(locale: string): ServiceCategory[] {
  return locale === "ar" ? serviceCategoriesAr : serviceCategoriesEn;
}

export type Service = {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: ServiceCategoryId;
  underDevelopment?: boolean;
};

export const servicesEn: Service[] = [
  {
    slug: "cargo",
    title: "Cargo Insurance",
    subtitle: "Marine / Land / Air",
    description:
      "Goods in transit face risks at every stage. Cargo insurance covers loss or damage to goods moving by sea, road, or air.",
    category: "industrial",
  },
  {
    slug: "engineering",
    title: "Engineering Insurance",
    subtitle: "Contractors' All Risks",
    description:
      "Construction projects do not pause for accidents. Contractors' All Risks covers projects, machinery, and equipment against accidental damage during execution.",
    category: "industrial",
  },
  {
    slug: "glass",
    title: "Glass Insurance",
    description:
      "Glass facades and storefront panels are costly to replace. This policy compensates for damage or breakage to glass panels, facades, and installations.",
    category: "business",
  },
  {
    slug: "burglary",
    title: "Burglary Insurance",
    description:
      "Theft and unlawful entry can wipe out inventory overnight. Burglary insurance protects property and assets against losses from theft, burglary, or break-in.",
    category: "business",
  },
  {
    slug: "bankers-blanket",
    title: "Bankers Blanket Insurance",
    description:
      "Integrated cover for financial institutions against operational and financial risks.",
    category: "financial",
    underDevelopment: true,
  },
  {
    slug: "cash-in-transit",
    title: "Cash in Transit & Safe",
    description:
      "Cash is most vulnerable when it moves. This policy covers cash during transport or in approved safes against theft, loss, and other covered perils.",
    category: "financial",
  },
  {
    slug: "public-liability",
    title: "Public Liability Insurance",
    description:
      "If your operations cause injury or property damage to a third party, the costs add up fast. Public liability insurance protects against legal liabilities arising from such incidents.",
    category: "business",
  },
  {
    slug: "fire",
    title: "Fire Insurance",
    description:
      "Fire remains one of the most destructive risks for commercial property. Fire insurance covers losses and damage from fire and related perils.",
    category: "business",
  },
  {
    slug: "fidelity-guarantee",
    title: "Fidelity Guarantee Insurance",
    description:
      "Employee dishonesty and fraud cause losses that standard property policies do not address. Fidelity guarantee insurance protects against financial loss from breach of trust.",
    category: "business",
  },
  {
    slug: "motor",
    title: "Motor Insurance",
    description:
      "Vehicles are essential across Iraq — and accidents create costs that add up fast. Motor insurance covers accidents, physical damage, and legal liabilities.",
    category: "personal",
  },
  {
    slug: "health",
    title: "Health Insurance",
    description:
      "Major medical procedures carry costs most families cannot absorb alone. Health insurance covers hospitalization, surgery, diagnostics, and related treatment expenses.",
    category: "personal",
  },
  {
    slug: "loan-protection",
    title: "Loan Protection Insurance",
    description:
      "Financial protection to help cover loan obligations when covered risks occur.",
    category: "financial",
    underDevelopment: true,
  },
  {
    slug: "travel",
    title: "Travel Insurance",
    description:
      "Travel involves risks you cannot fully control — medical emergencies abroad, lost baggage, accidents. Travel insurance covers these so a disrupted trip does not become a financial crisis.",
    category: "personal",
  },
  {
    slug: "medical-malpractice",
    title: "Medical Malpractice Insurance",
    description:
      "Healthcare professionals face professional liability exposure every working day. Medical malpractice insurance protects against claims arising from professional negligence or errors.",
    category: "industrial",
  },
  {
    slug: "hull",
    title: "Hull Insurance",
    description:
      "Vessels and their equipment represent significant capital at sea. Hull insurance covers physical loss or damage to vessels and associated marine equipment.",
    category: "industrial",
  },
  {
    slug: "cyber",
    title: "Cyber Insurance",
    description:
      "Protection against losses from cyberattacks, data breaches, and related incidents.",
    category: "financial",
    underDevelopment: true,
  },
];

export const servicesAr: Service[] = [
  {
    slug: "cargo",
    title: "تأمين نقل البضائع",
    subtitle: "بحري / بري / جوي",
    description:
      "تتعرض البضائع أثناء النقل لمخاطر في كل مرحلة. يغطي تأمين الشحن الخسائر أو الأضرار التي تلحق بالبضائع المنقولة بحراً أو براً أو جواً.",
    category: "industrial",
  },
  {
    slug: "engineering",
    title: "التأمين الهندسي",
    subtitle: "جميع أخطار المقاولين",
    description:
      "المشاريع الإنشائية لا تتوقف بسبب الحوادث. يغطي تأمين جميع أخطار المقاولين المشاريع والمعدات والآلات ضد الأضرار العرضية أثناء التنفيذ.",
    category: "industrial",
  },
  {
    slug: "glass",
    title: "تأمين الألواح الزجاجية",
    description:
      "تكلفة استبدال الواجهات الزجاجية مرتفعة للغاية. تعوض هذه الوثيقة الأضرار أو الكسر الذي يصيب الواجهات والألواح والتركيبات الزجاجية.",
    category: "business",
  },
  {
    slug: "burglary",
    title: "تأمين السرقة",
    description:
      "قد تؤدي السرقة والدخول غير القانوني إلى فقدان المخزون في ليلة واحدة. يحمي تأمين السرقة الممتلكات والأصول من الخسائر الناتجة عن السطو.",
    category: "business",
  },
  {
    slug: "bankers-blanket",
    title: "التأمين المصرفي الشامل",
    description:
      "حلول تأمينية متكاملة لحماية المؤسسات المصرفية من المخاطر التشغيلية والمالية المتنوعة.",
    category: "financial",
    underDevelopment: true,
  },
  {
    slug: "cash-in-transit",
    title: "تأمين نقل وحفظ النقد",
    description:
      "يكون النقد أكثر عرضة للمخاطر أثناء حركته. تغطي هذه الوثيقة النقد أثناء نقله أو في الخزائن المعتمدة ضد السرقة والفقدان.",
    category: "financial",
  },
  {
    slug: "public-liability",
    title: "تأمين المسؤولية المدنية",
    description:
      "إذا تسببت عملياتك في إصابة أو ضرر لممتلكات طرف ثالث، فإن التكاليف تتراكم بسرعة. يحميك تأمين المسؤولية المدنية من هذه المطالبات القانونية.",
    category: "business",
  },
  {
    slug: "fire",
    title: "تأمين الحريق",
    description:
      "يظل الحريق أحد أكثر المخاطر تدميراً للممتلكات التجارية. يعوض تأمين الحريق الخسائر والأضرار الناتجة عن الحرائق والأخطار المرتبطة بها.",
    category: "business",
  },
  {
    slug: "fidelity-guarantee",
    title: "تأمين ضمان الأمانة",
    description:
      "تسبب خيانة الأمانة والاحتيال خسائر لا تغطيها وثائق الممتلكات القياسية. يحمي هذا التأمين من الخسائر المالية الناتجة عن سوء أمانة الموظفين.",
    category: "business",
  },
  {
    slug: "motor",
    title: "تأمين السيارات",
    description:
      "تعتبر المركبات ضرورية في العراق، والحوادث تسبب تكاليف باهظة. يغطي تأمين السيارات الحوادث، الأضرار المادية، والمسؤوليات القانونية.",
    category: "personal",
  },
  {
    slug: "health",
    title: "التأمين الصحي",
    description:
      "تحمل العمليات الطبية الكبرى تكاليف لا تستطيع معظم الأسر تحملها بمفردها. يغطي التأمين الصحي الإقامة بالمستشفى، الجراحة، والتحاليل والعلاج.",
    category: "personal",
  },
  {
    slug: "loan-protection",
    title: "تأمين القروض",
    description:
      "حماية مالية تسهم في سداد الالتزامات المرتبطة بالقروض عند تحقق أي من المخاطر المشمولة بالوثيقة.",
    category: "financial",
    underDevelopment: true,
  },
  {
    slug: "travel",
    title: "تأمين السفر",
    description:
      "ينطوي السفر على مخاطر لا يمكن التحكم بها كالحالات الطبية الطارئة أو فقدان الأمتعة. يغطي تأمين السفر هذه الحالات لضمان راحة بالك.",
    category: "personal",
  },
  {
    slug: "medical-malpractice",
    title: "تأمين الأخطاء الطبية",
    description:
      "يواجه ممارسو الرعاية الصحية مخاطر المسؤولية المهنية يومياً. يحمي تأمين الأخطاء الطبية من المطالبات الناتجة عن الإهمال أو الخطأ المهني.",
    category: "industrial",
  },
  {
    slug: "hull",
    title: "تأمين بدن السفن",
    description:
      "تمثل السفن ومعداتها البحرية رأس مال كبير في عرض البحر. يغطي تأمين بدن السفن الخسائر أو الأضرار المادية التي تلحق بها وبمعداتها.",
    category: "industrial",
  },
  {
    slug: "cyber",
    title: "تأمين الأمن السيبراني",
    description:
      "حماية شاملة ضد الخسائر الناتجة عن الهجمات الإلكترونية، واختراق البيانات، والحوادث المتعلقة بالأنظمة الرقمية.",
    category: "financial",
    underDevelopment: true,
  },
];

export const featuredServiceSlugs = [
  "travel",
  "fidelity-guarantee",
  "engineering",
  "health",
  "motor",
  "cash-in-transit",
] as const;

/** Legacy CMS slugs from early seed scripts (e.g. motor-insurance → motor). */
const LEGACY_SERVICE_SLUGS: Record<string, string> = {
  "cargo-insurance": "cargo",
  "engineering-insurance": "engineering",
  "glass-insurance": "glass",
  "burglary-insurance": "burglary",
  "fire-insurance": "fire",
  "motor-insurance": "motor",
  "health-insurance": "health",
  "travel-insurance": "travel",
  "hull-insurance": "hull",
  "cyber-insurance": "cyber",
};

export function normalizeServiceSlug(slug: string): string {
  return LEGACY_SERVICE_SLUGS[slug] ?? slug;
}

export function getProductSlugCandidates(slug: string): string[] {
  const canonical = normalizeServiceSlug(slug);
  const legacy = Object.entries(LEGACY_SERVICE_SLUGS)
    .filter(([, value]) => value === canonical)
    .map(([key]) => key);
  return [...new Set([canonical, slug, ...legacy])];
}

export function getServices(locale: string): Service[] {
  return locale === "ar" ? servicesAr : servicesEn;
}

export function getServicesByCategory(categoryId: ServiceCategoryId, locale: string): Service[] {
  return getServices(locale).filter((service) => service.category === categoryId);
}

export function getFeaturedServices(locale: string): Service[] {
  const currentServices = getServices(locale);
  return featuredServiceSlugs
    .map((slug) => currentServices.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s));
}
