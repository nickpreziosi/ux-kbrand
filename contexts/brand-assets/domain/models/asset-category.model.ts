/**
 * Controlled category list — flat, no folders or nesting by design
 * (see the Brand Portal user story). Each category maps to a Firestore
 * query filter and a Storage path prefix (`assets/{category}/…`).
 */
export const ASSET_CATEGORIES = [
  "brand-guidelines",
  "logos",
  "brand-imagery",
  "fonts",
  "pitch-decks",
  "sales-materials",
] as const;

export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

/** Categories every visitor can browse and download. */
export const PUBLIC_CATEGORIES: readonly AssetCategory[] = [
  "brand-guidelines",
  "logos",
  "brand-imagery",
  "fonts",
];

/** Categories gated behind employee authentication. */
export const SALES_CATEGORIES: readonly AssetCategory[] = [
  "pitch-decks",
  "sales-materials",
];

export function isAssetCategory(value: string): value is AssetCategory {
  return (ASSET_CATEGORIES as readonly string[]).includes(value);
}

export function isSalesCategory(category: AssetCategory): boolean {
  return SALES_CATEGORIES.includes(category);
}

/**
 * Default visibility for a new asset. Every asset starts "public" for now
 * (regardless of category) — admins re-gate per asset from Manage assets.
 * The category parameter stays as the seam for category-driven defaults later.
 */
export function defaultVisibilityForCategory(
  _category: AssetCategory,
): "public" | "employee" {
  return "public";
}
