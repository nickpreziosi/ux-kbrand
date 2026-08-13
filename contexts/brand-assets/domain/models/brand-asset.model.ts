import type { AssetCategory } from "./asset-category.model";

/** Who may view/download the asset. Enforced by middleware + download routes. */
export type AssetVisibility = "public" | "employee";

/** Archived assets stay in the catalog for admins but leave every listing. */
export type AssetStatus = "active" | "archived";

/**
 * File metadata — everything the UI needs to display and download the file.
 * `storagePath` is the future Firebase Storage object path; `downloadUrl` is
 * whatever currently serves the bytes (static file, API route, or blob URL
 * for freshly uploaded mock assets).
 */
export interface AssetFile {
  fileName: string;
  contentType: string;
  sizeBytes: number;
  storagePath: string;
  downloadUrl: string;
}

/** Wire-input guard (mock HTTP backend validates uploads/creates with it). */
export function isAssetFile(value: unknown): value is AssetFile {
  if (typeof value !== "object" || value === null) return false;
  const file = value as Record<string, unknown>;
  return (
    typeof file.fileName === "string" &&
    typeof file.contentType === "string" &&
    typeof file.sizeBytes === "number" &&
    typeof file.storagePath === "string" &&
    typeof file.downloadUrl === "string"
  );
}

/**
 * Maps 1:1 to a Firestore `assets/{id}` document. Timestamps are ISO strings
 * (Firestore `Timestamp.toDate().toISOString()` at the mapper seam).
 */
export interface BrandAsset {
  id: string;
  title: string;
  description: string;
  category: AssetCategory;
  visibility: AssetVisibility;
  status: AssetStatus;
  file: AssetFile;
  /** Optional inline preview (image assets render it in cards). */
  previewUrl?: string;
  /**
   * Same artwork, different encoding: every PNG/SVG/PDF/AI export of one logo
   * shares a `groupId`, and listings collapse the group into a single card.
   * Absent means the asset stands alone — the pre-grouping behaviour.
   *
   * The group's display copy is denormalized onto every member (identical on
   * each) so a listing never has to fetch a sibling to render a card, and so
   * per-file `title`s can stay format-specific for the admin table.
   */
  groupId?: string;
  groupTitle?: string;
  groupDescription?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  /** PortalUser id of the uploader. */
  createdBy: string;
}

/**
 * Marks the complete brand guidelines document — the source of truth the
 * portal links to rather than reproducing as web content. A tag (not a new
 * field) keeps the schema flat and lets admins move the marker by editing an
 * asset.
 */
export const BRAND_BOOK_TAG = "brand-book";

export function findBrandBookAsset(assets: BrandAsset[]): BrandAsset | undefined {
  return assets.find((asset) => asset.tags.includes(BRAND_BOOK_TAG));
}

export interface CreateBrandAssetInput {
  title: string;
  description: string;
  category: AssetCategory;
  visibility: AssetVisibility;
  file: AssetFile;
  previewUrl?: string;
  tags?: string[];
  createdBy: string;
  /** Joins an existing group; absent means the asset stands alone. */
  groupId?: string;
  groupTitle?: string;
  groupDescription?: string;
}

export interface UpdateBrandAssetInput {
  title?: string;
  description?: string;
  category?: AssetCategory;
  visibility?: AssetVisibility;
  /** Replacing the file swaps metadata + bytes in one operation. */
  file?: AssetFile;
  previewUrl?: string;
  tags?: string[];
  groupId?: string;
  groupTitle?: string;
  groupDescription?: string;
}

/** One file of an artwork, on its way in — the bytes are already uploaded. */
export interface AssetGroupFileInput {
  file: AssetFile;
  /** Image files preview from their own bytes; "" or absent means no preview. */
  previewUrl?: string;
}

/**
 * Publishes one artwork in every format it ships in: one asset record per file,
 * all sharing a freshly minted `groupId` so listings collapse them into a
 * single card. A one-file group is the ordinary "upload an asset" case.
 */
export interface CreateBrandAssetGroupInput {
  title: string;
  description: string;
  category: AssetCategory;
  visibility: AssetVisibility;
  files: AssetGroupFileInput[];
  tags?: string[];
  createdBy: string;
}

/**
 * One admin edit of a whole group: shared metadata, formats added, formats
 * dropped. Bundling them keeps a group from being half-saved — the members
 * never disagree about title, category or gating.
 */
export interface SaveBrandAssetGroupInput {
  title?: string;
  description?: string;
  category?: AssetCategory;
  visibility?: AssetVisibility;
  tags?: string[];
  /** Formats to add — the "this artwork was missing its SVG" case. */
  addFiles?: AssetGroupFileInput[];
  /** Member asset ids to delete. Never allowed to empty the group. */
  removeAssetIds?: string[];
  /** Uploader for added members; defaults to the group's existing owner. */
  createdBy?: string;
}
