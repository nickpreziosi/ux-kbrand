"use client";

import * as React from "react";
import { Button, Hero, LaunchPage, cn } from "@k-lab/components";
import type { AuthBrandPanelLayer } from "@k-lab/components";
import {
  BookOpen,
  Images,
  Presentation,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { canSeeSalesSection } from "@/contexts/brand-assets/domain/services/asset-access";
import { KLabBrandLogoMark } from "@/ui/shared/components/k-lab-brand-logo";
import { shouldShowGuestChrome } from "@/lib/auth/guest-chrome";
import { useAuth } from "@/ui/user-management/auth/auth-provider";
import { usePortalRole } from "@/ui/user-management/hooks/use-portal-role";

const HOME_HERO_BACKGROUNDS = [
  "/brand-files/backgrounds/k-lab-bg-003.webp",
  "/brand-files/backgrounds/k-lab-bg-005.webp",
  "/brand-files/backgrounds/k-lab-bg-001.webp",
  "/brand-files/backgrounds/k-lab-bg-004.webp",
] as const;

type HomeSlide = {
  id: string;
  background: (typeof HOME_HERO_BACKGROUNDS)[number];
  title: string;
  description: string;
  cta: string;
  href: string;
};

function heroBackgroundLayers(src: string): AuthBrandPanelLayer[] {
  return [
    {
      type: "image",
      src,
      position: "center",
      priority: "high",
      loading: "eager",
    },
  ];
}

function HomeTile({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <LaunchPage.Tile href={href}>
      <LaunchPage.Tile.Header>
        <LaunchPage.Tile.Icon>
          <Icon className="h-5 w-5" aria-hidden />
        </LaunchPage.Tile.Icon>
        <div className="space-y-1.5">
          <LaunchPage.Tile.Title>{title}</LaunchPage.Tile.Title>
          <LaunchPage.Tile.Description>{description}</LaunchPage.Tile.Description>
        </div>
      </LaunchPage.Tile.Header>
      <LaunchPage.Tile.Footer>
        <LaunchPage.Tile.Action />
      </LaunchPage.Tile.Footer>
    </LaunchPage.Tile>
  );
}

export function HomeView() {
  const t = useTranslations("home");
  const tNav = useTranslations("shell.nav");
  const { user, loading: authLoading } = useAuth();
  const { viewerRole, isAdmin } = usePortalRole();
  const [index, setIndex] = React.useState(0);
  const showEmployeeSignIn = shouldShowGuestChrome({
    authLoading,
    user,
    viewerRole,
  });
  const showSales = canSeeSalesSection(viewerRole);

  const slides = React.useMemo(() => {
    const items: HomeSlide[] = [
      {
        id: "guidelines",
        background: HOME_HERO_BACKGROUNDS[0],
        title: t("guidelinesTitle"),
        description: t("guidelinesDescription"),
        cta: t("guidelinesCta"),
        href: "/branding",
      },
      {
        id: "assets",
        background: HOME_HERO_BACKGROUNDS[1],
        title: t("assetsTitle"),
        description: t("assetsDescription"),
        cta: t("assetsCta"),
        href: "/assets",
      },
    ];
    if (showSales) {
      items.push({
        id: "sales",
        background: HOME_HERO_BACKGROUNDS[2],
        title: t("salesTitle"),
        description: t("salesDescription"),
        cta: t("salesCta"),
        href: "/sales",
      });
    }
    if (isAdmin) {
      items.push({
        id: "admin",
        background: HOME_HERO_BACKGROUNDS[3],
        title: t("adminTitle"),
        description: t("adminDescription"),
        cta: t("adminCta"),
        href: "/admin/assets",
      });
    }
    return items;
  }, [t, showSales, isAdmin]);

  return (
    <LaunchPage>
      <LaunchPage.Hero
        className="overflow-hidden rounded-app-radius"
        index={index}
        onIndexChange={setIndex}
      >
        <div className="absolute inset-0" aria-hidden>
          {slides.map((slide, slideIndex) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 ease-in-out",
                slideIndex === index
                  ? "z-0 opacity-100"
                  : "pointer-events-none z-0 opacity-0",
              )}
            >
              <Hero.Media layers={heroBackgroundLayers(slide.background)} />
            </div>
          ))}
        </div>
        <Hero.Carousel>
          {slides.map((slide) => (
            <Hero.Slide key={slide.id}>
              <Hero.Logo>
                <KLabBrandLogoMark variant="white" className="h-10 w-auto" />
              </Hero.Logo>
              <Hero.Title>{slide.title}</Hero.Title>
              <Hero.Description>{slide.description}</Hero.Description>
              <Hero.Actions>
                <Button size="lg" variant="accent-brand" className="w-fit" href={slide.href}>
                  {slide.cta}
                </Button>
                {showEmployeeSignIn ? (
                  <Button
                    size="lg"
                    className="w-fit bg-white text-black hover:bg-white/80"
                    href="/login"
                  >
                    {t("employeeSignIn")}
                  </Button>
                ) : null}
              </Hero.Actions>
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
              <HomeTile
                href="/branding"
                icon={BookOpen}
                title={t("tiles.brandGuidelines.title")}
                description={t("tiles.brandGuidelines.description")}
              />
              <HomeTile
                href="/assets"
                icon={Images}
                title={tNav("assetLibrary")}
                description={t("tiles.brandAssets.description")}
              />
              {showSales ? (
                <HomeTile
                  href="/sales"
                  icon={Presentation}
                  title={t("tiles.sales.title")}
                  description={t("tiles.sales.description")}
                />
              ) : null}
            </LaunchPage.Cards>
          </LaunchPage.Section>
        </LaunchPage.Main>
      </LaunchPage.Body>
    </LaunchPage>
  );
}
