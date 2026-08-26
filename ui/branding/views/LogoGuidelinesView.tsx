"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, KLabLogo, cn, type KLabLogoProps } from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import { Check, PenTool, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryAssets } from "@/ui/brand-assets/hooks/use-category-assets";
import { GuidelineDownloadsSection } from "@/ui/branding/components/guideline-downloads-section";
import {
  LOGO_BACKGROUND_EXAMPLES,
  LOGO_MISUSE_EXAMPLES,
  LOGO_RULE_KEYS,
  PRIMARY_LOGO_TREATMENTS,
  type LogoBackgroundExample,
  type LogoMisuseExample,
  type LogoVariant,
} from "@/ui/branding/content/logo-variants";

const GUIDELINE_LOGO_VARIANT: Record<
  LogoVariant["id"],
  NonNullable<KLabLogoProps["variant"]>
> = {
  primary: "blue",
  dark: "dark",
  reversed: "white",
  logomark: "icon",
};

function GuidelineLogo({
  variantId,
  ...props
}: Omit<KLabLogoProps, "variant" | "src"> & { variantId: LogoVariant["id"] }) {
  return <KLabLogo variant={GUIDELINE_LOGO_VARIANT[variantId]} {...props} />;
}

/**
 * Clearspace per the guidelines: 50% of the logomark height on every side.
 * The logo renders at h-12 (48px), so the visible padding band is 24px —
 * the diagram is drawn to spec, not just annotated with it.
 */
function ClearspaceDiagram({
  variantId,
  alt,
  label,
}: {
  variantId: LogoVariant["id"];
  alt: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full items-center justify-center rounded-app-radius border border-dashed border-border bg-secondary p-6">
        <div className="relative border border-dashed border-accent-brand/60 p-6">
          <GuidelineLogo
            variantId={variantId}
            alt={alt}
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
  variantId,
  surface,
  label,
  description,
}: {
  variantId: LogoVariant["id"];
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
        <GuidelineLogo
          variantId={variantId}
          alt={label}
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
  label,
  description,
}: {
  example: LogoBackgroundExample;
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
        <GuidelineLogo
          variantId={example.variantId}
          alt={label}
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
  partnerLabel,
  showSpacing,
  figureLabel,
}: {
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
        <KLabLogo
          variant="dark"
          alt=""
          aria-hidden
          className="h-12 w-auto object-contain dark:hidden"
        />
        <KLabLogo
          variant="white"
          alt=""
          aria-hidden
          className="hidden h-12 w-auto object-contain dark:block"
        />
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
  caption,
}: {
  example: LogoMisuseExample;
  caption: string;
}) {
  const logo = (
    <KLabLogo
      variant="dark"
      alt=""
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
              {PRIMARY_LOGO_TREATMENTS.map((treatment) => (
                <PrimaryLogoCard
                  key={treatment.id}
                  variantId={treatment.id === "whiteOnBlack" ? "reversed" : "dark"}
                  surface={treatment.surface}
                  label={t(`primaryTreatments.${treatment.id}.label`)}
                  description={t(
                    `primaryTreatments.${treatment.id}.description`,
                  )}
                />
              ))}
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
                    <ClearspaceDiagram
                      variantId="primary"
                      alt={t("clearspaceFullLabel")}
                      label={t("clearspaceFullLabel")}
                    />
                    <ClearspaceDiagram
                      variantId="logomark"
                      alt={t("clearspaceIconLabel")}
                      label={t("clearspaceIconLabel")}
                    />
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
              {LOGO_BACKGROUND_EXAMPLES.map((example) => (
                <BackgroundExampleCard
                  key={example.id}
                  example={example}
                  label={t(`backgrounds.${example.id}.label`)}
                  description={t(`backgrounds.${example.id}.description`)}
                />
              ))}
            </div>
          </section>

          <section className="@container" aria-label={t("cobrandingTitle")}>
            <Card className="overflow-hidden">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-lg font-semibold">{t("cobrandingTitle")}</h2>
                <p className="max-w-3xl text-sm text-muted-foreground">
                  {t("cobrandingDescription")}
                </p>
                <div className="grid grid-cols-1 overflow-hidden rounded-app-radius border border-border @lg:grid-cols-2">
                  <CobrandingLockup
                    partnerLabel={t("cobrandingPartnerLabel")}
                    showSpacing
                    figureLabel={t("cobrandingSpacingLabel")}
                  />
                  <div className="border-t border-border @lg:border-l @lg:border-t-0">
                    <CobrandingLockup
                      partnerLabel={t("cobrandingPartnerLabel")}
                      showSpacing={false}
                      figureLabel={t("cobrandingFinalLabel")}
                    />
                  </div>
                </div>
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
              {LOGO_MISUSE_EXAMPLES.map((example) => (
                <MisuseExampleCard
                  key={example.id}
                  example={example}
                  caption={t(`misuse.${example.id}`)}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
