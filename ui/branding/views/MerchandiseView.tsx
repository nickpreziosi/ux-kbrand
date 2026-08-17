"use client";

import * as React from "react";
import Image from "next/image";
import { Badge, Card, CardContent } from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import type { LucideIcon } from "lucide-react";
import {
  Check,
  Coffee,
  GraduationCap,
  NotebookPen,
  Shirt,
  ShoppingBag,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { AssetGrid } from "@/ui/brand-assets/components/asset-grid";

/**
 * Merchandise families from the guidelines. Product photography is pending —
 * each card pairs the item with its documented logo/color treatment on the
 * navy surface the artwork uses.
 */
const MERCH_ITEMS: { id: string; icon: LucideIcon }[] = [
  { id: "tshirt", icon: Shirt },
  { id: "cap", icon: GraduationCap },
  { id: "drinkware", icon: Coffee },
  { id: "tote", icon: ShoppingBag },
  { id: "notebook", icon: NotebookPen },
];

const MERCH_RULE_KEYS = ["surface", "lockup", "linework", "approval"] as const;

export function MerchandiseView() {
  const t = useTranslations("branding.merchandise");
  // Merch artwork and photography land in the merchandise category; the
  // section below stays hidden until an admin publishes the first one.
  const { assets, loading } = useCategoryAssets("merchandise");

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<ShoppingBag className="h-8 w-8" aria-hidden />}
      />

      <section className="@container space-y-4" aria-label={t("itemsTitle")}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold">{t("itemsTitle")}</h2>
          <Badge variant="outline">{t("placeholderBadge")}</Badge>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {t("itemsDescription")}
        </p>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
          {MERCH_ITEMS.map(({ id, icon: Icon }) => (
            <Card key={id} className="flex h-full flex-col overflow-hidden">
              <div className="relative flex aspect-[4/3] items-center justify-center bg-[#0a1428]">
                <Icon
                  className="h-14 w-14 text-sky-200/80"
                  strokeWidth={1.25}
                  aria-hidden
                />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <Image
                    src="/brand-files/logos/k-lab-logo-white.png"
                    alt=""
                    width={88}
                    height={28}
                    unoptimized
                    className="h-4 w-auto"
                  />
                </div>
              </div>
              <CardContent className="flex flex-1 flex-col gap-1 p-4">
                <h3 className="text-sm font-semibold">{t(`items.${id}.title`)}</h3>
                <p className="text-sm text-muted-foreground">
                  {t(`items.${id}.description`)}
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

      {!loading && assets.length > 0 ? (
        <section
          className="@container space-y-4"
          aria-label={t("libraryTitle")}
        >
          <div>
            <h2 className="text-xl font-semibold">{t("libraryTitle")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("libraryDescription")}
            </p>
          </div>
          <AssetGrid assets={assets} loading={false} />
        </section>
      ) : null}
    </div>
  );
}
