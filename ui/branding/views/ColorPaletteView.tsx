"use client";

import * as React from "react";
import { Card, CardContent, PageHeader, cn } from "@k-lab/components";
import { Check, Copy, Palette } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  BRAND_COLOR_GROUPS,
  type BrandColorToken,
} from "@/ui/branding/content/brand-palette";
import { hslTripletToHex } from "@/ui/branding/lib/hsl-to-hex";

function ColorSwatch({ token }: { token: BrandColorToken }) {
  const t = useTranslations("branding.colors");
  const [copied, setCopied] = React.useState(false);
  const hex = hslTripletToHex(token.light);
  // Design tokens render the live CSS variable so the swatch follows the
  // active theme; identity colours have no variable and render literally.
  const swatchColor = token.token
    ? `hsl(var(--${token.token}))`
    : `hsl(${token.light})`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      toast.success(t("copied", { value: hex }));
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  return (
    <Card className="overflow-hidden">
      <div
        className="h-24 w-full border-b border-border"
        style={{ backgroundColor: swatchColor }}
        aria-hidden
      />
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">
              {t(`tokens.${token.id}.name`)}
            </h3>
            {token.token ? (
              <code className="text-xs text-muted-foreground">
                --{token.token}
              </code>
            ) : (
              <span className="text-xs text-muted-foreground">
                {t("identityColor")}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => void handleCopy()}
            aria-label={t("copyHex", { value: hex })}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" aria-hidden />
            ) : (
              <Copy className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          {t(`tokens.${token.id}.usage`)}
        </p>
        <dl className="space-y-1 text-xs">
          <div className="flex gap-2">
            <dt className="w-10 shrink-0 text-muted-foreground">
              {token.dark ? t("light") : t("value")}
            </dt>
            <dd className="font-mono">
              {hex} · hsl({token.light})
            </dd>
          </div>
          {token.dark ? (
            <div className="flex gap-2">
              <dt className="w-10 shrink-0 text-muted-foreground">
                {t("dark")}
              </dt>
              <dd className="font-mono">
                {hslTripletToHex(token.dark)} · hsl({token.dark})
              </dd>
            </div>
          ) : null}
        </dl>
      </CardContent>
    </Card>
  );
}

export function ColorPaletteView() {
  const t = useTranslations("branding.colors");

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<Palette className="h-8 w-8" aria-hidden />}
      />

      {BRAND_COLOR_GROUPS.map((group, index) => (
        <section
          key={group.id}
          className={cn("@container space-y-4", index > 0 && "pt-2")}
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
          <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4">
            {group.tokens.map((token) => (
              <ColorSwatch key={token.id} token={token} />
            ))}
          </div>
        </section>
      ))}

      <p className="text-sm text-muted-foreground">{t("tokenNote")}</p>
    </div>
  );
}
