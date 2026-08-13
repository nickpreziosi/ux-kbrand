"use client";

import * as React from "react";
import type {
  AssetVisibility,
  BrandAsset,
  CreateBrandAssetInput,
  UpdateBrandAssetInput,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { brandAssetAdminService } from "@/contexts/brand-assets/application/brand-assets-client-services";

export function useAssetAdmin() {
  const [assets, setAssets] = React.useState<BrandAsset[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [mutating, setMutating] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setAssets(await brandAssetAdminService.listAll());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "errors.assets.loadFailed");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const runMutation = React.useCallback(
    async <T,>(operation: () => Promise<T>): Promise<T> => {
      setMutating(true);
      try {
        const result = await operation();
        await refresh();
        return result;
      } finally {
        setMutating(false);
      }
    },
    [refresh],
  );

  const createAsset = React.useCallback(
    (input: CreateBrandAssetInput) => runMutation(() => brandAssetAdminService.create(input)),
    [runMutation],
  );

  const updateAsset = React.useCallback(
    (id: string, input: UpdateBrandAssetInput) =>
      runMutation(() => brandAssetAdminService.update(id, input)),
    [runMutation],
  );

  const setVisibility = React.useCallback(
    (id: string, visibility: AssetVisibility) =>
      runMutation(() => brandAssetAdminService.setVisibility(id, visibility)),
    [runMutation],
  );

  const setArchived = React.useCallback(
    (id: string, archived: boolean) =>
      runMutation(() => brandAssetAdminService.setArchived(id, archived)),
    [runMutation],
  );

  const removeAsset = React.useCallback(
    (id: string) => runMutation(() => brandAssetAdminService.remove(id)),
    [runMutation],
  );

  return {
    assets,
    loading,
    mutating,
    loadError,
    refresh,
    createAsset,
    updateAsset,
    setVisibility,
    setArchived,
    removeAsset,
  };
}
