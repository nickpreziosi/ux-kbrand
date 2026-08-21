"use client";

import * as React from "react";
import Image from "next/image";
import { Badge, Card, CardContent } from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import { Boxes } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";

/**
 * The approved sub-brand roster. Kena is deliberately absent (retired from
 * the portfolio — see the Brand & Sales Portal Expansion story). K Risk uses
 * the same chevron lockup system as K Rails and K Talk. K Leads files are
 * still pending, so that roster card stays a typographic placeholder.
 */
const SUB_BRANDS = [
  { id: "kRails", name: "K Rails", assetTag: "k-rails" },
  { id: "kTalk", name: "K Talk", assetTag: "k-talk" },
  { id: "kRisk", name: "K Risk", assetTag: "k-risk" },
  { id: "kLeads", name: "K Leads", assetTag: null },
] as const;

/** Typographic stand-in following the chevron lockup construction —
 *  monochrome like the real lockups (rendered on the card's white surface). */
function LockupPlaceholder({ name }: { name: string }) {
  return (
    <span className="flex items-baseline gap-2 font-sans text-3xl font-bold tracking-tight text-neutral-900">
      <span aria-hidden>&gt;</span>
      {name}
    </span>
  );
}

export function SubBrandsView() {
  const t = useTranslations("branding.subBrands");
  const { assets, loadError } = useCategoryAssets("logos");

  const productAssets = React.useMemo(
    () => assets.filter((asset) => asset.product !== "k-lab"),
    [assets],
  );

  /** Dark flat lockup previews for the roster cards, by sub-brand tag. */
  const lockupPreview = React.useCallback(
    (tag: string) =>
      productAssets.find(
        (asset) =>
          asset.product === tag &&
          asset.tags.includes("dark") &&
          asset.previewUrl,
      ),
    [productAssets],
  );

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<Boxes className="h-8 w-8" aria-hidden />}
      />

      {loadError ? (
        <p className="text-sm text-destructive">{t("loadError")}</p>
      ) : null}

      <Card>
        <CardContent className="space-y-2 p-6">
          <h2 className="text-lg font-semibold">{t("systemTitle")}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {t("systemDescription")}
          </p>
        </CardContent>
      </Card>

      <section className="@container space-y-4" aria-label={t("rosterTitle")}>
        <div>
          <h2 className="text-xl font-semibold">{t("rosterTitle")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("rosterDescription")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2">
          {SUB_BRANDS.map((brand) => {
            const preview = brand.assetTag
              ? lockupPreview(brand.assetTag)
              : undefined;
            return (
              <Card key={brand.id} className="flex h-full flex-col">
                <div className="flex min-h-36 items-center justify-center border-b border-border bg-white p-8">
                  {preview?.previewUrl ? (
                    <Image
                      src={preview.previewUrl}
                      alt={brand.name}
                      width={240}
                      height={62}
                      unoptimized
                      className="h-9 w-auto max-w-full object-contain sm:h-10"
                    />
                  ) : (
                    <LockupPlaceholder name={brand.name} />
                  )}
                </div>
                <CardContent className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold">{brand.name}</h3>
                    {!brand.assetTag ? (
                      <Badge variant="outline">{t("assetsPendingBadge")}</Badge>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t(`brands.${brand.id}`)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
