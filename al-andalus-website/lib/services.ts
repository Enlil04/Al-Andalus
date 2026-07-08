export type ServiceCategoryId = "personal" | "business" | "industrial" | "financial";

export type ServiceCategory = {
  id: ServiceCategoryId;
  label: string;
};

export const serviceCategories: ServiceCategory[] = [
  { id: "personal", label: "Personal" },
  { id: "business", label: "Business" },
  { id: "industrial", label: "Industrial" },
  { id: "financial", label: "Financial" },
];

export type Service = {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: ServiceCategoryId;
  underDevelopment?: boolean;
};

export const services: Service[] = [
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

export const featuredServiceSlugs = [
  "travel",
  "fidelity-guarantee",
  "engineering",
  "health",
  "motor",
  "cash-in-transit",
] as const;

export function getServicesByCategory(categoryId: ServiceCategoryId): Service[] {
  return services.filter((service) => service.category === categoryId);
}

export function getFeaturedServices(): Service[] {
  return featuredServiceSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s));
}
