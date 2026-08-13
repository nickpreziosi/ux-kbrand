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
import { canSeeAssetGating } from "@/contexts/brand-assets/domain/services/asset-access";
import { usePortalRole } from "@/ui/user-management/hooks/use-portal-role";
import { AssetCard } from "./asset-card";
import { AssetPreviewDialog } from "./asset-preview-dialog";

interface AssetGridProps {
  assets: BrandAsset[];
  loading?: boolean;
  skeletonCount?: number;
  /** Click a thumbnail to open a larger preview dialog. */
  expandPreview?: boolean;
}

export function AssetGrid({
  assets,
  loading = false,
  skeletonCount = 4,
  expandPreview = false,
}: AssetGridProps) {
  const t = useTranslations("assets");
  // Employees/admins see each asset's gating on the card; public visitors never do.
  const { viewerRole } = usePortalRole();
  const showVisibility = canSeeAssetGating(viewerRole);
  const [previewAsset, setPreviewAsset] = React.useState<BrandAsset | null>(
    null,
  );

  // Column count tracks the grid's own width, not the viewport: the content
  // area shrinks when the sidebar expands, so viewport breakpoints would leave
  // cards overflowing at exactly the widths that matter.
  if (loading) {
    return (
      <div className="@container">
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4">
          {Array.from({ length: skeletonCount }, (_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
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
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            showVisibility={showVisibility}
            onPreview={
              expandPreview && asset.previewUrl
                ? () => setPreviewAsset(asset)
                : undefined
            }
          />
        ))}
      </div>
      {expandPreview ? (
        <AssetPreviewDialog
          asset={previewAsset}
          open={Boolean(previewAsset)}
          onOpenChange={(open) => {
            if (!open) setPreviewAsset(null);
          }}
        />
      ) : null}
    </div>
  );
}
