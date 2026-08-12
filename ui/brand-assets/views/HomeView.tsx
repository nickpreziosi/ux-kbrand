"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Hero,
  KLabLogo,
  Tile,
  authBrandPanelPresets,
} from "@k-lab/components";
import {
  ArrowRight,
  BookOpen,
  Image as ImageIcon,
  Lock,
  PenTool,
  Presentation,
  Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { useAuth } from "@/ui/user-management/auth/auth-provider";

const PUBLIC_CATEGORY_TILES: {
  category: AssetCategory;
  icon: LucideIcon;
}[] = [
  { category: "brand-guidelines", icon: BookOpen },
  { category: "logos", icon: PenTool },
  { category: "brand-imagery", icon: ImageIcon },
  { category: "fonts", icon: Type },
];

export function HomeView() {
  const t = useTranslations("home");
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <Hero
        className="overflow-hidden rounded-app-radius"
        layers={authBrandPanelPresets.wave()}
        logo={<KLabLogo variant="light" className="h-8 w-auto" />}
        title={t("heroTitle")}
        description={t("heroDescription")}
        actions={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="accent-brand"
              size="lg"
              icon={<ArrowRight aria-hidden />}
              iconPosition="end"
              onClick={() => router.push("/brand/logos")}
            >
              {t("browseAssets")}
            </Button>
            {!user ? (
              <Button variant="outline" size="lg" href="/login" className="bg-background/80">
                {t("employeeSignIn")}
              </Button>
            ) : null}
          </div>
        }
      />

      <section className="space-y-4" aria-label={t("categoriesAriaLabel")}>
        <div>
          <h2 className="text-xl font-semibold">{t("categoriesTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("categoriesSubtitle")}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PUBLIC_CATEGORY_TILES.map(({ category, icon }) => (
            <Tile.Navigation
              key={category}
              href={`/brand/${category}`}
              icon={icon}
              title={t(`categories.${category}.title`)}
              description={t(`categories.${category}.description`)}
              cta={t("openCategory")}
            />
          ))}
          <Tile.Navigation
            href="/sales"
            icon={Presentation}
            title={t("categories.sales.title")}
            description={t("categories.sales.description")}
            cta={user ? t("openCategory") : t("employeeSignIn")}
            actions={
              !user ? <Lock className="h-4 w-4 text-muted-foreground" aria-hidden /> : undefined
            }
          />
        </div>
      </section>
    </div>
  );
}
