import type {
  BrandAsset,
  CreateBrandAssetInput,
  UpdateBrandAssetInput,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type {
  BrandAssetRepository,
  ListBrandAssetsParams,
} from "@/contexts/brand-assets/domain/repositories/brandAssetRepository.interface";
import { ApiError, fetchJson } from "@/contexts/shared/infrastructure/http/fetch-json";

/**
 * Talks to the mock HTTP backend (app/api/assets). Same interface the
 * Firestore implementation will fill later — the routes' server-side store is
 * what makes admin changes visible to every tab and to download gating.
 */
export class HttpBrandAssetRepository implements BrandAssetRepository {
  async list(params?: ListBrandAssetsParams): Promise<BrandAsset[]> {
    const search = new URLSearchParams();
    if (params?.category) search.set("category", params.category);
    if (params?.visibilities) search.set("visibilities", params.visibilities.join(","));
    if (params?.includeArchived) search.set("includeArchived", "true");
    if (params?.resourceType) search.set("resourceType", params.resourceType);
    if (params?.product) search.set("product", params.product);
    if (params?.format) search.set("format", params.format);
    const query = search.toString();
    const { assets } = await fetchJson<{ assets: BrandAsset[] }>(
      `/api/assets${query ? `?${query}` : ""}`,
    );
    return assets;
  }

  async getById(id: string): Promise<BrandAsset | null> {
    try {
      const { asset } = await fetchJson<{ asset: BrandAsset }>(
        `/api/assets/${encodeURIComponent(id)}`,
      );
      return asset;
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }
  }

  async create(input: CreateBrandAssetInput): Promise<BrandAsset> {
    const { asset } = await fetchJson<{ asset: BrandAsset }>("/api/assets", {
      method: "POST",
      json: input,
    });
    return asset;
  }

  async update(id: string, input: UpdateBrandAssetInput): Promise<BrandAsset> {
    const { asset } = await fetchJson<{ asset: BrandAsset }>(
      `/api/assets/${encodeURIComponent(id)}`,
      { method: "PATCH", json: input },
    );
    return asset;
  }

  async setArchived(id: string, archived: boolean): Promise<BrandAsset> {
    const { asset } = await fetchJson<{ asset: BrandAsset }>(
      `/api/assets/${encodeURIComponent(id)}`,
      { method: "PATCH", json: { archived } },
    );
    return asset;
  }

  async remove(id: string): Promise<void> {
    await fetchJson<{ ok: boolean }>(`/api/assets/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }
}
