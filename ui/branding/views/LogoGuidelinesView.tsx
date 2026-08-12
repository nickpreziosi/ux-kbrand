"use client";

import * as React from "react";
import Image from "next/image";
import {
  Button,
  Card,
  CardContent,
  PageHeader,
  Skeleton,
  cn,
} from "@k-lab/components";
import { Check, Download, PenTool, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { usePublicAssets } from "@/ui/brand-assets/hooks/use-public-assets";
import { AssetGrid } from "@/ui/brand-assets/components/asset-grid";
import {
  LOGO_RULE_KEYS,
  LOGO_VARIANTS,
  type LogoVariant,
} from "@/ui/branding/content/logo-variants";

const SURFACE_CLASS: Record<LogoVariant["surface"], string> = {
  light: "bg-white",
  // Deep navy from the brand identity palette — the surface these lockups
  // are actually designed against.
  dark: "bg-[hsl(210_100%_5%)]",
};

function LogoVariantCard({
  variant,
  asset,
}: {
  variant: LogoVariant;
  asset?: BrandAsset;
}) {
  const t = useTranslations("branding.logo.variants");
  const tCommon = useTranslations("branding.logo");

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div
        className={cn(
          "relative flex aspect-[16/9] items-center justify-center border-b border-border p-8",
          SURFACE_CLASS[variant.surface],
        )}
      >
        {asset?.previewUrl ? (
          <Image
            src={asset.previewUrl}
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
        <p className="flex-1 text-sm text-muted-foreground">{t(`${variant.id}.usage`)}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-fit"
          icon={<Download aria-hidden />}
          href={asset?.file.downloadUrl ?? "#"}
          target="_blank"
          rel="noopener"
          disabled={!asset}
        >
          {tCommon("downloadVariant")}
        </Button>
      </CardContent>
    </Card>
  );
}

export function LogoGuidelinesView() {
  const t = useTranslations("branding.logo");
  const { assets, loading, loadError } = usePublicAssets("logos");

  const variantAssets = React.useMemo(
    () =>
      LOGO_VARIANTS.map((variant) => ({
        variant,
        asset: assets.find((asset) =>
          variant.matchTags.every((tag) => asset.tags.includes(tag)),
        ),
      })),
    [assets],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<PenTool className="h-8 w-8" aria-hidden />}
      />

      {loadError ? (
        <p className="text-sm text-destructive">{t("loadError")}</p>
      ) : (
        <>
          <section className="space-y-4" aria-label={t("variantsAriaLabel")}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {loading
                ? LOGO_VARIANTS.map((variant) => (
                    <Skeleton key={variant.id} className="aspect-[16/11] w-full" />
                  ))
                : variantAssets.map(({ variant, asset }) => (
                    <LogoVariantCard key={variant.id} variant={variant} asset={asset} />
                  ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardContent className="space-y-3 p-6">
                <h2 className="text-lg font-semibold">{t("clearspaceTitle")}</h2>
                <p className="text-sm text-muted-foreground">{t("clearspaceDescription")}</p>
                <div className="flex items-center justify-center rounded-app-radius border border-dashed border-border bg-secondary p-6">
                  <div className="relative border border-dashed border-accent-brand/60 p-6">
                    <span className="text-3xl font-bold tracking-tight">K Lab</span>
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary px-1 text-[10px] font-semibold uppercase tracking-wider text-accent-brand">
                      1×
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{t("minimumSize")}</p>
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
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
                      <span>{t(`rules.donts.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4" aria-label={t("allFilesTitle")}>
            <div>
              <h2 className="text-xl font-semibold">{t("allFilesTitle")}</h2>
              <p className="text-sm text-muted-foreground">{t("allFilesDescription")}</p>
            </div>
            <AssetGrid assets={assets} loading={loading} />
          </section>
        </>
      )}
    </div>
  );
}
