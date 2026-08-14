"use client";

import * as React from "react";
import { Card, CardContent, CardTitle, cn } from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import { Check, Copy, Palette } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  BRAND_COLOR_FORMATS,
  BRAND_COLOR_GROUPS,
  BRAND_GRADIENTS,
  colorValue,
  type BrandColor,
  type BrandGradient,
} from "@/ui/branding/content/brand-palette";

function CopyButton({
  value,
  copied,
  onCopy,
}: {
  value: string;
  copied: boolean;
  onCopy: (value: string) => void;
}) {
  const t = useTranslations("branding.colors");
  return (
    <button
      type="button"
      onClick={() => onCopy(value)}
      aria-label={t("copyValue", { value })}
      className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden />
      )}
    </button>
  );
}

function ColorCodes({
  color,
  copiedKey,
  onCopy,
}: {
  color: BrandColor;
  copiedKey: string | null;
  onCopy: (key: string, value: string) => void;
}) {
  const t = useTranslations("branding.colors");
  return (
    <dl className="space-y-0.5 font-mono text-xs">
      {BRAND_COLOR_FORMATS.map((format) => {
        const value = colorValue(color, format);
        const key = `${color.id}-${format}`;
        return (
          <div key={format} className="flex items-center gap-2">
            <dt className="w-10 shrink-0 uppercase text-muted-foreground">
              {t(`formats.${format}`)}
            </dt>
            <dd className="min-w-0 flex-1 truncate">{value}</dd>
            <CopyButton
              value={value}
              copied={copiedKey === key}
              onCopy={(next) => onCopy(key, next)}
            />
          </div>
        );
      })}
    </dl>
  );
}

function ColorSwatch({
  color,
  copiedKey,
  onCopy,
}: {
  color: BrandColor;
  copiedKey: string | null;
  onCopy: (key: string, value: string) => void;
}) {
  const t = useTranslations("branding.colors");

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div
        className="aspect-[4/3] border-b border-border"
        style={{ backgroundColor: color.hex }}
        aria-hidden
      />
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <CardTitle className="text-base leading-snug">
          {t(`swatches.${color.id}`)}
        </CardTitle>
        <ColorCodes color={color} copiedKey={copiedKey} onCopy={onCopy} />
      </CardContent>
    </Card>
  );
}

function GradientSwatch({
  gradient,
  copiedKey,
  onCopy,
}: {
  gradient: BrandGradient;
  copiedKey: string | null;
  onCopy: (key: string, value: string) => void;
}) {
  const t = useTranslations("branding.colors");
  const key = `${gradient.id}-css`;

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div
        className="aspect-[4/3] border-b border-border"
        style={{ background: gradient.css }}
        aria-hidden
      />
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <CardTitle className="text-base leading-snug">
            {t(`swatches.${gradient.id}`)}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {t(`gradientUsage.${gradient.usage}`)}
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="min-w-0 flex-1 truncate">{gradient.css}</span>
          <CopyButton
            value={gradient.css}
            copied={copiedKey === key}
            onCopy={(next) => onCopy(key, next)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function ColorPaletteView() {
  const t = useTranslations("branding.colors");
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      toast.success(t("copied", { value }));
      window.setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<Palette className="h-8 w-8" aria-hidden />}
      />

      {BRAND_COLOR_GROUPS.map((group) => (
        <section
          key={group.id}
          className="@container space-y-4"
          aria-label={t(`groups.${group.id}.title`)}
        >
          <div>
            <h2 className="text-xl font-semibold">
              {t(`groups.${group.id}.title`)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t(`groups.${group.id}.description`)}
            </p>
          </div>
          <div
            className={cn(
              "grid grid-cols-1 gap-4 @sm:grid-cols-2",
              group.colors.length === 4 ? "@lg:grid-cols-4" : "@lg:grid-cols-3",
            )}
          >
            {group.colors.map((color) => (
              <ColorSwatch
                key={color.id}
                color={color}
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
            ))}
          </div>
        </section>
      ))}

      <section
        className="@container space-y-4"
        aria-label={t("groups.gradients.title")}
      >
        <div>
          <h2 className="text-xl font-semibold">{t("groups.gradients.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("groups.gradients.description")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
          {BRAND_GRADIENTS.map((gradient) => (
            <GradientSwatch
              key={gradient.id}
              gradient={gradient}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
