"use client";

import * as React from "react";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { brandAssetCatalogService } from "@/contexts/brand-assets/application/brand-assets-client-services";
import { usePortalRole } from "@/ui/user-management/hooks/use-portal-role";

/**
 * Sales-section assets grouped by category, scoped to the viewer's role.
 * The /sales route itself is session-gated by middleware; the role scoping
 * here keeps the listing correct regardless of how it is reached.
 */
export function useSalesAssets() {
  const { viewerRole, loading: roleLoading } = usePortalRole();
  const [groups, setGroups] = React.useState<Partial<Record<AssetCategory, BrandAsset[]>>>({});
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setGroups(await brandAssetCatalogService.listSalesAssets(viewerRole));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "errors.assets.loadFailed");
    } finally {
      setLoading(false);
    }
  }, [viewerRole]);

  React.useEffect(() => {
    if (roleLoading) return;
    void refresh();
  }, [refresh, roleLoading]);

  return { groups, loading: loading || roleLoading, loadError, refresh };
}
