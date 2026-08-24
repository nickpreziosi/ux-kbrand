"use client";

import * as React from "react";
import { Badge, Card, CardContent } from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  BadgeCheck,
  Blocks,
  Building,
  Building2,
  Check,
  ClipboardList,
  CreditCard,
  FileText,
  History,
  Landmark,
  Receipt,
  Shapes,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { GuidelineDownloadsSection } from "@/ui/branding/components/guideline-downloads-section";

/** The payment-lifecycle icon set from the Brand Center reference, stood in
 *  with Lucide glyphs until the bespoke set ships. */
const SAMPLE_ICONS: { id: string; icon: LucideIcon }[] = [
  { id: "contract", icon: FileText },
  { id: "purchaseOrder", icon: ClipboardList },
  { id: "invoice", icon: Receipt },
  { id: "approval", icon: BadgeCheck },
  { id: "payment", icon: CreditCard },
  { id: "settlement", icon: ArrowLeftRight },
  { id: "auditTrail", icon: History },
  { id: "blockchainRecord", icon: Blocks },
  { id: "government", icon: Landmark },
  { id: "bankPartner", icon: Building2 },
  { id: "company", icon: Building },
];

const ICON_DO_KEYS = ["set", "stroke", "size", "color"] as const;
const ICON_DONT_KEYS = ["mix", "fill", "effects", "logo"] as const;

export function IconographyView() {
  const t = useTranslations("branding.iconography");
  // Bespoke icon files land in the iconography category; the section below
  // stays hidden until an admin publishes the first one.
  const { assets, loading } = useCategoryAssets("iconography");

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<Shapes className="h-8 w-8" aria-hidden />}
        actions={
          <GuidelineDownloadsSection
            category="iconography"
            assets={assets}
            loading={loading}
          />
        }
      />

      <section className="@container space-y-4" aria-label={t("styleTitle")}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold">{t("styleTitle")}</h2>
          <Badge variant="outline">{t("placeholderBadge")}</Badge>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {t("styleDescription")}
        </p>
        <Card>
          <CardContent className="p-6">
            <ul className="grid grid-cols-3 gap-4 @sm:grid-cols-4 @lg:grid-cols-6">
              {SAMPLE_ICONS.map(({ id, icon: Icon }) => (
                <li
                  key={id}
                  className="flex flex-col items-center gap-2 rounded-app-radius border border-border bg-secondary/50 p-4"
                >
                  <Icon className="h-6 w-6" aria-hidden />
                  <span className="text-center text-xs text-muted-foreground">
                    {t(`samples.${id}`)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <Card className="@container">
        <CardContent className="grid grid-cols-1 gap-6 p-6 @md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">{t("doTitle")}</h2>
            <ul className="space-y-2">
              {ICON_DO_KEYS.map((key) => (
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
              {ICON_DONT_KEYS.map((key) => (
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
    </div>
  );
}
