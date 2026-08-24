import type {
  BrandAsset,
  CreateBrandAssetInput,
  UpdateBrandAssetInput,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  isSalesCategory,
  resolveVisibilityForCategory,
} from "@/contexts/brand-assets/domain/models/asset-category.model";
import type { BrandAssetRepository } from "@/contexts/brand-assets/domain/repositories/brandAssetRepository.interface";

/** Write side of the catalog — admin create / edit / archive / delete. */
export class BrandAssetAdminService {
  constructor(private readonly assets: BrandAssetRepository) {}

  /** Full catalog including archived assets, for the admin table. */
  listAll(): Promise<BrandAsset[]> {
    return this.assets.list({ includeArchived: true });
  }

  create(input: CreateBrandAssetInput): Promise<BrandAsset> {
    return this.assets.create({
      ...input,
      visibility: resolveVisibilityForCategory(input.category, input.visibility),
    });
  }

  /**
   * Applies the sales-category gating invariant to the asset as it will be
   * *after* the edit: moving one into a sales category gates it, and a sales
   * asset can never be published. Reads the stored asset only when the edit
   * could lift gating without naming a category.
   */
  async update(id: string, input: UpdateBrandAssetInput): Promise<BrandAsset> {
    if (input.category) {
      return this.assets.update(id, {
        ...input,
        visibility: isSalesCategory(input.category)
          ? "employee"
          : input.visibility,
      });
    }

    if (input.visibility === "public") {
      const current = await this.assets.getById(id);
      if (current) {
        return this.assets.update(id, {
          ...input,
          visibility: resolveVisibilityForCategory(current.category, "public"),
        });
      }
    }

    return this.assets.update(id, input);
  }

  /** Quick gating switch — who may view/download the asset. */
  setVisibility(id: string, visibility: BrandAsset["visibility"]): Promise<BrandAsset> {
    return this.update(id, { visibility });
  }

  setArchived(id: string, archived: boolean): Promise<BrandAsset> {
    return this.assets.setArchived(id, archived);
  }

  remove(id: string): Promise<void> {
    return this.assets.remove(id);
  }
}
