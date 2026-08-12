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
