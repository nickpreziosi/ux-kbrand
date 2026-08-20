/**
 * Branding guideline reading order — keep aligned with the sidebar accordion
 * in `app/kbrand-layout-client.tsx`.
 *
 * Title keys are under the `branding` namespace.
 */
export const GUIDELINE_PAGES = [
  { href: "/branding", titleKey: "overview.title" },
  { href: "/branding/logo", titleKey: "sections.logo.title" },
  { href: "/branding/colors", titleKey: "sections.colors.title" },
  { href: "/branding/typography", titleKey: "sections.typography.title" },
  { href: "/branding/iconography", titleKey: "sections.iconography.title" },
  { href: "/branding/imagery", titleKey: "sections.imagery.title" },
  { href: "/branding/photography", titleKey: "sections.photography.title" },
  { href: "/branding/corporate-assets", titleKey: "sections.corporateAssets.title" },
  { href: "/branding/social-media", titleKey: "sections.socialMedia.title" },
  { href: "/branding/merchandise", titleKey: "sections.merchandise.title" },
  { href: "/branding/sub-brands", titleKey: "sections.subBrands.title" },
  { href: "/branding/guidelines", titleKey: "sections.guidelines.title" },
] as const;

export type GuidelinePage = (typeof GUIDELINE_PAGES)[number];

export function normalizeGuidelinePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed.length > 0 ? trimmed : "/";
}

export function guidelinePageIndex(pathname: string): number {
  const path = normalizeGuidelinePath(pathname);
  return GUIDELINE_PAGES.findIndex((page) => page.href === path);
}
