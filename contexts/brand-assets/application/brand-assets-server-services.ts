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

/**
 * Fingerprints the whole catalog, not just its ids: regenerating the seed to
 * re-gate an asset changes no id, and a store rebuilt only on id changes would
 * keep serving the old visibility until the process restarted. Computed once
 * per module evaluation — the seed is a module constant.
 */
const SEED_FINGERPRINT = JSON.stringify(SEED_BRAND_ASSETS);

/**
 * The repository's own method set joins the fingerprint: HMR keeps the cached
 * instance across a recompile, so adding a method to the class would otherwise
 * 500 every call to it ("not a function") until the dev server restarted.
 */
const STORE_FINGERPRINT = `${Object.getOwnPropertyNames(
  MockBrandAssetRepository.prototype,
)
  .sort()
  .join(",")}|${SEED_FINGERPRINT}`;

export function getServerBrandAssetRepository(): MockBrandAssetRepository {
  const fingerprint = STORE_FINGERPRINT;
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
