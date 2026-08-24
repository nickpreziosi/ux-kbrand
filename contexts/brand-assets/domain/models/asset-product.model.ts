/**
 * The only brand/product axis on an asset. K Lab, K Talk, K Rails, and later
 * sub-brands share this field — there is no separate `brand`.
 */
export const ASSET_PRODUCTS = ["k-lab", "k-talk", "k-rails", "k-risk"] as const;

export type AssetProduct = (typeof ASSET_PRODUCTS)[number];

export function isAssetProduct(value: string): value is AssetProduct {
  return (ASSET_PRODUCTS as readonly string[]).includes(value);
}

/** Infer product from legacy tags when seeding; new writes always set it. */
export function productFromTags(tags: readonly string[]): AssetProduct {
  if (tags.includes("k-talk")) return "k-talk";
  if (tags.includes("k-rails")) return "k-rails";
  if (tags.includes("k-risk")) return "k-risk";
  return "k-lab";
}
