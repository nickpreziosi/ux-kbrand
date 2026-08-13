import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { SALES_CATEGORIES } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { visibilitiesForViewer } from "@/contexts/brand-assets/domain/services/asset-access";
import type { ViewerRole } from "@/contexts/shared/domain/viewer-role";
import type { BrandAssetRepository } from "@/contexts/brand-assets/domain/repositories/brandAssetRepository.interface";

/**
 * Read side of the catalog. Every listing is scoped to the viewer's role:
 * anonymous visitors get only "public" assets, employees and admins also get
 * "employee"-gated ones (see asset-access domain service).
 */
export class BrandAssetCatalogService {
  constructor(private readonly assets: BrandAssetRepository) {}

  /** Active assets of one category the viewer is allowed to see. */
  listCategory(category: AssetCategory, viewer: ViewerRole): Promise<BrandAsset[]> {
    return this.assets.list({ category, visibilities: visibilitiesForViewer(viewer) });
  }

  /** Sales-section assets the viewer may see, grouped by sales category. */
  async listSalesAssets(viewer: ViewerRole): Promise<Record<AssetCategory, BrandAsset[]>> {
    const all = await this.assets.list({ visibilities: visibilitiesForViewer(viewer) });
    const grouped = {} as Record<AssetCategory, BrandAsset[]>;
    for (const category of SALES_CATEGORIES) {
      grouped[category] = all.filter((asset) => asset.category === category);
    }
    return grouped;
  }
}
