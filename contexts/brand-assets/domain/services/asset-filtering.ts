import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import type {
  AssetStatus,
  AssetVisibility,
  BrandAsset,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetProduct } from "@/contexts/brand-assets/domain/models/asset-product.model";
import type { AssetResourceType } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { isAssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { isAssetProduct } from "@/contexts/brand-assets/domain/models/asset-product.model";
import { fileFormat } from "@/contexts/brand-assets/domain/services/asset-files";

/** Every facet is either narrowed to one value or left wide open. */
export const ANY = "all";

/** Admin table filter — search + category + visibility + status. */
export interface AssetCatalogFilter {
  search: string;
  category: AssetCategory | typeof ANY;
  visibility: AssetVisibility | typeof ANY;
  status: AssetStatus | typeof ANY;
}

export const EMPTY_ASSET_CATALOG_FILTER: AssetCatalogFilter = {
  search: "",
  category: ANY,
  visibility: ANY,
  status: ANY,
};

/** @deprecated Use AssetCatalogFilter — name kept for admin toolbar during collapse. */
export type AssetGroupFilter = AssetCatalogFilter;
/** @deprecated Use EMPTY_ASSET_CATALOG_FILTER. */
export const EMPTY_ASSET_GROUP_FILTER = EMPTY_ASSET_CATALOG_FILTER;

export function hasActiveAssetCatalogFilter(filter: AssetCatalogFilter): boolean {
  return (
    filter.search.trim().length > 0 ||
    filter.category !== ANY ||
    filter.visibility !== ANY ||
    filter.status !== ANY
  );
}

/** @deprecated Use hasActiveAssetCatalogFilter. */
export const hasActiveAssetGroupFilter = hasActiveAssetCatalogFilter;

function searchableText(asset: BrandAsset): string {
  return [
    asset.title,
    asset.description,
    asset.category,
    asset.product,
    ...asset.tags,
    ...asset.files.flatMap((file) => [file.fileName, fileFormat(file) ?? ""]),
  ]
    .join(" ")
    .toLowerCase();
}

function matchesSearch(asset: BrandAsset, search: string): boolean {
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = searchableText(asset);
  return terms.every((term) => haystack.includes(term));
}

export function filterCatalogAssets(
  assets: BrandAsset[],
  filter: AssetCatalogFilter,
): BrandAsset[] {
  return assets.filter((asset) => {
    if (filter.category !== ANY && asset.category !== filter.category) {
      return false;
    }
    if (filter.visibility !== ANY && asset.visibility !== filter.visibility) {
      return false;
    }
    if (filter.status !== ANY && asset.status !== filter.status) {
      return false;
    }
    return matchesSearch(asset, filter.search.trim());
  });
}

/** @deprecated Use filterCatalogAssets. */
export const filterAssetGroups = filterCatalogAssets;

/** Public Asset Library / Sales library facets. */
export interface LibraryFilter {
  search: string;
  category: AssetCategory | typeof ANY;
  format: string | typeof ANY;
  product: AssetProduct | typeof ANY;
  resourceType: AssetResourceType | typeof ANY;
}

export const EMPTY_LIBRARY_FILTER: LibraryFilter = {
  search: "",
  category: ANY,
  format: ANY,
  product: ANY,
  resourceType: ANY,
};

export function hasActiveLibraryFilter(filter: LibraryFilter): boolean {
  return (
    filter.search.trim().length > 0 ||
    filter.category !== ANY ||
    filter.format !== ANY ||
    filter.product !== ANY ||
    filter.resourceType !== ANY
  );
}

export function parseLibraryFilter(
  params: URLSearchParams,
  defaults: Partial<LibraryFilter> = {},
): LibraryFilter {
  const category = params.get("category");
  const product = params.get("product");
  const format = params.get("format");
  const search = params.get("q") ?? "";
  const resourceType = params.get("resourceType");

  return {
    search,
    category:
      category && isAssetCategory(category) ? category : (defaults.category ?? ANY),
    product:
      product && isAssetProduct(product) ? product : (defaults.product ?? ANY),
    format: format && format !== ANY ? format.toLowerCase() : (defaults.format ?? ANY),
    resourceType:
      resourceType === "brand" || resourceType === "sales"
        ? resourceType
        : (defaults.resourceType ?? ANY),
  };
}

export function serializeLibraryFilter(filter: LibraryFilter): URLSearchParams {
  const params = new URLSearchParams();
  if (filter.search.trim()) params.set("q", filter.search.trim());
  if (filter.category !== ANY) params.set("category", filter.category);
  if (filter.product !== ANY) params.set("product", filter.product);
  if (filter.format !== ANY) params.set("format", filter.format);
  if (filter.resourceType !== ANY) params.set("resourceType", filter.resourceType);
  return params;
}

export function filterLibraryAssets(
  assets: BrandAsset[],
  filter: LibraryFilter,
): BrandAsset[] {
  return assets.filter((asset) => {
    if (
      filter.resourceType !== ANY &&
      asset.resourceType !== filter.resourceType
    ) {
      return false;
    }
    if (filter.category !== ANY && asset.category !== filter.category) {
      return false;
    }
    if (filter.product !== ANY && asset.product !== filter.product) {
      return false;
    }
    if (filter.format !== ANY) {
      const hasFormat = asset.files.some(
        (file) => fileFormat(file) === filter.format,
      );
      if (!hasFormat) return false;
    }
    return matchesSearch(asset, filter.search.trim());
  });
}

export function filesForBulkDownload(
  assets: BrandAsset[],
  formatFilter?: string | typeof ANY | null,
): BrandAsset["files"][number][] {
  const files = assets.flatMap((asset) => asset.files);
  if (!formatFilter || formatFilter === ANY) return files;
  return files.filter((file) => fileFormat(file) === formatFilter);
}
