import { getPayload } from "payload";
import configPromise from "./payload.config";
import { getProductSeedEntries } from "./lib/productSeed";

const seed = async () => {
  const payload = await getPayload({ config: configPromise });

  payload.logger.info("Checking if database is already initialized...");
  const existingProducts = await payload.find({
    collection: "products",
    limit: 1,
  });

  if (existingProducts.docs.length > 0) {
    payload.logger.info("Database already seeded. Skipping.");
    process.exit(0);
  }

  payload.logger.info("Seeding database...");

  for (const product of getProductSeedEntries()) {
    await payload.create({
      collection: "products",
      data: {
        titleEn: product.titleEn,
        titleAr: product.titleAr,
        slug: product.slug,
        shortDescriptionEn: product.shortDescriptionEn,
        shortDescriptionAr: product.shortDescriptionAr,
        category: product.category,
        isFeatured: product.isFeatured,
        status: product.status,
        order: product.order,
      },
    });
  }

  payload.logger.info("Products seeded successfully.");

  process.exit(0);
};

seed();
