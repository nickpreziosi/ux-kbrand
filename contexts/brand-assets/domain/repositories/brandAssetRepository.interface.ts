import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import type {
  AssetFile,
  AssetVisibility,
  BrandAsset,
  CreateBrandAssetInput,
  UpdateBrandAssetInput,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetProduct } from "@/contexts/brand-assets/domain/models/asset-product.model";
import type { AssetResourceType } from "@/contexts/brand-assets/domain/models/asset-category.model";

export interface ListBrandAssetsParams {
  category?: AssetCategory;
  visibilities?: AssetVisibility[];
  includeArchived?: boolean;
  resourceType?: AssetResourceType;
  product?: AssetProduct;
  format?: string;
}

export interface BrandAssetRepository {
  list(params?: ListBrandAssetsParams): Promise<BrandAsset[]>;
  getById(id: string): Promise<BrandAsset | null>;
  create(input: CreateBrandAssetInput): Promise<BrandAsset>;
  update(id: string, input: UpdateBrandAssetInput): Promise<BrandAsset>;
  setArchived(id: string, archived: boolean): Promise<BrandAsset>;
  remove(id: string): Promise<void>;
}

export function findAssetFile(
  assets: BrandAsset[],
  fileId: string,
): { asset: BrandAsset; file: AssetFile } | undefined {
  for (const asset of assets) {
    const file = asset.files.find((candidate) => candidate.id === fileId);
    if (file) return { asset, file };
  }
  return undefined;
}
