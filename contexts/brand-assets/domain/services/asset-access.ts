import type { ViewerRole } from "@/contexts/shared/domain/viewer-role";
import type {
  AssetVisibility,
  BrandAsset,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";

/**
 * Single source of truth for what each role may do with the catalog:
 *
 * - public    → browse/download assets marked "public"; no Sales section.
 * - employee  → browse/download "public" + "employee" assets, sees each
 *               asset's gating but cannot change it.
 * - admin     → everything employees can, plus create/remove assets, set
 *               gating, and manage users.
 */

/** Which asset visibilities a viewer may see and download. */
export function visibilitiesForViewer(role: ViewerRole): AssetVisibility[] {
  return role === "public" ? ["public"] : ["public", "employee"];
}

export function canViewAsset(role: ViewerRole, asset: BrandAsset): boolean {
  return visibilitiesForViewer(role).includes(asset.visibility);
}

/** The Sales section (nav entry, home tile, /sales route) is hidden from anonymous visitors. */
export function canSeeSalesSection(role: ViewerRole): boolean {
  return role !== "public";
}

/** Employees and admins see each asset's gating; public visitors never do. */
export function canSeeAssetGating(role: ViewerRole): boolean {
  return role !== "public";
}

/** Only admins add/remove assets and change gating. */
export function canManageAssets(role: ViewerRole): boolean {
  return role === "admin";
}

/** Only admins manage users and permissions. */
export function canManageUsers(role: ViewerRole): boolean {
  return role === "admin";
}
