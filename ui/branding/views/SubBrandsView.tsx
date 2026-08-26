"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  KLeadsLogo,
  KRailsLogo,
  KRiskLogo,
  KTalkLogo,
} from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import { Boxes } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * The approved sub-brand roster. Kena is deliberately absent (retired from
 * the portfolio — see the Brand & Sales Portal Expansion story). Every
 * sub-brand uses the same chevron lockup system.
 */
const SUB_BRANDS = [
  { id: "kRails", name: "K Rails", Logo: KRailsLogo },
  { id: "kTalk", name: "K Talk", Logo: KTalkLogo },
  { id: "kRisk", name: "K Risk", Logo: KRiskLogo },
  { id: "kLeads", name: "K Leads", Logo: KLeadsLogo },
] as const;

export function SubBrandsView() {
  const t = useTranslations("branding.subBrands");

  return (
    <div className="space-y-8">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<Boxes className="h-8 w-8" aria-hidden />}
      />

      <Card>
        <CardContent className="space-y-2 p-6">
          <h2 className="text-lg font-semibold">{t("systemTitle")}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {t("systemDescription")}
          </p>
        </CardContent>
      </Card>

      <section className="@container space-y-4" aria-label={t("rosterTitle")}>
        <div>
          <h2 className="text-xl font-semibold">{t("rosterTitle")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("rosterDescription")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2">
          {SUB_BRANDS.map((brand) => {
            const Logo = brand.Logo;
            return (
              <Card key={brand.id} className="flex h-full flex-col">
                <div className="flex min-h-36 items-center justify-center border-b border-border bg-white p-8">
                  <Logo
                    variant="dark"
                    alt={brand.name}
                    className="h-9 w-auto max-w-full object-contain sm:h-10"
                  />
                </div>
                <CardContent className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="text-sm font-semibold">{brand.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`brands.${brand.id}`)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
