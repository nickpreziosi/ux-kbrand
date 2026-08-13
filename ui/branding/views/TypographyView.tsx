"use client";

import * as React from "react";
import { Card, CardContent, PageHeader, Separator } from "@k-lab/components";
import { Type as TypeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { AssetGrid } from "@/ui/brand-assets/components/asset-grid";
import { FONT_WEIGHTS, TYPE_SCALE } from "@/ui/branding/content/type-scale";

export function TypographyView() {
  const t = useTranslations("branding.typography");
  const { assets, loading, loadError } = useCategoryAssets("fonts");

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<TypeIcon className="h-8 w-8" aria-hidden />}
      />

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-accent-brand">
              {t("typefaceLabel")}
            </span>
            <p className="text-5xl font-bold tracking-tight">Sora</p>
            <p className="max-w-2xl text-sm text-muted-foreground">{t("typefaceDescription")}</p>
          </div>
          <Separator />
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">{t("weightsTitle")}</h2>
            <div className="space-y-1.5">
              {FONT_WEIGHTS.map(({ weight, className }) => (
                <div key={weight} className="flex items-baseline gap-4">
                  <span className="w-10 shrink-0 text-xs text-muted-foreground">{weight}</span>
                  <span className={`${className} truncate text-xl`}>
                    {t("specimenText")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4" aria-label={t("scaleTitle")}>
        <div>
          <h2 className="text-xl font-semibold">{t("scaleTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("scaleDescription")}</p>
        </div>
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {TYPE_SCALE.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-2 p-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <p className={`${entry.className} min-w-0 truncate`}>
                  {t(`scale.${entry.id}`)}
                </p>
                <p className="shrink-0 font-mono text-xs text-muted-foreground">
                  {entry.size} · {entry.weight} · {entry.lineHeight}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4" aria-label={t("downloadsTitle")}>
        <div>
          <h2 className="text-xl font-semibold">{t("downloadsTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("downloadsDescription")}</p>
        </div>
        {loadError ? (
          <p className="text-sm text-destructive">{t("loadError")}</p>
        ) : (
          <AssetGrid assets={assets} loading={loading} skeletonCount={2} />
        )}
      </section>
    </div>
  );
}
