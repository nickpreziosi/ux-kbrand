import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetGroup } from "@/contexts/brand-assets/domain/services/asset-grouping";
import { brandBundleUrl, brandDownloadUrl } from "@/ui/branding/content/logo-formats";

/**
 * Where a single file downloads from. Statically served brand files go through
 * /api/brand-download so the browser saves them instead of navigating to them;
 * uploaded files already have a URL that serves their own bytes.
 */
export function assetDownloadHref(asset: BrandAsset): string {
  if (asset.file.downloadUrl.startsWith("/brand-files/")) {
    return brandDownloadUrl(asset.id);
  }
  return asset.file.downloadUrl;
}

/** One file downloads directly; several come as a zip of the whole group. */
export function groupDownloadHref(group: AssetGroup): string {
  return group.assets.length > 1
    ? brandBundleUrl(group.id)
    : assetDownloadHref(group.preview);
}
