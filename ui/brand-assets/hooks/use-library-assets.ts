"use client";

import * as React from "react";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { LibraryFilter } from "@/contexts/brand-assets/domain/services/asset-filtering";
import { brandAssetCatalogService } from "@/contexts/brand-assets/application/brand-assets-client-services";
import { usePortalRole } from "@/ui/user-management/hooks/use-portal-role";

/**
 * Library listing scoped to the current viewer. The caller sets resourceType
 * (brand on /assets, sales on /sales); visibility gating lives in the catalog.
 */
export function useLibraryAssets(filter: LibraryFilter) {
  const { viewerRole, loading: roleLoading } = usePortalRole();
  const [assets, setAssets] = React.useState<BrandAsset[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setAssets(await brandAssetCatalogService.listLibrary(viewerRole, filter));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "errors.assets.loadFailed");
    } finally {
      setLoading(false);
    }
  }, [
    viewerRole,
    filter.search,
    filter.category,
    filter.format,
    filter.product,
    filter.resourceType,
  ]);

  React.useEffect(() => {
    if (roleLoading) return;
    void refresh();
  }, [refresh, roleLoading]);

  return { assets, loading: loading || roleLoading, loadError, refresh };
}