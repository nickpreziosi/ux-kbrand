"use client";

import * as React from "react";
import {
  Empty,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Skeleton,
} from "@k-lab/components";
import { FolderOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { AssetCard } from "./asset-card";

interface AssetGridProps {
  assets: BrandAsset[];
  loading?: boolean;
  skeletonCount?: number;
}

export function AssetGrid({ assets, loading = false, skeletonCount = 4 }: AssetGridProps) {
  const t = useTranslations("assets");

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <Empty>
        <EmptyIcon>
          <FolderOpen aria-hidden />
        </EmptyIcon>
        <EmptyTitle>{t("empty.title")}</EmptyTitle>
        <EmptyDescription>{t("empty.description")}</EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
}
