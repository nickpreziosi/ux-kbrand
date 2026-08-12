"use client";

import * as React from "react";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { brandAssetCatalogService } from "@/contexts/brand-assets/application/brand-assets-client-services";

export function useSalesAssets() {
  const [groups, setGroups] = React.useState<Partial<Record<AssetCategory, BrandAsset[]>>>({});
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setGroups(await brandAssetCatalogService.listSalesAssets());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "errors.assets.loadFailed");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  return { groups, loading, loadError, refresh };
}
