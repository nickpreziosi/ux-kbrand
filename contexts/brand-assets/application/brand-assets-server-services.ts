import { BrandAssetAdminService } from "./services/brand-asset-admin-service";
import { BrandAssetCatalogService } from "./services/brand-asset-catalog-service";
import { MockBrandAssetRepository } from "../infrastructure/mock/mock-brand-asset-repository";
import { SEED_BRAND_ASSETS } from "../infrastructure/mock/seed-assets";

/**
 * Server-side wiring for the mock HTTP backend (app/api routes). One seeded
 * in-memory repository per server process — mutations persist across requests
 * and tabs (unlike the per-browser client mock) and reset on server restart.
 * Cached on globalThis so dev HMR recompiles reuse the same store. When the
 * generated seed catalog changes (new asset ids), the store is rebuilt so
 * regenerating seed-assets.ts takes effect without a full process restart.
 */
const globalStore = globalThis as unknown as {
  __kbrandServerAssetRepository?: MockBrandAssetRepository;
  __kbrandSeedFingerprint?: string;
};

function seedFingerprint(): string {
  return SEED_BRAND_ASSETS.map((asset) => asset.id).join(",");
}

export function getServerBrandAssetRepository(): MockBrandAssetRepository {
  const fingerprint = seedFingerprint();
  if (
    !globalStore.__kbrandServerAssetRepository ||
    globalStore.__kbrandSeedFingerprint !== fingerprint
  ) {
    globalStore.__kbrandServerAssetRepository = new MockBrandAssetRepository(0);
    globalStore.__kbrandSeedFingerprint = fingerprint;
  }
  return globalStore.__kbrandServerAssetRepository;
}

export function getServerBrandAssetCatalogService(): BrandAssetCatalogService {
  return new BrandAssetCatalogService(getServerBrandAssetRepository());
}

export function getServerBrandAssetAdminService(): BrandAssetAdminService {
  return new BrandAssetAdminService(getServerBrandAssetRepository());
}
