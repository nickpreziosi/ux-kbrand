"use client";

import * as React from "react";
import { Hero, LaunchPage } from "@k-lab/components";
import type { AuthBrandPanelLayer } from "@k-lab/components";
import {
  BookOpen,
  Images,
  LogIn,
  Presentation,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { canSeeSalesSection } from "@/contexts/brand-assets/domain/services/asset-access";
import { BRAND_IMAGE_OVERLAY_OPACITY } from "@/lib/brand/auth-brand-layers";
import { KLabBrandLogoMark } from "@/ui/shared/components/k-lab-brand-logo";
import { shouldShowGuestChrome } from "@/lib/auth/guest-chrome";
import { useAuth } from "@/ui/user-management/auth/auth-provider";
import { usePortalRole } from "@/ui/user-management/hooks/use-portal-role";

/** Catalog backgrounds (non-dot treatments) — one approved image per slide. */
const HOME_HERO_BACKGROUNDS = [
  "/brand-files/backgrounds/k-lab-bg-001.webp",
  "/brand-files/backgrounds/k-lab-bg-003.webp",
  "/brand-files/backgrounds/k-lab-bg-005.webp",
] as const;

function heroBackgroundLayers(src: string): AuthBrandPanelLayer[] {
  return [
    {
      type: "image",
      src,
      position: "center",
      priority: "high",
      loading: "eager",
    },
    {
      type: "overlay",
      color: "#000000",
      opacity: BRAND_IMAGE_OVERLAY_OPACITY,
    },
  ];
}

export function HomeView() {
  const t = useTranslations("home");
  const { user, loading: authLoading } = useAuth();
  const { viewerRole } = usePortalRole();
  const showEmployeeLogin = shouldShowGuestChrome({
    authLoading,
    user,
    viewerRole,
  });
  const showSales = canSeeSalesSection(viewerRole);

  return (
    <LaunchPage>
      <LaunchPage.Hero className="overflow-hidden rounded-app-radius">
        <Hero.Carousel>
          {HOME_HERO_BACKGROUNDS.map((src) => (
            <Hero.Slide key={src}>
              <Hero.Media layers={heroBackgroundLayers(src)} />
              <Hero.Logo>
                <KLabBrandLogoMark variant="white" className="h-8 w-auto" />
              </Hero.Logo>
              <Hero.Title>{t("heroTitle")}</Hero.Title>
              <Hero.Description>{t("heroDescription")}</Hero.Description>
            </Hero.Slide>
          ))}
        </Hero.Carousel>
      </LaunchPage.Hero>
      <LaunchPage.Body>
        <LaunchPage.Main>
          <LaunchPage.Section
            title={t("tilesTitle")}
            description={t("tilesSubtitle")}
            aria-label={t("tilesAriaLabel")}
          >
            <LaunchPage.Cards>
              {showEmployeeLogin ? (
                <LaunchPage.Tile href="/login">
                  <LaunchPage.Tile.Header>
                    <LaunchPage.Tile.Icon>
                      <LogIn className="h-5 w-5" aria-hidden />
                    </LaunchPage.Tile.Icon>
                    <LaunchPage.Tile.Title>
                      {t("tiles.employeeLogin.title")}
                    </LaunchPage.Tile.Title>
                    <LaunchPage.Tile.Description>
                      {t("tiles.employeeLogin.description")}
                    </LaunchPage.Tile.Description>
                  </LaunchPage.Tile.Header>
                </LaunchPage.Tile>
              ) : null}
              <LaunchPage.Tile href="/branding">
                <LaunchPage.Tile.Header>
                  <LaunchPage.Tile.Icon>
                    <BookOpen className="h-5 w-5" aria-hidden />
                  </LaunchPage.Tile.Icon>
                  <LaunchPage.Tile.Title>
                    {t("tiles.brandGuidelines.title")}
                  </LaunchPage.Tile.Title>
                  <LaunchPage.Tile.Description>
                    {t("tiles.brandGuidelines.description")}
                  </LaunchPage.Tile.Description>
                </LaunchPage.Tile.Header>
              </LaunchPage.Tile>
              <LaunchPage.Tile href="/assets">
                <LaunchPage.Tile.Header>
                  <LaunchPage.Tile.Icon>
                    <Images className="h-5 w-5" aria-hidden />
                  </LaunchPage.Tile.Icon>
                  <LaunchPage.Tile.Title>
                    {t("tiles.brandAssets.title")}
                  </LaunchPage.Tile.Title>
                  <LaunchPage.Tile.Description>
                    {t("tiles.brandAssets.description")}
                  </LaunchPage.Tile.Description>
                </LaunchPage.Tile.Header>
              </LaunchPage.Tile>
              {showSales ? (
                <LaunchPage.Tile href="/sales">
                  <LaunchPage.Tile.Header>
                    <LaunchPage.Tile.Icon>
                      <Presentation className="h-5 w-5" aria-hidden />
                    </LaunchPage.Tile.Icon>
                    <LaunchPage.Tile.Title>
                      {t("tiles.sales.title")}
                    </LaunchPage.Tile.Title>
                    <LaunchPage.Tile.Description>
                      {t("tiles.sales.description")}
                    </LaunchPage.Tile.Description>
                  </LaunchPage.Tile.Header>
                </LaunchPage.Tile>
              ) : null}
            </LaunchPage.Cards>
          </LaunchPage.Section>
        </LaunchPage.Main>
      </LaunchPage.Body>
    </LaunchPage>
  );
}
