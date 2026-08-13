"use client";

import * as React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import { Presentation } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSalesAssets } from "@/ui/brand-assets/hooks/use-sales-assets";
import { AssetGrid } from "@/ui/brand-assets/components/asset-grid";

export function SalesResourcesView() {
  const t = useTranslations("sales");
  const { groups, loading, loadError } = useSalesAssets();

  return (
    <div className="space-y-6">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<Presentation className="h-8 w-8" aria-hidden />}
      />
      {loadError ? (
        <p className="text-sm text-destructive">{t("loadError")}</p>
      ) : (
        <Tabs defaultValue="pitch-decks">
          <TabsList>
            <TabsTrigger value="pitch-decks">{t("tabs.pitchDecks")}</TabsTrigger>
            <TabsTrigger value="sales-materials">{t("tabs.salesMaterials")}</TabsTrigger>
          </TabsList>
          <TabsContent value="pitch-decks" className="pt-4">
            <AssetGrid assets={groups["pitch-decks"] ?? []} loading={loading} />
          </TabsContent>
          <TabsContent value="sales-materials" className="pt-4">
            <AssetGrid assets={groups["sales-materials"] ?? []} loading={loading} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
