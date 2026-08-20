"use client";

import * as React from "react";
import Image from "next/image";
import { Badge, Card, CardContent } from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import { Briefcase, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { GuidelineDownloadsSection } from "@/ui/branding/components/guideline-downloads-section";

/**
 * CSS mockups of the stationery system documented in the brand guidelines
 * (letterhead, document cover, business card). Approved print-ready files are
 * pending from the design team — the layouts below mirror the guideline
 * artboards so teams know what to expect.
 */
function LetterheadMockup({ label }: { label: string }) {
  return (
    <div
      className="relative aspect-[3/4] overflow-hidden rounded-app-radius border border-border bg-white p-5"
      role="img"
      aria-label={label}
    >
      <Image
        src="/brand-files/logos/k-lab-logo-dark.png"
        alt=""
        width={120}
        height={40}
        unoptimized
        className="h-6 w-auto"
      />
      {/* Blueprint-style linework across the top, as on the guideline letterhead */}
      <div className="pointer-events-none absolute right-0 top-0 h-16 w-2/3 opacity-40">
        <div className="absolute right-6 top-5 h-px w-full bg-sky-300" />
        <div className="absolute right-10 top-8 h-px w-3/4 bg-sky-300" />
        <div className="absolute right-8 top-6 h-2 w-2 border border-sky-300" />
      </div>
      <div className="mt-8 space-y-2">
        {[...Array(7)].map((_, index) => (
          <div
            key={index}
            className="h-1.5 rounded bg-neutral-200"
            style={{ width: `${[92, 85, 90, 60, 0, 88, 74][index]}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function CoverMockup({ label }: { label: string }) {
  return (
    <div
      className="relative aspect-[3/4] overflow-hidden rounded-app-radius border border-border"
      role="img"
      aria-label={label}
    >
      <Image
        src="/brand-files/backgrounds/k-lab-bg-001.webp"
        alt=""
        fill
        unoptimized
        className="object-cover"
      />
      <div className="absolute bottom-4 left-4">
        <Image
          src="/brand-files/logos/k-lab-logo-white.png"
          alt=""
          width={120}
          height={40}
          unoptimized
          className="h-6 w-auto"
        />
      </div>
    </div>
  );
}

function BusinessCardMockup({ label }: { label: string }) {
  return (
    <div
      className="flex aspect-[3/4] flex-col items-center justify-center gap-4 rounded-app-radius border border-border bg-secondary p-6"
      role="img"
      aria-label={label}
    >
      <div className="flex aspect-[17/10] w-full max-w-56 items-center justify-center rounded-md bg-black shadow-sm">
        <Image
          src="/brand-files/logos/k-lab-logo-white.png"
          alt=""
          width={120}
          height={40}
          unoptimized
          className="h-5 w-auto"
        />
      </div>
      <div className="flex aspect-[17/10] w-full max-w-56 items-center justify-center rounded-md border border-border bg-white p-4 shadow-sm">
        <Image
          src="/brand-files/logos/k-lab-logo-dark.png"
          alt=""
          width={120}
          height={40}
          unoptimized
          className="h-5 w-auto"
        />
      </div>
    </div>
  );
}

const ASSET_KEYS = ["letterhead", "cover", "businessCard"] as const;
const RULE_KEYS = ["templates", "clearspace", "typography"] as const;

export function CorporateAssetsView() {
  const t = useTranslations("branding.corporateAssets");
  // Print-ready templates land in the corporate-assets category; the section
  // below stays hidden until an admin publishes the first one.
  const { assets, loading } = useCategoryAssets("corporate-assets");

  const mockups: Record<(typeof ASSET_KEYS)[number], React.ReactNode> = {
    letterhead: <LetterheadMockup label={t("items.letterhead.title")} />,
    cover: <CoverMockup label={t("items.cover.title")} />,
    businessCard: <BusinessCardMockup label={t("items.businessCard.title")} />,
  };

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<Briefcase className="h-8 w-8" aria-hidden />}
        actions={
          <GuidelineDownloadsSection
            category="corporate-assets"
            assets={assets}
            loading={loading}
          />
        }
      />

      <section className="@container space-y-4" aria-label={t("title")}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold">{t("systemTitle")}</h2>
          <Badge variant="outline">{t("placeholderBadge")}</Badge>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {t("systemDescription")}
        </p>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
          {ASSET_KEYS.map((key) => (
            <Card key={key} className="flex h-full flex-col">
              <CardContent className="flex flex-1 flex-col gap-3 p-4">
                {mockups[key]}
                <div>
                  <h3 className="text-sm font-semibold">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`items.${key}.description`)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <CardContent className="space-y-3 p-6">
          <h2 className="text-lg font-semibold">{t("rulesTitle")}</h2>
          <ul className="space-y-2">
            {RULE_KEYS.map((key) => (
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
    </div>
  );
}
