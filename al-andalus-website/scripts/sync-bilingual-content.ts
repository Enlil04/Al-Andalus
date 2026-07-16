/**
 * Sync product titles/descriptions into explicit EN/AR fields.
 * Run: npx tsx scripts/sync-bilingual-content.ts
 */
import { getPayload } from "payload";
import configPromise from "../payload.config";
import { getProductSeedEntries } from "../lib/productSeed";

async function main() {
  const payload = await getPayload({ config: configPromise });
  const products = getProductSeedEntries();

  for (const product of products) {
    const existing = await payload.find({
      collection: "products",
      where: { slug: { equals: product.slug } },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: "products",
        overrideAccess: true,
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
      payload.logger.info(`Created product ${product.slug}`);
      continue;
    }

    const id = existing.docs[0].id;
    await payload.update({
      collection: "products",
      id,
      overrideAccess: true,
      data: {
        titleEn: product.titleEn,
        titleAr: product.titleAr,
        shortDescriptionEn: product.shortDescriptionEn,
        shortDescriptionAr: product.shortDescriptionAr,
        category: product.category,
        isFeatured: product.isFeatured,
        status: product.status,
        order: product.order,
      },
    });
    payload.logger.info(`Synced product ${product.slug} (EN+AR)`);
  }

  payload.logger.info("Done syncing bilingual product content.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
