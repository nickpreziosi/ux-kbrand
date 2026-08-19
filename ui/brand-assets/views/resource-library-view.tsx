"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@k-lab/components";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import type {
  AssetCategory,
  AssetResourceType,
} from "@/contexts/brand-assets/domain/models/asset-category.model";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import {
  ANY,
  parseLibraryFilter,
  serializeLibraryFilter,
  type LibraryFilter,
} from "@/contexts/brand-assets/domain/services/asset-filtering";
import { AssetGrid } from "@/ui/brand-assets/components/asset-grid";
import { AssetLibraryToolbar } from "@/ui/brand-assets/components/asset-library-toolbar";
import { useLibraryAssets } from "@/ui/brand-assets/hooks/use-library-assets";
import { downloadBrandBundle } from "@/ui/brand-assets/lib/download-brand-bundle";

export interface ResourceLibraryViewProps {
  resourceType: AssetResourceType;
  categories: readonly AssetCategory[];
  headerNamespace: "assetLibrary" | "sales";
  icon: React.ReactNode;
}

/**
 * Download-first library used by both /assets (brand) and /sales. The page
 * owns resourceType; URL facets never include it.
 */
export function ResourceLibraryView({
  resourceType,
  categories,
  headerNamespace,
  icon,
}: ResourceLibraryViewProps) {
  const t = useTranslations(headerNamespace);
  const tLibrary = useTranslations("assetLibrary");
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  const allowedCategories = React.useMemo(() => new Set(categories), [categories]);

  const filter = React.useMemo<LibraryFilter>(() => {
    const parsed = parseLibraryFilter(new URLSearchParams(query));
    const category =
      parsed.category === ANY || allowedCategories.has(parsed.category)
        ? parsed.category
        : ANY;
    return { ...parsed, category, resourceType };
  }, [query, resourceType, allowedCategories]);

  const { assets, loading, loadError } = useLibraryAssets(filter);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [downloading, setDownloading] = React.useState(false);

  React.useEffect(() => {
    const visible = new Set(assets.map((asset) => asset.id));
    setSelectedIds((current) => {
      const next = new Set([...current].filter((id) => visible.has(id)));
      return next.size === current.size ? current : next;
    });
  }, [assets]);

  const setFilter = (next: LibraryFilter) => {
    const params = serializeLibraryFilter({ ...next, resourceType: ANY });
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  const allSelected =
    assets.length > 0 && assets.every((asset) => selectedIds.has(asset.id));

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(assets.map((asset) => asset.id)));
  };

  const formatFilter = filter.format !== ANY ? filter.format : undefined;
  const downloadLabel = formatFilter
    ? tLibrary("downloadSelectedFormat", { format: formatFilter.toUpperCase() })
    : tLibrary("downloadSelectedAllFormats");

  const handleDownload = async () => {
    if (selectedIds.size === 0) return;
    setDownloading(true);
    try {
      await downloadBrandBundle({
        assetIds: assets
          .filter((asset) => selectedIds.has(asset.id))
          .map((asset) => asset.id),
        ...(formatFilter ? { format: formatFilter } : {}),
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={icon}
      />

      {loadError ? (
        <p className="text-sm text-destructive">{t("loadError")}</p>
      ) : (
        <>
          <AssetLibraryToolbar
            filter={filter}
            onFilterChange={setFilter}
            categories={categories}
            resultCount={assets.length}
            totalCount={assets.length}
            disabled={loading}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleSelectAll}
                disabled={loading || assets.length === 0}
              >
                {allSelected ? tLibrary("deselectAll") : tLibrary("selectAll")}
              </Button>
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {tLibrary("selectedCount", { count: selectedIds.size })}
              </p>
            </div>
            <Button
              type="button"
              variant="accent-brand"
              size="sm"
              icon={<Download aria-hidden />}
              onClick={() => void handleDownload()}
              disabled={selectedIds.size === 0 || downloading}
              aria-label={downloadLabel}
            >
              {downloadLabel}
            </Button>
          </div>
          {formatFilter ? null : (
            <p className="text-sm text-muted-foreground">
              {tLibrary("downloadSelectedHint")}
            </p>
          )}

          <AssetGrid
            assets={assets}
            loading={loading}
            selectable
            selectedIds={selectedIds}
            onSelectedChange={(id, selected) => {
              setSelectedIds((current) => {
                const next = new Set(current);
                if (selected) next.add(id);
                else next.delete(id);
                return next;
              });
            }}
          />
        </>
      )}
    </div>
  );
}
