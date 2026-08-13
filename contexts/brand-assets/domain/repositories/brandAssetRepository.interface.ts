import type {
  BrandAsset,
  CreateBrandAssetGroupInput,
  CreateBrandAssetInput,
  SaveBrandAssetGroupInput,
  UpdateBrandAssetInput,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import type { AssetVisibility } from "@/contexts/brand-assets/domain/models/brand-asset.model";

export interface ListBrandAssetsParams {
  category?: AssetCategory;
  /** Keep only assets whose visibility is in this set (viewer-role gating). */
  visibilities?: AssetVisibility[];
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

  /**
   * Group writes. One artwork spans several files, so publishing, editing,
   * archiving and deleting all happen at group granularity — a per-file write
   * would let members drift apart. Each returns the group's members.
   */
  createGroup(input: CreateBrandAssetGroupInput): Promise<BrandAsset[]>;
  saveGroup(
    groupId: string,
    input: SaveBrandAssetGroupInput,
  ): Promise<BrandAsset[]>;
  setGroupArchived(groupId: string, archived: boolean): Promise<BrandAsset[]>;
  removeGroup(groupId: string): Promise<void>;
}
