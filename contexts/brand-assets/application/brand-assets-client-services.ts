import { BrandAssetAdminService } from "./services/brand-asset-admin-service";
import { BrandAssetCatalogService } from "./services/brand-asset-catalog-service";
import { MockBrandAssetRepository } from "../infrastructure/mock/mock-brand-asset-repository";

/**
 * Client-side wiring (same pattern as the other product repos). The mock
 * repository is the only implementation today; a Firestore/Storage
 * implementation slots in behind the same interface when the backend lands
 * (NEXT_PUBLIC_USE_MOCK_BRAND_API stays the opt-in seam).
 */
const brandAssetRepository = new MockBrandAssetRepository();

export const brandAssetCatalogService = new BrandAssetCatalogService(brandAssetRepository);
export const brandAssetAdminService = new BrandAssetAdminService(brandAssetRepository);
