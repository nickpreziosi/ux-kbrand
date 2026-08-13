"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AppLayoutClient,
  Button,
  DEFAULT_LANGUAGE_OPTIONS,
  DEFAULT_SIDEBAR_COLLAPSE_COOKIE,
  KLabLogo,
  PreferencesBar,
  PreferencesBarDevEntityRoleDropdown,
  PreferencesBarLanguageCommand,
  PreferencesBarThemeToggle,
  PREFERENCES_BAR_LAYOUT_FIXED_CLASS,
  PREFERENCES_BAR_LAYOUT_FLUSH_CLASS,
  PREFERENCES_BAR_LAYOUT_RESPONSIVE_CLASS,
  cn,
  type AppSidebarAccordionItem,
  type AppSidebarNavLink,
} from "@k-lab/components";
import {
  BookOpen,
  FolderCog,
  House,
  Image as ImageIcon,
  LayoutGrid,
  LogIn,
  Palette,
  PenTool,
  Presentation,
  Type,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { canSeeSalesSection } from "@/contexts/brand-assets/domain/services/asset-access";
import type { ViewerRole } from "@/contexts/shared/domain/viewer-role";
import { useAuth } from "@/ui/user-management/auth/auth-provider";
import {
  DEV_ROLE_OVERRIDE_ENABLED,
  writeDevRoleOverride,
} from "@/ui/user-management/dev/dev-role-override";
import { usePortalRole } from "@/ui/user-management/hooks/use-portal-role";
import { isPublicPath } from "@/lib/auth/public-routes";
import { useAppLocaleChange } from "@/app/providers/app-intl-provider";

interface KBrandLayoutClientProps {
  children: React.ReactNode;
  /** From server cookie for SSR/hydration match */
  initialSidebarCollapsed?: boolean;
}

/**
 * App chrome via library {@link AppLayoutClient} — same recipe as the other
 * product repos. Brand-portal specific: the portal is public-first, so no
 * login redirect here (middleware guards /sales and /admin); anonymous
 * visitors get a sign-in action instead of the user menu.
 */
export function KBrandLayoutClient({
  children,
  initialSidebarCollapsed = false,
}: KBrandLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const t = useTranslations("shell");
  const { user, signOut } = useAuth();
  const { viewerRole, devRoleOverride, isAdmin } = usePortalRole();
  const tDevRole = useTranslations("devTools.roleSwitcher");
  const { locale, changeLocale } = useAppLocaleChange();

  const primaryNav = React.useMemo<AppSidebarNavLink[]>(
    () => [{ href: "/", label: t("nav.home"), icon: House }],
    [t]
  );

  /** Branding standards live under one expandable group; the full guidelines
   *  document is the last entry, as the source of truth behind the summaries. */
  const brandingAccordion = React.useMemo<AppSidebarAccordionItem[]>(
    () => [
      {
        id: "branding",
        label: t("nav.branding"),
        icon: Palette,
        items: [
          { href: "/branding", label: t("nav.overview"), icon: LayoutGrid },
          { href: "/branding/logo", label: t("nav.logo"), icon: PenTool },
          { href: "/branding/colors", label: t("nav.colors"), icon: Palette },
          { href: "/branding/typography", label: t("nav.typography"), icon: Type },
          { href: "/branding/imagery", label: t("nav.imagery"), icon: ImageIcon },
          { href: "/branding/guidelines", label: t("nav.guidelines"), icon: BookOpen },
        ],
      },
    ],
    [t]
  );

  // Public visitors don't see the Sales section at all; admins additionally
  // get the management area (see asset-access domain rules).
  const secondaryNav = React.useMemo<AppSidebarNavLink[]>(
    () => [
      ...(canSeeSalesSection(viewerRole)
        ? [{ href: "/sales", label: t("nav.sales"), icon: Presentation }]
        : []),
      ...(isAdmin
        ? [
            { href: "/admin/assets", label: t("nav.adminAssets"), icon: FolderCog },
            { href: "/admin/users", label: t("nav.adminUsers"), icon: Users },
          ]
        : []),
    ],
    [viewerRole, isAdmin, t]
  );

  const isAuthPage = isPublicPath(pathname);

  const handleLogoutClick = async () => {
    await signOut();
    router.replace("/");
  };

  const shellUser = user
    ? {
        name: user.displayName || user.email || t("userNameFallback"),
        email: user.email ?? "",
        avatar: user.photoUrl ?? undefined,
      }
    : undefined;

  const preferences = (
    <div className={cn(PREFERENCES_BAR_LAYOUT_FIXED_CLASS, PREFERENCES_BAR_LAYOUT_RESPONSIVE_CLASS)}>
      <PreferencesBar className={PREFERENCES_BAR_LAYOUT_FLUSH_CLASS} ariaLabel={t("preferencesAriaLabel")}>
        <PreferencesBarThemeToggle />
        <PreferencesBarLanguageCommand
          value={locale}
          languages={DEFAULT_LANGUAGE_OPTIONS}
          onLanguageChange={(code) => {
            void changeLocale(code);
          }}
          syncDocumentAttributes
        />
        {DEV_ROLE_OVERRIDE_ENABLED ? (
          // Dev-only role mock (same dev-session control as the other repos).
          // Overrides the client-side viewerRole; the session cookie stays real.
          <PreferencesBarDevEntityRoleDropdown
            className={devRoleOverride ? "text-warning" : undefined}
            tooltipText={tDevRole("tooltip")}
            title={tDevRole("title")}
            entityLabel={tDevRole("entityLabel")}
            roleLabel={tDevRole("roleLabel")}
            applyLabel={tDevRole("apply")}
            resetLabel={tDevRole("reset")}
            entities={[{ value: "kbrand", label: tDevRole("entity") }]}
            rolesForEntity={() =>
              (["public", "employee", "admin"] as ViewerRole[]).map((role) => ({
                value: role,
                label: tDevRole(`roles.${role}`),
              }))
            }
            value={{ entity: "kbrand", role: viewerRole }}
            onApply={(_entity, role) => {
              writeDevRoleOverride(role as ViewerRole);
            }}
            onReset={() => {
              writeDevRoleOverride(null);
            }}
          />
        ) : null}
      </PreferencesBar>
    </div>
  );

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <AppLayoutClient
      currentPath={pathname}
      homeHref="/"
      initialCollapsed={initialSidebarCollapsed}
      sidebarCollapseCookieKey={DEFAULT_SIDEBAR_COLLAPSE_COOKIE}
      preferences={preferences}
      primaryNav={primaryNav}
      accordions={brandingAccordion}
      bottomNav={secondaryNav}
      user={shellUser}
      onProfileClick={() => undefined}
      onSettingsClick={() => router.push("/settings")}
      onLogoutClick={handleLogoutClick}
      locale={locale}
      onLocaleChange={(code) => {
        void changeLocale(code);
      }}
      languages={DEFAULT_LANGUAGE_OPTIONS}
      customLogo={<KLabLogo className="h-6 w-auto" aria-hidden />}
      customLogoCollapsed={<KLabLogo variant="icon" className="h-9 w-9 shrink-0" />}
      navbarRightSlot={
        !user ? (
          <Button
            variant="accent-brand"
            size="sm"
            icon={<LogIn aria-hidden />}
            href={`/login?next=${encodeURIComponent(pathname)}`}
          >
            {t("signIn")}
          </Button>
        ) : undefined
      }
      mobileHeader={
        <Link
          href="/"
          className="flex h-11 w-full min-w-0 items-center"
          aria-label={t("homeAriaLabel")}
        >
          <span className="inline-flex h-8 max-w-full items-center origin-left scale-[1.08]">
            <KLabLogo className="h-7 w-auto max-w-full" aria-hidden />
          </span>
        </Link>
      }
      contentClassName="mx-auto w-full max-w-7xl 2xl:max-w-[1800px]"
    >
      {children}
    </AppLayoutClient>
  );
}
