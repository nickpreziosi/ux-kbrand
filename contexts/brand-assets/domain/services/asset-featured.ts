import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

const DEFAULT_LIMIT = 4;

/** Logo variants to surface on the guidelines page, in that order. */
const LOGO_FEATURE_TAGS = ["primary", "dark", "reversed", "mark"] as const;

/**
 * The 2–4 most useful downloadable assets to show on a guideline page.
 * Page-only mockups never live in the catalog, so this only ranks catalog rows.
 */
export function featuredAssetsForCategory(
  assets: BrandAsset[],
  category: AssetCategory,
  limit: number = DEFAULT_LIMIT,
): BrandAsset[] {
  const inCategory = assets.filter(
    (asset) => asset.category === category && asset.status === "active",
  );

  if (category === "logos") {
    const picked: BrandAsset[] = [];
    for (const tag of LOGO_FEATURE_TAGS) {
      const match = inCategory.find(
        (asset) =>
          asset.product === "k-lab" &&
          asset.tags.includes(tag) &&
          !picked.includes(asset),
      );
      if (match) picked.push(match);
      if (picked.length >= limit) break;
    }
    return picked;
  }

  return inCategory.slice(0, limit);
}
