"use client";

import * as React from "react";
import { Card, CardContent, PageHeader } from "@k-lab/components";
import { Check, Image as ImageIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { AssetGrid } from "@/ui/brand-assets/components/asset-grid";

const IMAGERY_DO_KEYS = ["approvedSets", "contrast", "crop"] as const;
const IMAGERY_DONT_KEYS = ["stretch", "recolor", "clutter"] as const;

export function ImageryView() {
  const t = useTranslations("branding.imagery");
  const { assets, loading, loadError } = useCategoryAssets("brand-imagery");

  return (
    <div className="space-y-8">
      <PageHeader
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

      <section className="@container space-y-4" aria-label={t("libraryTitle")}>
        <div>
          <h2 className="text-xl font-semibold">{t("libraryTitle")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("libraryDescription")}
          </p>
        </div>
        {loadError ? (
          <p className="text-sm text-destructive">{t("loadError")}</p>
        ) : (
          <AssetGrid assets={assets} loading={loading} skeletonCount={3} />
        )}
      </section>
    </div>
  );
}
