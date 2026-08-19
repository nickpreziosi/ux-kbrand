"use client";

import * as React from "react";
import { Button } from "@k-lab/components";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { assetLibraryHref } from "@/contexts/brand-assets/domain/services/asset-filtering";
import { AssetGrid } from "@/ui/brand-assets/components/asset-grid";

interface GuidelineDownloadsSectionProps {
  title: string;
  description: string;
  category: AssetCategory;
  assets: BrandAsset[];
  loading?: boolean;
  loadError?: string | null;
  errorMessage?: string;
  expandPreview?: boolean;
  skeletonCount?: number;
}

/**
 * Guideline-page download strip: a capped featured grid plus View all into
 * the Asset Library. Usage mockups on the page stay out of this section.
 */
export function GuidelineDownloadsSection({
  title,
  description,
  category,
  assets,
  loading = false,
  loadError,
  errorMessage,
  expandPreview = false,
  skeletonCount,
}: GuidelineDownloadsSectionProps) {
  const t = useTranslations("assets");
  const tCategories = useTranslations("brand.categories");
  const viewAll = t("viewAll", { category: tCategories(`${category}.title`) });

  return (
    <section className="@container space-y-4" aria-label={title}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button href={assetLibraryHref({ category })} variant="outline" size="sm">
          {viewAll}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
      {loadError ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : assets.length > 0 || loading ? (
        <AssetGrid
          assets={assets}
          loading={loading}
          expandPreview={expandPreview}
          skeletonCount={skeletonCount}
        />
      ) : null}
    </section>
  );
}