import type { AssetCategory, AssetResourceType } from "./asset-category.model";
import { resourceTypeForCategory } from "./asset-category.model";
import type { AssetProduct } from "./asset-product.model";

/** Who may view/download the asset. Enforced by middleware + download routes. */
export type AssetVisibility = "public" | "employee";

/** Archived assets stay in the catalog for admins but leave every listing. */
export type AssetStatus = "active" | "archived";

/**
 * File metadata — everything the UI needs to display and download the file.
 * `id` is stable across edits so downloads and "remove this format" keep a
 * handle after the artwork is no longer one record per file.
 * `storagePath` is the future Firebase Storage object path; `downloadUrl` is
 * whatever currently serves the bytes (static file, API route, or blob URL
 * for freshly uploaded mock assets).
 */
export interface AssetFile {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  storagePath: string;
  downloadUrl: string;
}

/** Incoming file before the repository mints an id. */
export type AssetFileDraft = Omit<AssetFile, "id"> & { id?: string };

/** Wire-input guard for a persisted file (id required). */
export function isAssetFile(value: unknown): value is AssetFile {
  if (!isAssetFileDraft(value)) return false;
  return typeof value.id === "string" && value.id.length > 0;
}

/** Wire-input guard for create/add — id is optional until persist. */
export function isAssetFileDraft(value: unknown): value is AssetFileDraft {
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
 * Maps 1:1 to a Firestore `assets/{id}` document. One artwork, every format
 * it ships in. Timestamps are ISO strings
 * (Firestore `Timestamp.toDate().toISOString()` at the mapper seam).
 */
export interface BrandAsset {
  id: string;
  title: string;
  description: string;
  resourceType: AssetResourceType;
  category: AssetCategory;
  product: AssetProduct;
  visibility: AssetVisibility;
  status: AssetStatus;
  files: AssetFile[];
  /** Optional inline preview (image assets render it in cards). */
  previewUrl?: string;
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

/** One file of an artwork, on its way in — the bytes are already uploaded. */
export interface AssetFileInput {
  file: AssetFileDraft;
  /** Image files preview from their own bytes; "" or absent means no preview. */
  previewUrl?: string;
}

export interface CreateBrandAssetInput {
  title: string;
  description: string;
  category: AssetCategory;
  visibility: AssetVisibility;
  product: AssetProduct;
  files: AssetFileInput[];
  previewUrl?: string;
  tags?: string[];
  createdBy: string;
}

export interface UpdateBrandAssetInput {
  title?: string;
  description?: string;
  category?: AssetCategory;
  visibility?: AssetVisibility;
  product?: AssetProduct;
  previewUrl?: string;
  tags?: string[];
  /** Formats to add — the "this artwork was missing its SVG" case. */
  addFiles?: AssetFileInput[];
  /** File ids to drop. Never allowed to empty the asset. */
  removeFileIds?: string[];
}

export function resourceTypeOf(asset: Pick<BrandAsset, "category">): AssetResourceType {
  return resourceTypeForCategory(asset.category);
}
