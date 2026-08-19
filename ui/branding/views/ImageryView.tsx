"use client";

import * as React from "react";
import { Card, CardContent } from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import { Check, Image as ImageIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { featuredAssetsForCategory } from "@/contexts/brand-assets/domain/services/asset-featured";
import { GuidelineDownloadsSection } from "@/ui/branding/components/guideline-downloads-section";

const IMAGERY_DO_KEYS = ["approvedSets", "contrast", "crop"] as const;
const IMAGERY_DONT_KEYS = ["stretch", "recolor", "clutter"] as const;

export function ImageryView() {
  const t = useTranslations("branding.imagery");
  const { assets, loading, loadError } = useCategoryAssets("brand-imagery");

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<ImageIcon className="h-8 w-8" aria-hidden />}
      />

      <Card className="@container">
        <CardContent className="grid grid-cols-1 gap-6 p-6 @md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">{t("doTitle")}</h2>
            <ul className="space-y-2">
              {IMAGERY_DO_KEYS.map((key) => (
                <li key={key} className="flex gap-2 text-sm">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-success"
                    aria-hidden
                  />
                  <span>{t(`dos.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">{t("dontTitle")}</h2>
            <ul className="space-y-2">
              {IMAGERY_DONT_KEYS.map((key) => (
                <li key={key} className="flex gap-2 text-sm">
                  <X
                    className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
                    aria-hidden
                  />
                  <span>{t(`donts.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <GuidelineDownloadsSection
        title={t("libraryTitle")}
        description={t("libraryDescription")}
        category="brand-imagery"
        assets={featuredAssetsForCategory(assets, "brand-imagery")}
        loading={loading}
        loadError={loadError}
        errorMessage={t("loadError")}
        expandPreview
        skeletonCount={3}
      />
    </div>
  );
}
