import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { SALES_CATEGORIES } from "@/contexts/brand-assets/domain/models/asset-category.model";
import type { BrandAssetRepository } from "@/contexts/brand-assets/domain/repositories/brandAssetRepository.interface";

/** Read side of the catalog — what visitors and employees browse. */
export class BrandAssetCatalogService {
  constructor(private readonly assets: BrandAssetRepository) {}

  /** Active public assets for one open category (guidelines/logos/imagery/fonts). */
  listPublicCategory(category: AssetCategory): Promise<BrandAsset[]> {
    return this.assets.list({ category, visibility: "public" });
  }

  /** Active employee-gated assets grouped for the sales section. */
  async listSalesAssets(): Promise<Record<AssetCategory, BrandAsset[]>> {
    const all = await this.assets.list({ visibility: "employee" });
    const grouped = {} as Record<AssetCategory, BrandAsset[]>;
    for (const category of SALES_CATEGORIES) {
      grouped[category] = all.filter((asset) => asset.category === category);
    }
    return grouped;
  }
}
