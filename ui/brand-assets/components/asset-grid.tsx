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
import {
  groupBrandAssets,
  type AssetGroup,
} from "@/contexts/brand-assets/domain/services/asset-grouping";
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
  const [previewGroup, setPreviewGroup] = React.useState<AssetGroup | null>(
    null,
  );
  // Format duplicates (the same logo as PNG, SVG, PDF, AI) collapse into one
  // card; assets without a group stay one card each, exactly as before.
  const groups = React.useMemo(() => groupBrandAssets(assets), [assets]);

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
        {groups.map((group) => (
          <AssetCard
            key={group.id}
            group={group}
            showVisibility={showVisibility}
            onPreview={
              expandPreview && group.preview.previewUrl
                ? () => setPreviewGroup(group)
                : undefined
            }
          />
        ))}
      </div>
      {expandPreview ? (
        <AssetPreviewDialog
          asset={previewGroup?.preview ?? null}
          title={previewGroup?.title}
          open={Boolean(previewGroup)}
          onOpenChange={(open) => {
            if (!open) setPreviewGroup(null);
          }}
        />
      ) : null}
    </div>
  );
}
