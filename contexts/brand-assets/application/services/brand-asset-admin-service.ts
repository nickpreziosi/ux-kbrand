import type {
  BrandAsset,
  CreateBrandAssetInput,
  UpdateBrandAssetInput,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { BrandAssetRepository } from "@/contexts/brand-assets/domain/repositories/brandAssetRepository.interface";

/** Write side of the catalog — admin create / edit / replace / archive / delete. */
export class BrandAssetAdminService {
  constructor(private readonly assets: BrandAssetRepository) {}

  /** Full catalog including archived assets, for the admin table. */
  listAll(): Promise<BrandAsset[]> {
    return this.assets.list({ includeArchived: true });
  }

  create(input: CreateBrandAssetInput): Promise<BrandAsset> {
    return this.assets.create(input);
  }

  update(id: string, input: UpdateBrandAssetInput): Promise<BrandAsset> {
    return this.assets.update(id, input);
  }

  setArchived(id: string, archived: boolean): Promise<BrandAsset> {
    return this.assets.setArchived(id, archived);
  }

  remove(id: string): Promise<void> {
    return this.assets.remove(id);
  }
}
