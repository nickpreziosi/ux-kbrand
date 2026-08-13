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
}
