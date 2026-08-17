/**
 * Controlled category list — flat, no folders or nesting by design
 * (see the Brand Portal user story). Each category maps to a Firestore
 * query filter and a Storage path prefix (`assets/{category}/…`).
 */
export const ASSET_CATEGORIES = [
  "brand-guidelines",
  "logos",
  "brand-imagery",
  "iconography",
  "photography",
  "corporate-assets",
  "social-media",
  "merchandise",
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
  "iconography",
  "photography",
  "corporate-assets",
  "social-media",
  "merchandise",
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
 * Sales material is employee-only by definition: pitch decks, one-pagers, and
 * case studies are never served to anonymous visitors, whatever visibility the
 * caller asks for. Every other category takes the requested value, so brand
 * assets stay public-first.
 *
 * This is an invariant, not a default — the write paths run every create and
 * edit through it, so an asset cannot be published by moving it into a sales
 * category, or by editing a sales asset's gating afterwards.
 */
export function resolveVisibilityForCategory(
  category: AssetCategory,
  requested: "public" | "employee",
): "public" | "employee" {
  return isSalesCategory(category) ? "employee" : requested;
}

/** Visibility a new asset starts with, before the admin changes anything. */
export function defaultVisibilityForCategory(
  category: AssetCategory,
): "public" | "employee" {
  return resolveVisibilityForCategory(category, "public");
}
