"use client";

import * as React from "react";
import Image from "next/image";
import {
  Button,
  Card,
  CardContent,
  Skeleton,
  cn,
} from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import { Check, Download, PenTool, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { AssetGrid } from "@/ui/brand-assets/components/asset-grid";
import {
  brandDownloadUrl,
  getFormatsForVariant,
  previewAssetForVariant,
  type LogoFormat,
} from "@/ui/branding/content/logo-formats";
import {
  LOGO_RULE_KEYS,
  LOGO_VARIANTS,
  type LogoVariant,
} from "@/ui/branding/content/logo-variants";

// Deep navy / pure white from the brand identity palette — the surfaces these
// lockups are actually designed against, so they stay fixed in both themes
// (see --brand-surface-* in globals.css).
const SURFACE_CLASS: Record<LogoVariant["surface"], string> = {
  light: "bg-brand-surface-light",
  dark: "bg-brand-surface-dark",
};

function LogoVariantCard({
  variant,
  assets,
}: {
  variant: LogoVariant;
  assets: BrandAsset[];
}) {
  const t = useTranslations("branding.logo.variants");
  const tCommon = useTranslations("branding.logo");
  const preview = previewAssetForVariant(assets, variant);
  const formats = getFormatsForVariant(assets, variant);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div
        className={cn(
          "relative flex aspect-[16/9] items-center justify-center border-b border-border p-8",
          SURFACE_CLASS[variant.surface],
        )}
      >
        {preview?.previewUrl ? (
          <Image
            src={preview.previewUrl}
            alt={t(`${variant.id}.name`)}
            width={240}
            height={72}
            unoptimized
            className="max-h-full w-auto max-w-full object-contain"
          />
        ) : (
          <Skeleton className="h-12 w-40" />
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold">{t(`${variant.id}.name`)}</h3>
        <p className="flex-1 text-sm text-muted-foreground">
          {t(`${variant.id}.usage`)}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {formats.map(({ format, asset }) => (
            <Button
              key={asset.id}
              variant="outline"
              size="sm"
              className="w-fit"
              icon={<Download aria-hidden />}
              href={brandDownloadUrl(asset.id)}
            >
              {tCommon(`formats.${format}` as `formats.${LogoFormat}`)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ClearspaceDiagram({
  src,
  alt,
  label,
}: {
  src: string;
  alt: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full items-center justify-center rounded-app-radius border border-dashed border-border bg-secondary p-6">
        <div className="relative border border-dashed border-accent-brand/60 p-6">
          <Image
            src={src}
            alt={alt}
            width={200}
            height={80}
            unoptimized
            className="h-12 w-auto max-w-full object-contain sm:h-16"
          />
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary px-1 text-xs font-semibold uppercase tracking-wider text-accent-brand">
            1×
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

export function LogoGuidelinesView() {
  const t = useTranslations("branding.logo");
  const { assets, loading, loadError } = useCategoryAssets("logos");

  const primaryPreview = previewAssetForVariant(
    assets,
    LOGO_VARIANTS.find((variant) => variant.id === "primary")!,
  );
  const markPreview = previewAssetForVariant(
    assets,
    LOGO_VARIANTS.find((variant) => variant.id === "logomark")!,
  );

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<PenTool className="h-8 w-8" aria-hidden />}
      />

      {loadError ? (
        <p className="text-sm text-destructive">{t("loadError")}</p>
      ) : (
        <>
          <section
            className="@container space-y-4"
            aria-label={t("variantsAriaLabel")}
          >
            <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
              {loading
                ? LOGO_VARIANTS.map((variant) => (
                    <Skeleton
                      key={variant.id}
                      className="aspect-[16/11] w-full"
                    />
                  ))
                : LOGO_VARIANTS.map((variant) => (
                    <LogoVariantCard
                      key={variant.id}
                      variant={variant}
                      assets={assets}
                    />
                  ))}
            </div>
          </section>

          <section className="@container">
            <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2">
              <Card>
                <CardContent className="space-y-3 p-6">
                  <h2 className="text-lg font-semibold">
                    {t("clearspaceTitle")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("clearspaceDescription")}
                  </p>
                  <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2">
                    {primaryPreview?.previewUrl ? (
                      <ClearspaceDiagram
                        src={primaryPreview.previewUrl}
                        alt={t("clearspaceFullLabel")}
                        label={t("clearspaceFullLabel")}
                      />
                    ) : (
                      <Skeleton className="h-32 w-full" />
                    )}
                    {markPreview?.previewUrl ? (
                      <ClearspaceDiagram
                        src={markPreview.previewUrl}
                        alt={t("clearspaceIconLabel")}
                        label={t("clearspaceIconLabel")}
                      />
                    ) : (
                      <Skeleton className="h-32 w-full" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("minimumSize")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-4 p-6">
                  <h2 className="text-lg font-semibold">{t("rulesTitle")}</h2>
                  <ul className="space-y-2">
                    {LOGO_RULE_KEYS.dos.map((key) => (
                      <li key={key} className="flex gap-2 text-sm">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-success"
                          aria-hidden
                        />
                        <span>{t(`rules.dos.${key}`)}</span>
                      </li>
                    ))}
                    {LOGO_RULE_KEYS.donts.map((key) => (
                      <li key={key} className="flex gap-2 text-sm">
                        <X
                          className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
                          aria-hidden
                        />
                        <span>{t(`rules.donts.${key}`)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section
            className="@container space-y-4"
            aria-label={t("allFilesTitle")}
          >
            <div>
              <h2 className="text-xl font-semibold">{t("allFilesTitle")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("allFilesDescription")}
              </p>
            </div>
            <AssetGrid assets={assets} loading={loading} />
          </section>
        </>
      )}
    </div>
  );
}
