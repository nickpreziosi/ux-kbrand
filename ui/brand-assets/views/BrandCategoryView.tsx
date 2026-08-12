"use client";

import * as React from "react";
import { PageHeader } from "@k-lab/components";
import { BookOpen, Image as ImageIcon, PenTool, Type } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { usePublicAssets } from "@/ui/brand-assets/hooks/use-public-assets";
import { AssetGrid } from "@/ui/brand-assets/components/asset-grid";

const CATEGORY_ICONS: Partial<Record<AssetCategory, React.ReactNode>> = {
  "brand-guidelines": <BookOpen className="h-8 w-8" aria-hidden />,
  logos: <PenTool className="h-8 w-8" aria-hidden />,
  "brand-imagery": <ImageIcon className="h-8 w-8" aria-hidden />,
  fonts: <Type className="h-8 w-8" aria-hidden />,
};

interface BrandCategoryViewProps {
  category: AssetCategory;
}

export function BrandCategoryView({ category }: BrandCategoryViewProps) {
  const t = useTranslations("brand");
  const { assets, loading, loadError } = usePublicAssets(category);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(`categories.${category}.title`)}
        subtitle={t(`categories.${category}.subtitle`)}
        icon={CATEGORY_ICONS[category]}
      />
      {loadError ? (
        <p className="text-sm text-destructive">{t("loadError")}</p>
      ) : (
        <AssetGrid assets={assets} loading={loading} />
      )}
    </div>
  );
}
