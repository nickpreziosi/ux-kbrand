"use client";

import * as React from "react";
import { Tile } from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Image as ImageIcon,
  Palette,
  PenTool,
  Type,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { findBrandBookAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { DocumentViewerCard } from "@/ui/branding/components/document-viewer-card";

const SECTION_TILES: { id: string; href: string; icon: LucideIcon }[] = [
  { id: "logo", href: "/branding/logo", icon: PenTool },
  { id: "colors", href: "/branding/colors", icon: Palette },
  { id: "typography", href: "/branding/typography", icon: Type },
  { id: "imagery", href: "/branding/imagery", icon: ImageIcon },
  { id: "guidelines", href: "/branding/guidelines", icon: BookOpen },
];

export function BrandingOverviewView() {
  const t = useTranslations("branding.overview");
  const tSections = useTranslations("branding.sections");
  const { assets, loading } = useCategoryAssets("brand-guidelines");
  const brandBook = findBrandBookAsset(assets);

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<Palette className="h-8 w-8" aria-hidden />}
      />

      <section
        className="@container space-y-4"
        aria-label={t("sectionsAriaLabel")}
      >
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
          {SECTION_TILES.map(({ id, href, icon }) => (
            <Tile.Navigation
              key={id}
              href={href}
              icon={icon}
              title={tSections(`${id}.title`)}
              description={tSections(`${id}.description`)}
              cta={t("openSection")}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-label={t("sourceOfTruthAriaLabel")}>
        <div>
          <h2 className="text-xl font-semibold">{t("sourceOfTruthTitle")}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {t("sourceOfTruthDescription")}
          </p>
        </div>
        <DocumentViewerCard
          asset={brandBook}
          loading={loading}
          showPreview={false}
        />
      </section>
    </div>
  );
}
