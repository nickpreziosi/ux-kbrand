import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import type {
  AssetStatus,
  AssetVisibility,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  assetFormat,
  type AssetGroup,
} from "@/contexts/brand-assets/domain/services/asset-grouping";

/** Every facet is either narrowed to one value or left wide open. */
export const ANY = "all";

export interface AssetGroupFilter {
  search: string;
  category: AssetCategory | typeof ANY;
  visibility: AssetVisibility | typeof ANY;
  status: AssetStatus | typeof ANY;
}

export const EMPTY_ASSET_GROUP_FILTER: AssetGroupFilter = {
  search: "",
  category: ANY,
  visibility: ANY,
  status: ANY,
};

export function hasActiveAssetGroupFilter(filter: AssetGroupFilter): boolean {
  return (
    filter.search.trim().length > 0 ||
    filter.category !== ANY ||
    filter.visibility !== ANY ||
    filter.status !== ANY
  );
}

/**
 * Everything about a group worth typing into a search box. File names and
 * formats are in here on purpose: an admin looking for "the SVG" or for
 * "k-lab-logomark-white" is searching the files, not the artwork's title, and
 * those live one level down from the row.
 */
function searchableText(group: AssetGroup): string {
  return [
    group.title,
    group.description,
    group.category,
    ...group.tags,
    ...group.assets.flatMap((asset) => [
      asset.file.fileName,
      assetFormat(asset) ?? "",
    ]),
  ]
    .join(" ")
    .toLowerCase();
}

/**
 * Terms are ANDed, so "logo svg" narrows to the artwork that ships an SVG
 * rather than returning everything matching either word — with one row per
 * artwork and several formats folded into it, an OR search is barely a filter.
 */
function matchesSearch(group: AssetGroup, search: string): boolean {
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = searchableText(group);
  return terms.every((term) => haystack.includes(term));
}

/** The admin table's client-side filter — the catalog is small enough to sift here. */
export function filterAssetGroups(
  groups: AssetGroup[],
  filter: AssetGroupFilter,
): AssetGroup[] {
  return groups.filter((group) => {
    if (filter.category !== ANY && group.category !== filter.category) {
      return false;
    }
    if (filter.visibility !== ANY && group.visibility !== filter.visibility) {
      return false;
    }
    if (filter.status !== ANY && group.status !== filter.status) {
      return false;
    }
    return matchesSearch(group, filter.search.trim());
  });
}
