"use client";

import * as React from "react";
import Image from "next/image";
import { Badge, Card, CardContent, KLabLogo, cn } from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import { Check, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { GuidelineDownloadsSection } from "@/ui/branding/components/guideline-downloads-section";

/**
 * Avatar treatments from the guidelines: icon-only marks on gradient or
 * graphite fields, and wordmark-only marks on textured surfaces. Rendered as
 * CSS approximations of the artboards until final exports ship.
 */
const AVATAR_TREATMENTS = [
  {
    id: "gradientIcon",
    className: "bg-gradient-to-br from-sky-400 to-blue-900",
    variant: "icon" as const,
  },
  {
    id: "graphiteIcon",
    className: "bg-gradient-to-br from-neutral-600 to-neutral-900",
    variant: "icon" as const,
  },
  {
    id: "navyWordmark",
    className: "bg-[#050d1f]",
    variant: "white" as const,
  },
] as const;

const BANNER_RULE_KEYS = ["lockup", "copySpace", "contrast"] as const;

/** Platform export formats from the Brand Center reference. Platform names
 *  are proper nouns — not translated. */
const PLATFORM_SPECS = [
  { name: "LinkedIn Cover", size: "1128 × 191 px" },
  { name: "LinkedIn Avatar", size: "400 × 400 px" },
  { name: "LinkedIn Post", size: "1200 × 1200 px" },
  { name: "Instagram Post", size: "1080 × 1080 px" },
  { name: "Instagram Story", size: "1080 × 1920 px" },
  { name: "X / Twitter Header", size: "1500 × 500 px" },
] as const;

export function SocialMediaView() {
  const t = useTranslations("branding.socialMedia");
  // Final avatar/banner exports land in the social-media category; the
  // section below stays hidden until an admin publishes the first one.
  const { assets, loading } = useCategoryAssets("social-media");

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<Share2 className="h-8 w-8" aria-hidden />}
        actions={
          <GuidelineDownloadsSection
            category="social-media"
            assets={assets}
            loading={loading}
          />
        }
      />

      <section className="@container space-y-4" aria-label={t("avatarsTitle")}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold">{t("avatarsTitle")}</h2>
          <Badge variant="outline">{t("placeholderBadge")}</Badge>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {t("avatarsDescription")}
        </p>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-3">
          {AVATAR_TREATMENTS.map((treatment) => (
            <Card key={treatment.id} className="h-full">
              <CardContent className="flex flex-col items-center gap-3 p-6">
                <div
                  className={cn(
                    "flex h-28 w-28 items-center justify-center overflow-hidden rounded-full",
                    treatment.className,
                  )}
                >
                  <KLabLogo
                    variant={treatment.variant}
                    alt={t(`avatars.${treatment.id}`)}
                    className={cn(
                      "w-auto object-contain",
                      treatment.variant === "icon" ? "h-12" : "h-5",
                    )}
                  />
                </div>
                <span className="text-center text-sm text-muted-foreground">
                  {t(`avatars.${treatment.id}`)}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="@container space-y-4" aria-label={t("bannersTitle")}>
        <div>
          <h2 className="text-xl font-semibold">{t("bannersTitle")}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {t("bannersDescription")}
          </p>
        </div>
        <div className="space-y-4">
          <div
            className="relative overflow-hidden rounded-app-radius border border-border"
            role="img"
            aria-label={t("bannerDarkLabel")}
          >
            <Image
              src="/brand-files/backgrounds/k-lab-bg-001.webp"
              alt=""
              width={1584}
              height={396}
              unoptimized
              className="aspect-[4/1] w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-4 px-6">
              <KLabLogo variant="white" alt="" className="h-6 w-auto sm:h-9" />
            </div>
          </div>
          <div
            className="relative overflow-hidden rounded-app-radius border border-border"
            role="img"
            aria-label={t("bannerGradientLabel")}
          >
            <Image
              src="/brand-files/backgrounds/k-lab-bg-004-dots.webp"
              alt=""
              width={1584}
              height={396}
              unoptimized
              className="aspect-[4/1] w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center px-8">
              <KLabLogo variant="white" alt="" className="h-6 w-auto sm:h-9" />
            </div>
          </div>
        </div>
        <Card>
          <CardContent className="space-y-3 p-6">
            <h3 className="text-sm font-semibold">{t("specsTitle")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("specsDescription")}
            </p>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-2 @sm:grid-cols-2 @lg:grid-cols-3">
              {PLATFORM_SPECS.map((spec) => (
                <li
                  key={spec.name}
                  className="flex items-baseline justify-between gap-3 border-b border-border pb-2 text-sm"
                >
                  <span className="font-medium">{spec.name}</span>
                  <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                    {spec.size}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-6">
            <h3 className="text-sm font-semibold">{t("bannerRulesTitle")}</h3>
            <ul className="grid grid-cols-1 gap-2 @md:grid-cols-3">
              {BANNER_RULE_KEYS.map((key) => (
                <li key={key} className="flex gap-2 text-sm">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-success"
                    aria-hidden
                  />
                  <span>{t(`bannerRules.${key}`)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
