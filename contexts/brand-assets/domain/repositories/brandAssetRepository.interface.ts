import type {
  BrandAsset,
  CreateBrandAssetInput,
  UpdateBrandAssetInput,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import type { AssetVisibility } from "@/contexts/brand-assets/domain/models/brand-asset.model";

export interface ListBrandAssetsParams {
  category?: AssetCategory;
  visibility?: AssetVisibility;
  /** Admin listings include archived assets; public listings never do. */
  includeArchived?: boolean;
}

export interface BrandAssetRepository {
  list(params?: ListBrandAssetsParams): Promise<BrandAsset[]>;
  getById(id: string): Promise<BrandAsset | null>;
  create(input: CreateBrandAssetInput): Promise<BrandAsset>;
  update(id: string, input: UpdateBrandAssetInput): Promise<BrandAsset>;
  setArchived(id: string, archived: boolean): Promise<BrandAsset>;
  remove(id: string): Promise<void>;
}
