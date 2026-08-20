"use client";

import * as React from "react";
import { Badge, Card, CardContent } from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import { Camera, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

const PRINCIPLE_KEYS = ["mood", "light", "space", "people"] as const;
const PHOTO_DO_KEYS = ["palette", "overlay", "focal"] as const;
const PHOTO_DONT_KEYS = ["stock", "filters", "busy"] as const;

export function PhotographyView() {
  const t = useTranslations("branding.photography");

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<Camera className="h-8 w-8" aria-hidden />}
      />

      <section
        className="@container space-y-4"
        aria-label={t("principlesTitle")}
      >
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold">{t("principlesTitle")}</h2>
          <Badge variant="outline">{t("placeholderBadge")}</Badge>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {t("principlesDescription")}
        </p>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-4">
          {PRINCIPLE_KEYS.map((key) => (
            <Card key={key} className="h-full">
              <CardContent className="space-y-1 p-4">
                <h3 className="text-sm font-semibold">
                  {t(`principles.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`principles.${key}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card className="@container">
        <CardContent className="grid grid-cols-1 gap-6 p-6 @md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">{t("doTitle")}</h2>
            <ul className="space-y-2">
              {PHOTO_DO_KEYS.map((key) => (
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
              {PHOTO_DONT_KEYS.map((key) => (
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
