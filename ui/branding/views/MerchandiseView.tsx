"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import { Check, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { featuredAssetsForCategory } from "@/contexts/brand-assets/domain/services/asset-featured";
import { GuidelineDownloadsSection } from "@/ui/branding/components/guideline-downloads-section";

/**
 * Merchandise families from the guidelines, shown with the product renders
 * from those artboards.
 */
const MERCH_ITEMS = [
  { id: "tshirt", src: "/brand-files/merchandise/k-lab-merch-tshirt.png" },
  { id: "cap", src: "/brand-files/merchandise/k-lab-merch-cap.png" },
  { id: "drinkware", src: "/brand-files/merchandise/k-lab-merch-drinkware.png" },
  { id: "tote", src: "/brand-files/merchandise/k-lab-merch-tote.png" },
  { id: "notebook", src: "/brand-files/merchandise/k-lab-merch-notebook.png" },
] as const;

const MERCH_RULE_KEYS = ["surface", "lockup", "linework", "approval"] as const;

export function MerchandiseView() {
  const t = useTranslations("branding.merchandise");
  // Production files land in the merchandise category; the section below
  // stays hidden until an admin publishes the first one.
  const { assets, loading } = useCategoryAssets("merchandise");

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<ShoppingBag className="h-8 w-8" aria-hidden />}
      />

      <section className="@container space-y-4" aria-label={t("itemsTitle")}>
        <div>
          <h2 className="text-xl font-semibold">{t("itemsTitle")}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {t("itemsDescription")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
          {MERCH_ITEMS.map((item) => (
            <Card key={item.id} className="flex h-full flex-col overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <Image
                  src={item.src}
                  alt={t(`items.${item.id}.title`)}
                  fill
                  unoptimized
                  className="object-contain p-4"
                />
              </div>
              <CardContent className="flex flex-1 flex-col gap-1 p-4">
                <h3 className="text-sm font-semibold">
                  {t(`items.${item.id}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`items.${item.id}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <CardContent className="space-y-3 p-6">
          <h2 className="text-lg font-semibold">{t("rulesTitle")}</h2>
          <ul className="space-y-2">
            {MERCH_RULE_KEYS.map((key) => (
              <li key={key} className="flex gap-2 text-sm">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-success"
                  aria-hidden
                />
                <span>{t(`rules.${key}`)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <GuidelineDownloadsSection
        title={t("libraryTitle")}
        description={t("libraryDescription")}
        category="merchandise"
        assets={featuredAssetsForCategory(assets, "merchandise")}
        loading={loading}
      />
    </div>
  );
}
