"use client";

import * as React from "react";
import { Card, CardContent, CardTitle } from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import { Type as TypeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { AssetGrid } from "@/ui/brand-assets/components/asset-grid";
import {
  ARIAL_STACK,
  TYPE_HIERARCHY,
  TYPEFACE_CHARACTER_SET,
  TYPEFACE_NAME,
  TYPEFACE_WEIGHTS,
  TYPOGRAPHY_TOKEN_FILE,
} from "@/ui/branding/content/typeface";

export function TypographyView() {
  const t = useTranslations("branding.typography");
  const { assets, loading, loadError } = useCategoryAssets("fonts");
  const fontFiles = assets.filter(
    (asset) => !asset.files.some((file) => file.fileName === TYPOGRAPHY_TOKEN_FILE),
  );

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<TypeIcon className="h-8 w-8" aria-hidden />}
      />

      <section className="space-y-4" aria-label={t("typefaceTitle")}>
        <div>
          <h2 className="text-xl font-semibold">{t("typefaceTitle")}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {t("typefaceDescription")}
          </p>
        </div>
        <Card>
          <CardContent className="space-y-8 p-6">
            <p className="font-extrabold tracking-tight text-5xl sm:text-6xl">
              {TYPEFACE_NAME}
            </p>
            <div className="space-y-1 font-extrabold leading-tight tracking-tight">
              {TYPEFACE_CHARACTER_SET.map((line) => (
                <p key={line} className="break-all text-2xl sm:text-3xl">
                  {line}
                </p>
              ))}
            </div>
            <div className="space-y-3 border-t border-border pt-6">
              {TYPEFACE_WEIGHTS.map((cut) => (
                <div
                  key={cut.id}
                  className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="w-36 shrink-0 text-sm text-muted-foreground">
                    {t(`weights.${cut.id}`)}
                  </span>
                  <span className={`${cut.className} text-2xl tracking-tight`}>
                    {TYPEFACE_NAME}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4" aria-label={t("hierarchyTitle")}>
        <div>
          <h2 className="text-xl font-semibold">{t("hierarchyTitle")}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {t("hierarchyDescription")}
          </p>
        </div>
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {TYPE_HIERARCHY.map((role) => (
              <div
                key={role.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <div className="shrink-0 sm:w-56">
                  <CardTitle className="text-base leading-snug">
                    {t(`hierarchy.${role.id}.label`)}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {role.typeface} — {role.cut}
                  </p>
                </div>
                <p
                  className={`${role.className} min-w-0 text-lg sm:text-end`}
                  style={
                    role.typeface === "Arial"
                      ? { fontFamily: ARIAL_STACK }
                      : undefined
                  }
                >
                  {t(`hierarchy.${role.id}.specimen`)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4" aria-label={t("downloadsTitle")}>
        <div>
          <h2 className="text-xl font-semibold">{t("downloadsTitle")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("downloadsDescription")}
          </p>
        </div>
        {loadError ? (
          <p className="text-sm text-destructive">{t("loadError")}</p>
        ) : (
          <AssetGrid assets={fontFiles} loading={loading} skeletonCount={2} />
        )}
      </section>
    </div>
  );
}
