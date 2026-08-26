"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, ProductLogo, Tile } from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Boxes,
  Briefcase,
  Camera,
  Image as ImageIcon,
  Palette,
  PenTool,
  Shapes,
  Share2,
  ShoppingBag,
  Type,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { findBrandBookAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { DocumentViewerCard } from "@/ui/branding/components/document-viewer-card";
import {
  OVERVIEW_FUNDAMENTAL_KEYS,
  OVERVIEW_VALUE_KEYS,
  OVERVIEW_VISION_KEYS,
  OVERVIEW_WELCOME_BACKGROUND,
} from "@/ui/branding/content/brand-overview";

const SECTION_TILES: { id: string; href: string; icon: LucideIcon }[] = [
  { id: "logo", href: "/branding/logo", icon: PenTool },
  { id: "colors", href: "/branding/colors", icon: Palette },
  { id: "typography", href: "/branding/typography", icon: Type },
  { id: "iconography", href: "/branding/iconography", icon: Shapes },
  { id: "imagery", href: "/branding/imagery", icon: ImageIcon },
  { id: "photography", href: "/branding/photography", icon: Camera },
  { id: "corporateAssets", href: "/branding/corporate-assets", icon: Briefcase },
  { id: "socialMedia", href: "/branding/social-media", icon: Share2 },
  { id: "merchandise", href: "/branding/merchandise", icon: ShoppingBag },
  { id: "subBrands", href: "/branding/sub-brands", icon: Boxes },
  { id: "guidelines", href: "/branding/guidelines", icon: BookOpen },
];

function ThemeLockup() {
  return (
    <ProductLogo
      product="klab"
      className="h-12 w-auto"
      aria-hidden
    />
  );
}

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

      <section className="@container" aria-label={t("welcomeTitle")}>
        <Card className="overflow-hidden">
          <div className="relative min-h-[22rem] overflow-hidden @lg:min-h-[26rem]">
            <Image
              src={OVERVIEW_WELCOME_BACKGROUND}
              alt=""
              fill
              unoptimized
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
            <div className="relative z-10 flex min-h-[22rem] max-w-2xl flex-col justify-end gap-3 p-6 text-white @lg:min-h-[26rem] @lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                {t("welcomeKicker")}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("welcomeTitle")}
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                {t("welcomeDescription")}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="@container space-y-4" aria-label={t("aboutTitle")}>
        <div>
          <h2 className="text-xl font-semibold">{t("aboutTitle")}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {t("aboutDescription")}
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-start gap-5 p-6 @lg:flex-row @lg:items-center @lg:gap-10">
            <div className="shrink-0">
              <ThemeLockup />
            </div>
            <p className="min-w-0 text-xl font-semibold leading-snug text-accent-brand sm:text-2xl">
              {t("aboutStatement")}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="@container space-y-4" aria-label={t("visionTitle")}>
        <div>
          <h2 className="text-xl font-semibold">{t("visionTitle")}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {t("visionDescription")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2">
          {OVERVIEW_VISION_KEYS.map((key) => (
            <Card key={key} className="h-full">
              <CardContent className="flex h-full flex-col gap-4 p-6">
                <p className="text-lg font-semibold leading-snug text-accent-brand sm:text-xl">
                  {t(`vision.${key}.statement`)}
                </p>
                <p className="mt-auto text-sm text-muted-foreground">
                  {t(`vision.${key}.caption`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        className="@container space-y-4"
        aria-label={t("fundamentalsTitle")}
      >
        <div>
          <h2 className="text-xl font-semibold">{t("fundamentalsTitle")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("fundamentalsKicker")}
          </p>
        </div>
        <Card>
          <CardContent className="space-y-6 p-6">
            <h3 className="text-xl font-semibold text-accent-brand sm:text-2xl">
              {t("fundamentalsHeading")}
            </h3>
            <dl className="divide-y divide-border">
              {OVERVIEW_FUNDAMENTAL_KEYS.map((key) => (
                <div
                  key={key}
                  className="grid grid-cols-1 gap-2 py-5 first:pt-0 last:pb-0 @md:grid-cols-[10rem_minmax(0,1fr)] @md:gap-8"
                >
                  <dt className="text-sm font-semibold">
                    {t(`fundamentals.${key}.label`)}
                  </dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">
                    {t(`fundamentals.${key}.body`)}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </section>

      <section className="@container space-y-4" aria-label={t("valuesTitle")}>
        <div>
          <h2 className="text-xl font-semibold">{t("valuesTitle")}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {t("valuesDescription")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
          {OVERVIEW_VALUE_KEYS.map((key, index) => (
            <Card key={key} className="h-full">
              <CardContent className="space-y-2 p-6">
                <p className="text-2xl font-semibold tabular-nums text-muted-foreground/50">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="text-base font-semibold">
                  {t(`values.${key}.title`)}
                </h3>
                <p className="text-sm italic text-muted-foreground">
                  {t(`values.${key}.traits`)}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`values.${key}.description`)}
                </p>
              </CardContent>
            </Card>
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

      <section
        className="@container space-y-4"
        aria-label={t("sectionsAriaLabel")}
      >
        <div>
          <h2 className="text-xl font-semibold">{t("sectionsTitle")}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {t("sectionsDescription")}
          </p>
        </div>
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
    </div>
  );
}
