import type { AssetFile } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { assetBundleUrl, brandDownloadUrl } from "@/ui/branding/content/logo-formats";

/**
 * Where a single file downloads from. Statically served brand files go through
 * /api/brand-download so the browser saves them instead of navigating to them;
 * uploaded files already have a URL that serves their own bytes.
 */
export function fileDownloadHref(file: AssetFile): string {
  if (file.downloadUrl.startsWith("/brand-files/")) {
    return brandDownloadUrl(file.id);
  }
  return file.downloadUrl;
}

/** @deprecated Use fileDownloadHref. */
export function assetDownloadHref(asset: BrandAsset): string {
  const [file] = asset.files;
  return file ? fileDownloadHref(file) : "#";
}

/** One file downloads directly; several come as a zip of the whole asset. */
export function assetBundleHref(asset: BrandAsset): string {
  return asset.files.length > 1
    ? assetBundleUrl(asset.id)
    : assetDownloadHref(asset);
}

/** @deprecated Use assetBundleHref. */
export const groupDownloadHref = assetBundleHref;
