"use client";

import * as React from "react";
import type { PageBreadcrumbConfig } from "@k-lab/components";
import { useMessages } from "next-intl";

/** Reachable prefixes for intermediate crumb links — mirrors shell nav. */
export const KBRAND_BREADCRUMB_ROUTES = [
  "/",
  "/branding",
  "/branding/logo",
  "/branding/colors",
  "/branding/typography",
  "/branding/imagery",
  "/branding/guidelines",
  "/sales",
  "/admin/assets",
  "/admin/users",
  "/settings",
] as const;

type NavMessages = Partial<{
  home: string;
  branding: string;
  logo: string;
  colors: string;
  typography: string;
  imagery: string;
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

  return React.useMemo(() => {
    const shell = (messages as { shell?: { nav?: NavMessages } } | undefined)?.shell;
    const nav = shell?.nav ?? {};
    const settings = (messages as { settings?: { title?: string } } | undefined)?.settings;

    return {
      rootLabel: nav.home ?? "Home",
      segmentLabelMap: {
        branding: nav.branding ?? "Branding",
        logo: nav.logo ?? "Logo",
        colors: nav.colors ?? "Colors",
        typography: nav.typography ?? "Typography",
        imagery: nav.imagery ?? "Imagery",
        guidelines: nav.guidelines ?? "Brand guidelines",
        sales: nav.sales ?? "Sales resources",
        admin: nav.admin ?? "Admin",
        assets: nav.adminAssets ?? "Manage assets",
        users: nav.adminUsers ?? "Users & access",
        settings: settings?.title ?? "Settings",
      },
      reachableRoutes: [...KBRAND_BREADCRUMB_ROUTES],
    };
  }, [messages]);
}
