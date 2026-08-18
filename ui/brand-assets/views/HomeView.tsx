"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Hero, Tile } from "@k-lab/components";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Briefcase,
  Camera,
  Image as ImageIcon,
  Palette,
  PenTool,
  Presentation,
  Shapes,
  Share2,
  ShoppingBag,
  Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { canSeeSalesSection } from "@/contexts/brand-assets/domain/services/asset-access";
import { logoRightBrandLayers } from "@/lib/brand/auth-brand-layers";
import { KLabBrandLogoMark } from "@/ui/shared/components/k-lab-brand-logo";
import { shouldShowGuestChrome } from "@/lib/auth/guest-chrome";
import { useAuth } from "@/ui/user-management/auth/auth-provider";
import { usePortalRole } from "@/ui/user-management/hooks/use-portal-role";

const BRANDING_TILES: { id: string; href: string; icon: LucideIcon }[] = [
  { id: "logo", href: "/branding/logo", icon: PenTool },
  { id: "colors", href: "/branding/colors", icon: Palette },
  { id: "typography", href: "/branding/typography", icon: Type },
  { id: "iconography", href: "/branding/iconography", icon: Shapes },
  { id: "imagery", href: "/branding/imagery", icon: ImageIcon },
  { id: "photography", href: "/branding/photography", icon: Camera },
  { id: "corporateAssets", href: "/branding/corporate-assets", icon: Briefcase },
  { id: "socialMedia", href: "/branding/social-media", icon: Share2 },
  { id: "merchandise", href: "/branding/merchandise", icon: ShoppingBag },
  { id: "subBrands", href: "/branding/sub-brands", icon: Boxes },
  { id: "guidelines", href: "/branding/guidelines", icon: BookOpen },
];

export function HomeView() {
  const t = useTranslations("home");
  const tSections = useTranslations("branding.sections");
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { viewerRole } = usePortalRole();
  // Only invite anonymous visitors to sign in: hidden while the session is
  // still restoring (avoids a signed-in flash) and when a dev role override
  // is previewing an employee/admin session without a real user.
  const showEmployeeSignIn = shouldShowGuestChrome({
    authLoading,
    user,
    viewerRole,
  });

  return (
    <div className="space-y-8">
      <Hero
        className="overflow-hidden rounded-app-radius"
        layers={logoRightBrandLayers()}
        logo={<KLabBrandLogoMark variant="white" className="h-8 w-auto" />}
        title={t("heroTitle")}
        description={t("heroDescription")}
        actions={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="accent-brand"
              size="lg"
              icon={<ArrowRight aria-hidden />}
              iconPosition="end"
              onClick={() => router.push("/branding")}
            >
              {t("browseAssets")}
            </Button>
            {showEmployeeSignIn ? (
              <Button
                variant="outline"
                size="lg"
                href="/login"
                className="bg-background/80"
              >
                {t("employeeSignIn")}
              </Button>
            ) : null}
          </div>
        }
      />

      <section
        className="@container space-y-4"
        aria-label={t("categoriesAriaLabel")}
      >
        <div>
          <h2 className="text-xl font-semibold">{t("categoriesTitle")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("categoriesSubtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
          {BRANDING_TILES.map(({ id, href, icon }) => (
            <Tile.Navigation
              key={id}
              href={href}
              icon={icon}
              title={tSections(`${id}.title`)}
              description={tSections(`${id}.description`)}
              cta={t("openCategory")}
            />
          ))}
          {canSeeSalesSection(viewerRole) ? (
            <Tile.Navigation
              href="/sales"
              icon={Presentation}
              title={t("categories.sales.title")}
              description={t("categories.sales.description")}
              cta={t("openCategory")}
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}
