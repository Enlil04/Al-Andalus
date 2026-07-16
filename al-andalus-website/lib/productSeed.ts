import {
  featuredServiceSlugs,
  servicesAr,
  servicesEn,
  type Service,
} from "./services";

export type ProductSeedEntry = {
  slug: string;
  titleEn: string;
  titleAr: string;
  shortDescriptionEn: string;
  shortDescriptionAr: string;
  category: Service["category"];
  status: "active" | "under-development";
  isFeatured: boolean;
  order: number;
};

function getArabicService(service: Service): Service {
  return servicesAr.find((entry) => entry.slug === service.slug) ?? service;
}

export function getProductSeedEntries(): ProductSeedEntry[] {
  return servicesEn.map((service, index) => {
    const arabic = getArabicService(service);
    return {
      slug: service.slug,
      titleEn: service.title,
      titleAr: arabic.title,
      shortDescriptionEn: service.description,
      shortDescriptionAr: arabic.description,
      category: service.category,
      status: service.underDevelopment ? "under-development" : "active",
      isFeatured: featuredServiceSlugs.includes(
        service.slug as (typeof featuredServiceSlugs)[number],
      ),
      order: index + 1,
    };
  });
}
