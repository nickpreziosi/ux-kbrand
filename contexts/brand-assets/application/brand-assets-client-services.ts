import { BrandAssetAdminService } from "./services/brand-asset-admin-service";
import { BrandAssetCatalogService } from "./services/brand-asset-catalog-service";
import { HttpBrandAssetRepository } from "../infrastructure/http/http-brand-asset-repository";
import { MockBrandAssetRepository } from "../infrastructure/mock/mock-brand-asset-repository";
import type { BrandAssetRepository } from "../domain/repositories/brandAssetRepository.interface";

/**
 * Client-side wiring (same pattern as the other product repos). Default is the
 * mock HTTP backend (app/api routes over a server-side seeded store), so admin
 * changes reach every tab and download gating. NEXT_PUBLIC_USE_MOCK_BRAND_API=true
 * opts back into the in-browser mock (no server round-trips); a
 * Firestore/Storage implementation slots in behind the same interface later.
 */
const useClientMock = process.env.NEXT_PUBLIC_USE_MOCK_BRAND_API === "true";

const brandAssetRepository: BrandAssetRepository = useClientMock
  ? new MockBrandAssetRepository()
  : new HttpBrandAssetRepository();

export const brandAssetCatalogService = new BrandAssetCatalogService(brandAssetRepository);
export const brandAssetAdminService = new BrandAssetAdminService(brandAssetRepository);
