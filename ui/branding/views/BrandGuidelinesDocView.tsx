"use client";

import * as React from "react";
import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { findBrandBookAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { AssetGrid } from "@/ui/brand-assets/components/asset-grid";
import {
  BrandBookActions,
  DocumentViewerCard,
} from "@/ui/branding/components/document-viewer-card";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";

export function BrandGuidelinesDocView() {
  const t = useTranslations("branding.guidelines");
  const { assets, loading, loadError } = useCategoryAssets("brand-guidelines");
  const brandBook = findBrandBookAsset(assets);
  const companionDocs = assets.filter((asset) => asset.id !== brandBook?.id);

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<BookOpen className="h-8 w-8" aria-hidden />}
        actions={brandBook ? <BrandBookActions asset={brandBook} /> : undefined}
      />

      {loadError ? (
        <p className="text-sm text-destructive">{t("loadError")}</p>
      ) : (
        <>
          <DocumentViewerCard
            asset={brandBook}
            loading={loading}
            showActions={false}
          />

          {companionDocs.length > 0 ? (
            <section className="space-y-4" aria-label={t("companionAriaLabel")}>
              <div>
                <h2 className="text-xl font-semibold">{t("companionTitle")}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("companionDescription")}
                </p>
              </div>
              <AssetGrid assets={companionDocs} />
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
