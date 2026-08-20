"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, Skeleton, cn } from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import { Check, PenTool, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { GuidelineDownloadsSection } from "@/ui/branding/components/guideline-downloads-section";
import { previewAssetForVariant } from "@/ui/branding/content/logo-formats";
import {
  LOGO_BACKGROUND_EXAMPLES,
  LOGO_MISUSE_EXAMPLES,
  LOGO_RULE_KEYS,
  LOGO_VARIANTS,
  PRIMARY_LOGO_TREATMENTS,
  type LogoBackgroundExample,
  type LogoMisuseExample,
  type LogoVariant,
} from "@/ui/branding/content/logo-variants";

function previewUrlForVariant(
  assets: Parameters<typeof previewAssetForVariant>[0],
  variantId: LogoVariant["id"],
): string | undefined {
  const variant = LOGO_VARIANTS.find((entry) => entry.id === variantId);
  return variant
    ? previewAssetForVariant(assets, variant)?.previewUrl
    : undefined;
}

/**
 * Clearspace per the guidelines: 50% of the logomark height on every side.
 * The logo renders at h-12 (48px), so the visible padding band is 24px —
 * the diagram is drawn to spec, not just annotated with it.
 */
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
            className="h-12 w-auto max-w-full object-contain"
          />
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary px-1 text-xs font-semibold uppercase tracking-wider text-accent-brand">
            0.5×
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

/** A lockup shown on its only approved surface (white on black, grey on white). */
function PrimaryLogoCard({
  src,
  surface,
  label,
  description,
}: {
  src: string;
  surface: "light" | "dark";
  label: string;
  description: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div
        className={cn(
          "flex items-center justify-center px-10 py-12",
          surface === "dark" ? "bg-black" : "border-b border-border bg-white",
        )}
      >
        <Image
          src={src}
          alt={label}
          width={280}
          height={90}
          unoptimized
          className="h-12 w-auto max-w-full object-contain sm:h-14"
        />
      </div>
      <CardContent className="space-y-1 p-4">
        <h3 className="text-sm font-semibold">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function BackgroundExampleCard({
  example,
  src,
  label,
  description,
}: {
  example: LogoBackgroundExample;
  src: string;
  label: string;
  description: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div
        className={cn(
          "relative flex aspect-[16/9] items-center justify-center overflow-hidden",
          example.surface === "light" && "border-b border-border bg-white",
        )}
      >
        {example.surface === "image" ? (
          <Image
            src={example.imageSrc}
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
        ) : null}
        <Image
          src={src}
          alt={label}
          width={240}
          height={80}
          unoptimized
          className="relative z-10 h-10 w-auto max-w-[70%] object-contain sm:h-12"
        />
      </div>
      <CardContent className="space-y-1 p-4">
        <h3 className="text-sm font-semibold">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

/**
 * Stand-in partner lockup for the co-branding diagram. The guidelines use a
 * third-party mark; we don't ship that artwork, so a generic partner reads
 * the same height as the K Lab wordmark without implying a real partner.
 */
function PartnerLockup({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2.5 text-foreground">
      <span
        className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground text-lg font-bold text-background"
        aria-hidden
      >
        P
      </span>
      <span className="text-[1.65rem] font-semibold leading-none tracking-tight">
        {label}
      </span>
    </span>
  );
}

/**
 * Co-branding construction: divider = logomark height (h-12), gap = 50% of
 * that width on each side (w-6). `ltr` keeps the lockup oriented as drawn.
 */
function CobrandingLockup({
  darkSrc,
  reversedSrc,
  partnerLabel,
  showSpacing,
  figureLabel,
}: {
  darkSrc?: string;
  reversedSrc?: string;
  partnerLabel: string;
  showSpacing: boolean;
  figureLabel: string;
}) {
  return (
    <div
      className="flex min-w-0 items-center justify-center overflow-x-auto bg-secondary px-6 py-10"
      dir="ltr"
      role="img"
      aria-label={figureLabel}
    >
      <div className="flex items-center">
        {darkSrc ? (
          <Image
            src={darkSrc}
            alt=""
            width={200}
            height={64}
            unoptimized
            className={cn(
              "h-12 w-auto object-contain",
              reversedSrc && "dark:hidden",
            )}
          />
        ) : null}
        {reversedSrc ? (
          <Image
            src={reversedSrc}
            alt=""
            width={200}
            height={64}
            unoptimized
            className={cn(
              "h-12 w-auto object-contain",
              darkSrc && "hidden dark:block",
            )}
          />
        ) : null}
        <div className="relative mx-0 flex h-12 items-stretch">
          {showSpacing ? (
            <>
              <div className="w-6 border border-dashed border-accent-brand/60" />
              <div className="w-px bg-foreground" />
              <div className="w-6 border border-dashed border-accent-brand/60" />
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-wider text-accent-brand">
                0.5×
              </span>
            </>
          ) : (
            <>
              <div className="w-6" />
              <div className="w-px bg-foreground" />
              <div className="w-6" />
            </>
          )}
        </div>
        <PartnerLockup label={partnerLabel} />
      </div>
    </div>
  );
}

function MisuseStrike() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full text-destructive"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <line
        x1="8"
        y1="92"
        x2="92"
        y2="8"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MisuseExampleCard({
  example,
  src,
  caption,
}: {
  example: LogoMisuseExample;
  src: string;
  caption: string;
}) {
  const logo = (
    <Image
      src={src}
      alt=""
      width={200}
      height={64}
      unoptimized
      className={cn(
        "h-8 w-auto max-w-[70%] object-contain sm:h-10",
        "className" in example ? example.className : undefined,
      )}
    />
  );

  return (
    <Card className="overflow-hidden">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-secondary p-6">
        {"treatment" in example && example.treatment === "oval" ? (
          <div className="flex h-20 w-44 items-center justify-center rounded-full bg-sky-200 sm:h-24 sm:w-52">
            {logo}
          </div>
        ) : (
          logo
        )}
        <MisuseStrike />
      </div>
      <CardContent className="p-4">
        <p className="text-center text-xs font-semibold uppercase tracking-wide">
          {caption}
        </p>
      </CardContent>
    </Card>
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
  const darkPreviewUrl = previewUrlForVariant(assets, "dark");
  const reversedPreviewUrl = previewUrlForVariant(assets, "reversed");

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<PenTool className="h-8 w-8" aria-hidden />}
        actions={
          <GuidelineDownloadsSection
            category="logos"
            assets={assets}
            loading={loading}
          />
        }
      />

      {loadError ? (
        <p className="text-sm text-destructive">{t("loadError")}</p>
      ) : (
        <>
          <section
            className="@container space-y-4"
            aria-label={t("primaryTitle")}
          >
            <div>
              <h2 className="text-xl font-semibold">{t("primaryTitle")}</h2>
              <p className="max-w-3xl text-sm text-muted-foreground">
                {t("primaryDescription")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2">
              {PRIMARY_LOGO_TREATMENTS.map((treatment) => {
                const preview = previewAssetForVariant(assets, {
                  id: treatment.id === "whiteOnBlack" ? "reversed" : "dark",
                  matchTags: [...treatment.matchTags],
                  surface: treatment.surface,
                });
                return preview?.previewUrl ? (
                  <PrimaryLogoCard
                    key={treatment.id}
                    src={preview.previewUrl}
                    surface={treatment.surface}
                    label={t(`primaryTreatments.${treatment.id}.label`)}
                    description={t(
                      `primaryTreatments.${treatment.id}.description`,
                    )}
                  />
                ) : (
                  <Skeleton key={treatment.id} className="h-48 w-full" />
                );
              })}
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
            aria-label={t("backgroundsTitle")}
          >
            <div>
              <h2 className="text-xl font-semibold">{t("backgroundsTitle")}</h2>
              <p className="max-w-3xl text-sm text-muted-foreground">
                {t("backgroundsDescription")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2">
              {LOGO_BACKGROUND_EXAMPLES.map((example) => {
                const src = previewUrlForVariant(assets, example.variantId);
                return src ? (
                  <BackgroundExampleCard
                    key={example.id}
                    example={example}
                    src={src}
                    label={t(`backgrounds.${example.id}.label`)}
                    description={t(`backgrounds.${example.id}.description`)}
                  />
                ) : (
                  <Skeleton key={example.id} className="h-56 w-full" />
                );
              })}
            </div>
          </section>

          <section className="@container" aria-label={t("cobrandingTitle")}>
            <Card className="overflow-hidden">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-lg font-semibold">{t("cobrandingTitle")}</h2>
                <p className="max-w-3xl text-sm text-muted-foreground">
                  {t("cobrandingDescription")}
                </p>
                {darkPreviewUrl || reversedPreviewUrl ? (
                  <div className="grid grid-cols-1 overflow-hidden rounded-app-radius border border-border @lg:grid-cols-2">
                    <CobrandingLockup
                      darkSrc={darkPreviewUrl}
                      reversedSrc={reversedPreviewUrl}
                      partnerLabel={t("cobrandingPartnerLabel")}
                      showSpacing
                      figureLabel={t("cobrandingSpacingLabel")}
                    />
                    <div className="border-t border-border @lg:border-l @lg:border-t-0">
                      <CobrandingLockup
                        darkSrc={darkPreviewUrl}
                        reversedSrc={reversedPreviewUrl}
                        partnerLabel={t("cobrandingPartnerLabel")}
                        showSpacing={false}
                        figureLabel={t("cobrandingFinalLabel")}
                      />
                    </div>
                  </div>
                ) : (
                  <Skeleton className="h-48 w-full" />
                )}
                <ul className="grid grid-cols-1 gap-2 @md:grid-cols-3">
                  {(["divider", "spacing", "parity"] as const).map((key) => (
                    <li key={key} className="flex gap-2 text-sm">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-success"
                        aria-hidden
                      />
                      <span>{t(`cobranding.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section
            className="@container space-y-4"
            aria-label={t("misuseTitle")}
          >
            <div>
              <h2 className="text-xl font-semibold">{t("misuseTitle")}</h2>
              <p className="max-w-3xl text-sm text-muted-foreground">
                {t("misuseDescription")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
              {LOGO_MISUSE_EXAMPLES.map((example) =>
                darkPreviewUrl ? (
                  <MisuseExampleCard
                    key={example.id}
                    example={example}
                    src={darkPreviewUrl}
                    caption={t(`misuse.${example.id}`)}
                  />
                ) : (
                  <Skeleton key={example.id} className="h-48 w-full" />
                ),
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
