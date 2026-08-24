"use client";

import * as React from "react";
import { Button } from "@k-lab/components";
import { ArrowRight, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { assetLibraryHref } from "@/contexts/brand-assets/domain/services/asset-filtering";
import { downloadAssetBundle } from "@/ui/brand-assets/lib/download-asset-bundle";

interface GuidelineDownloadsSectionProps {
  category: AssetCategory;
  assets: BrandAsset[];
  loading?: boolean;
}

/**
 * View all + category package, for the guideline page header actions slot.
 * Download sits last so every header keeps the same end-aligned CTA.
 */
export function GuidelineDownloadsSection({
  category,
  assets,
  loading = false,
}: GuidelineDownloadsSectionProps) {
  const t = useTranslations("assets");
  const tCategories = useTranslations("brand.categories");
  const categoryTitle = tCategories(`${category}.title`);
  const viewAll = t("viewAll", { category: categoryTitle });
  const downloadPackage = t("downloadPackage", { category: categoryTitle });
  const [zipping, setZipping] = React.useState(false);
  const packageDisabled = loading || zipping || assets.length === 0;

  const handlePackage = async () => {
    if (packageDisabled) return;
    setZipping(true);
    try {
      await downloadAssetBundle({
        assetIds: assets.map((asset) => asset.id),
        filename: `${category}.zip`,
      });
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button href={assetLibraryHref({ category })} variant="outline">
        {viewAll}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="accent-brand"
        icon={<Download aria-hidden />}
        onClick={() => void handlePackage()}
        disabled={packageDisabled}
      >
        {downloadPackage}
      </Button>
    </div>
  );
}
