"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import type { PageBreadcrumbConfig } from "@k-lab/components";
import { useMessages } from "next-intl";

/** Reachable prefixes for intermediate crumb links — mirrors shell nav. */
export const KBRAND_BREADCRUMB_ROUTES = [
  "/",
  "/assets",
  "/branding",
  "/branding/logo",
  "/branding/colors",
  "/branding/typography",
  "/branding/iconography",
  "/branding/imagery",
  "/branding/photography",
  "/branding/corporate-assets",
  "/branding/social-media",
  "/branding/merchandise",
  "/branding/sub-brands",
  "/branding/guidelines",
  "/sales",
  "/admin/assets",
  "/admin/users",
  "/settings",
] as const;

type NavMessages = Partial<{
  home: string;
  assetLibrary: string;
  branding: string;
  logo: string;
  colors: string;
  typography: string;
  iconography: string;
  imagery: string;
  photography: string;
  corporateAssets: string;
  socialMedia: string;
  merchandise: string;
  subBrands: string;
  guidelines: string;
  sales: string;
  admin: string;
  adminAssets: string;
  adminUsers: string;
}>;

/**
 * Breadcrumb labels + reachable routes for {@link PageHeader}.
 * Reads from the loaded message tree with English fallbacks so a stale
 * provider (missing newly added keys) never paints `shell.nav.*` literals.
 */
export function useKBrandBreadcrumbConfig(): PageBreadcrumbConfig {
  const messages = useMessages();
  const pathname = usePathname() ?? "/";

  return React.useMemo(() => {
    const shell = (messages as { shell?: { nav?: NavMessages } } | undefined)?.shell;
    const nav = shell?.nav ?? {};
    const settings = (messages as { settings?: { title?: string } } | undefined)?.settings;
    const assetsLabel = pathname.startsWith("/admin")
      ? (nav.adminAssets ?? "Manage assets")
      : (nav.assetLibrary ?? "Asset library");

    return {
      rootLabel: nav.home ?? "Home",
      segmentLabelMap: {
        branding: nav.branding ?? "Branding",
        logo: nav.logo ?? "Logos",
        colors: nav.colors ?? "Colors",
        typography: nav.typography ?? "Typography",
        iconography: nav.iconography ?? "Iconography",
        imagery: nav.imagery ?? "Imagery",
        photography: nav.photography ?? "Photography",
        "corporate-assets": nav.corporateAssets ?? "Corporate assets",
        "social-media": nav.socialMedia ?? "Social media",
        merchandise: nav.merchandise ?? "Merchandise",
        "sub-brands": nav.subBrands ?? "Sub-brands",
        guidelines: nav.guidelines ?? "Brand guidelines",
        sales: nav.sales ?? "Sales resources",
        admin: nav.admin ?? "Admin",
        assets: assetsLabel,
        users: nav.adminUsers ?? "Users & access",
        settings: settings?.title ?? "Settings",
      },
      reachableRoutes: [...KBRAND_BREADCRUMB_ROUTES],
    };
  }, [messages, pathname]);
}