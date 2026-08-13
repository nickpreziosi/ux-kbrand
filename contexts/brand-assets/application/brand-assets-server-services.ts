import { BrandAssetAdminService } from "./services/brand-asset-admin-service";
import { BrandAssetCatalogService } from "./services/brand-asset-catalog-service";
import { MockBrandAssetRepository } from "../infrastructure/mock/mock-brand-asset-repository";

/**
 * Server-side wiring for the mock HTTP backend (app/api routes). One seeded
 * in-memory repository per server process — mutations persist across requests
 * and tabs (unlike the per-browser client mock) and reset on server restart.
 * Cached on globalThis so dev HMR recompiles reuse the same store.
 */
const globalStore = globalThis as unknown as {
  __kbrandServerAssetRepository?: MockBrandAssetRepository;
};

export function getServerBrandAssetRepository(): MockBrandAssetRepository {
  globalStore.__kbrandServerAssetRepository ??= new MockBrandAssetRepository(0);
  return globalStore.__kbrandServerAssetRepository;
}

export function getServerBrandAssetCatalogService(): BrandAssetCatalogService {
  return new BrandAssetCatalogService(getServerBrandAssetRepository());
}

export function getServerBrandAssetAdminService(): BrandAssetAdminService {
  return new BrandAssetAdminService(getServerBrandAssetRepository());
}
