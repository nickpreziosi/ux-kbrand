import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import type {
  AssetStatus,
  AssetVisibility,
  BrandAsset,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";

/**
 * Display order for the format chips on a card. Raster first (what most people
 * came for), then vector, then editable masters. Anything unlisted sorts after
 * these, alphabetically, so a new extension appears predictably instead of
 * jumping to the front.
 */
export const ASSET_FORMAT_ORDER: readonly string[] = [
  "png",
  "svg",
  "webp",
  "jpg",
  "jpeg",
  "gif",
  "pdf",
  "ai",
  "eps",
  "ttf",
  "otf",
  "css",
] as const;

/** The format a file name encodes, lowercased, or null when it has none. */
export function formatFromFileName(fileName: string): string | null {
  const dot = fileName.lastIndexOf(".");
  if (dot >= 0 && dot < fileName.length - 1) {
    return fileName.slice(dot + 1).toLowerCase();
  }
  return null;
}

/**
 * The file's format, lowercased, from its extension. Falls back to a format
 * tag when the name has no usable extension.
 */
export function assetFormat(asset: BrandAsset): string | null {
  return (
    formatFromFileName(asset.file.fileName) ??
    ASSET_FORMAT_ORDER.find((format) => asset.tags.includes(format)) ??
    null
  );
}

function formatRank(asset: BrandAsset): number {
  const format = assetFormat(asset);
  const index = format ? ASSET_FORMAT_ORDER.indexOf(format) : -1;
  return index === -1 ? ASSET_FORMAT_ORDER.length : index;
}

/**
 * One artwork and every file that encodes it. Single-file assets become
 * one-member groups, so listings can treat everything uniformly.
 */
export interface AssetGroup {
  /** The shared `groupId`, or the lone asset's id when there is no group. */
  id: string;
  title: string;
  description: string;
  /** Members in `ASSET_FORMAT_ORDER`; the first is the group's default file. */
  assets: BrandAsset[];
  /** Member whose thumbnail represents the group (first one that has a preview). */
  preview: BrandAsset;
  /** Most restrictive member visibility — a group is only as open as its tightest file. */
  visibility: AssetVisibility;
  /** Shared by every member — group edits move the whole set at once. */
  category: AssetCategory;
  /** Archived only when every format is; one live format keeps the card listed. */
  status: AssetStatus;
  tags: string[];
  /** Most recent member edit. */
  updatedAt: string;
  totalBytes: number;
}

/**
 * Drops the tags that are just format markers for files in this set, so group
 * tags survive a round trip through the admin form without "png" leaking onto
 * the SVG. Formats the group doesn't ship are left alone — they were meant.
 */
export function withoutFormatTags(
  tags: string[],
  members: Pick<BrandAsset, "file">[],
): string[] {
  const formats = new Set(
    members
      .map((member) => formatFromFileName(member.file.fileName))
      .filter((format): format is string => Boolean(format)),
  );
  return tags.filter((tag) => !formats.has(tag.toLowerCase()));
}

/** The stored tag list for one file: the group's tags plus its own format. */
export function withFormatTag(tags: string[], fileName: string): string[] {
  const format = formatFromFileName(fileName);
  if (!format || tags.some((tag) => tag.toLowerCase() === format)) return tags;
  return [...tags, format];
}

function toGroup(id: string, members: BrandAsset[]): AssetGroup {
  const assets = [...members].sort((a, b) => {
    const rank = formatRank(a) - formatRank(b);
    if (rank !== 0) return rank;
    return (assetFormat(a) ?? "").localeCompare(assetFormat(b) ?? "");
  });
  const [primary] = assets;

  return {
    id,
    title: primary.groupTitle ?? primary.title,
    description: primary.groupDescription ?? primary.description,
    assets,
    preview: assets.find((asset) => asset.previewUrl) ?? primary,
    visibility: assets.some((asset) => asset.visibility === "employee")
      ? "employee"
      : "public",
    category: primary.category,
    status: assets.every((asset) => asset.status === "archived")
      ? "archived"
      : "active",
    // Format tags ("png", "svg") describe a file, not the artwork — the group
    // carries only the tags that mean the same thing for every member.
    tags: withoutFormatTags(primary.tags, assets),
    updatedAt: assets.reduce(
      (latest, asset) => (asset.updatedAt > latest ? asset.updatedAt : latest),
      primary.updatedAt,
    ),
    totalBytes: assets.reduce((sum, asset) => sum + asset.file.sizeBytes, 0),
  };
}

/**
 * The key an asset groups under. Pre-grouping assets have no `groupId`, so they
 * group under their own id — which is also the id an admin edits them by, and
 * the id they keep once a second format joins them.
 */
export function groupKey(asset: BrandAsset): string {
  return asset.groupId ?? asset.id;
}

/** Every member of one group, in stored order. */
export function groupMembers(assets: BrandAsset[], key: string): BrandAsset[] {
  return assets.filter((asset) => groupKey(asset) === key);
}

/**
 * A member's own title. Multi-format groups suffix the format so the file is
 * identifiable on its own ("K Lab logo — primary (blue), SVG"); a group of one
 * is just the artwork. Titles are derived, never hand-edited per file, so a
 * group rename or a new format cannot leave members disagreeing.
 */
export function memberTitle(
  groupTitle: string,
  fileName: string,
  multiFormat: boolean,
): string {
  if (!multiFormat) return groupTitle;
  const format = formatFromFileName(fileName);
  return format ? `${groupTitle}, ${format.toUpperCase()}` : groupTitle;
}

/**
 * Stable, readable group id from the artwork title ("K Lab logo — primary" →
 * "k-lab-logo-primary"), disambiguated against ids already in use. Readable
 * because it shows up in bundle download URLs.
 */
export function makeGroupId(title: string, taken: Iterable<string>): string {
  const slug =
    title
      // NFKD splits accented letters into letter + combining mark, so dropping
      // the marks keeps "Diseño" as "diseno" rather than "dise-o".
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)
      .replace(/-+$/g, "") || "asset-group";

  const used = new Set(taken);
  if (!used.has(slug)) return slug;
  for (let n = 2; ; n += 1) {
    const candidate = `${slug}-${n}`;
    if (!used.has(candidate)) return candidate;
  }
}

/**
 * Collapses format duplicates into one group per artwork. Groups appear in the
 * order their first member appeared, so the catalog's own ordering survives.
 */
export function groupBrandAssets(assets: BrandAsset[]): AssetGroup[] {
  const order: string[] = [];
  const members = new Map<string, BrandAsset[]>();

  for (const asset of assets) {
    const key = groupKey(asset);
    const existing = members.get(key);
    if (existing) {
      existing.push(asset);
      continue;
    }
    members.set(key, [asset]);
    order.push(key);
  }

  return order.map((key) => toGroup(key, members.get(key)!));
}
