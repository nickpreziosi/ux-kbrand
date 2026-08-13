"use client";

import * as React from "react";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { brandAssetCatalogService } from "@/contexts/brand-assets/application/brand-assets-client-services";
import { usePortalRole } from "@/ui/user-management/hooks/use-portal-role";

/**
 * Active assets of one category, scoped to what the current viewer may see:
 * anonymous visitors get public assets only; employees and admins also get
 * employee-gated ones. Waits for the role to resolve so a signed-in employee
 * doesn't briefly see (and then re-fetch past) the public-only listing.
 */
export function useCategoryAssets(category: AssetCategory) {
  const { viewerRole, loading: roleLoading } = usePortalRole();
  const [assets, setAssets] = React.useState<BrandAsset[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setAssets(await brandAssetCatalogService.listCategory(category, viewerRole));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "errors.assets.loadFailed");
    } finally {
      setLoading(false);
    }
  }, [category, viewerRole]);

  React.useEffect(() => {
    if (roleLoading) return;
    void refresh();
  }, [refresh, roleLoading]);

  return { assets, loading: loading || roleLoading, loadError, refresh };
}
