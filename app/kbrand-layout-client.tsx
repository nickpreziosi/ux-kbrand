"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AppLayoutClient,
  Button,
  DEFAULT_LANGUAGE_OPTIONS,
  DEFAULT_SIDEBAR_COLLAPSE_COOKIE,
  Footer,
  PreferencesBar,
  PreferencesBarDevEntityRoleDropdown,
  PreferencesBarLanguageCommand,
  PreferencesBarThemeToggle,
  PREFERENCES_BAR_LAYOUT_FIXED_CLASS,
  PREFERENCES_BAR_LAYOUT_FLUSH_CLASS,
  PREFERENCES_BAR_LAYOUT_RESPONSIVE_CLASS,
  SupportDialogProvider,
  cn,
  type AppSidebarAccordionItem,
  type AppSidebarNavLink,
  type SupportTopicOption,
} from "@k-lab/components";
import {
  BookOpen,
  Boxes,
  Briefcase,
  Camera,
  FolderCog,
  House,
  Image as ImageIcon,
  Images,
  LayoutGrid,
  LogIn,
  Palette,
  PenTool,
  Presentation,
  Shapes,
  Share2,
  ShoppingBag,
  Type,
  Users,
} from "lucide-react";
import { useMessages, useTranslations } from "next-intl";
import { canSeeSalesSection } from "@/contexts/brand-assets/domain/services/asset-access";
import type { ViewerRole } from "@/contexts/shared/domain/viewer-role";
import { shouldShowGuestChrome } from "@/lib/auth/guest-chrome";
import { isPublicPath } from "@/lib/auth/public-routes";
import { useAuth } from "@/ui/user-management/auth/auth-provider";
import {
  DEV_ROLE_OVERRIDE_ENABLED,
  writeDevRoleOverride,
} from "@/ui/user-management/dev/dev-role-override";
import { GuestSidebarSignIn } from "@/ui/user-management/components/guest-sidebar-sign-in";
import { usePortalRole } from "@/ui/user-management/hooks/use-portal-role";
import { useAppLocaleChange } from "@/app/providers/app-intl-provider";
import { KBrandSidebarBrand } from "@/ui/shared/components/k-brand-sidebar-brand";
import { KLabBrandLogo } from "@/ui/shared/components/k-lab-brand-logo";

/** Same recipe as InternalAppShellLayout DEMO_SUPPORT_TOPICS. */
const SUPPORT_TOPICS: SupportTopicOption[] = [
  { id: "access", label: "Access" },
  { id: "brand-assets", label: "Brand assets" },
  { id: "bug", label: "Bug report" },
  { id: "other", label: "Other" },
];

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
  const messages = useMessages();
  const { user, signOut, loading: authLoading } = useAuth();
  const { viewerRole, devRoleOverride, isAdmin } = usePortalRole();
  // Sign-in action is for settled anonymous sessions only — hidden while auth
  // is restoring (no signed-in flash) and when a dev role override is active.
  const showSignIn = shouldShowGuestChrome({
    authLoading,
    user,
    viewerRole,
  });
  const tDevRole = useTranslations("devTools.roleSwitcher");
  const { locale, changeLocale } = useAppLocaleChange();

  // Read Footer copy from the loaded message tree (same keys as k-lab-components).
  // Avoid useTranslations("Footer") — a stale provider tree without that namespace
  // otherwise paints literal "Footer.*" keys into the component.
  const footerMessages = React.useMemo(() => {
    const footer = (messages as Record<string, unknown> | undefined)?.Footer;
    if (!footer || typeof footer !== "object") return undefined;
    return footer as {
      copyright: string;
      website: string;
      legal: string;
      feedback: string;
      help: string;
      support: string;
      utilityLinksNavLabel: string;
      socialNavLabel: string;
      socialLinkedIn: string;
      socialX: string;
      socialInstagram: string;
      socialTiktok: string;
      socialYoutube: string;
    };
  }, [messages]);

  const primaryNav = React.useMemo<AppSidebarNavLink[]>(
    () => [
      { href: "/", label: t("nav.home"), icon: House },
      { href: "/assets", label: t("nav.assetLibrary"), icon: Images },
      ...(canSeeSalesSection(viewerRole)
        ? [{ href: "/sales", label: t("nav.sales"), icon: Presentation }]
        : []),
    ],
    [t, viewerRole]
  );

  const brandingAccordion = React.useMemo<AppSidebarAccordionItem>(
    () => ({
      id: "branding",
      label: t("nav.guidelines"),
      icon: Palette,
      items: [
        { href: "/branding", label: t("nav.overview"), icon: LayoutGrid },
        { href: "/branding/logo", label: t("nav.logo"), icon: PenTool },
        { href: "/branding/colors", label: t("nav.colors"), icon: Palette },
        { href: "/branding/typography", label: t("nav.typography"), icon: Type },
        { href: "/branding/iconography", label: t("nav.iconography"), icon: Shapes },
        { href: "/branding/imagery", label: t("nav.imagery"), icon: ImageIcon },
        { href: "/branding/photography", label: t("nav.photography"), icon: Camera },
        { href: "/branding/corporate-assets", label: t("nav.corporateAssets"), icon: Briefcase },
        { href: "/branding/social-media", label: t("nav.socialMedia"), icon: Share2 },
        { href: "/branding/merchandise", label: t("nav.merchandise"), icon: ShoppingBag },
        { href: "/branding/sub-brands", label: t("nav.subBrands"), icon: Boxes },
        { href: "/branding/guidelines", label: t("nav.guidelines"), icon: BookOpen },
      ],
    }),
    [t]
  );

  const adminAccordion = React.useMemo<AppSidebarAccordionItem[]>(
    () =>
      isAdmin
        ? [
            {
              id: "admin",
              label: t("nav.admin"),
              icon: FolderCog,
              items: [
                { href: "/admin/assets", label: t("nav.adminAssets"), icon: FolderCog },
                { href: "/admin/users", label: t("nav.adminUsers"), icon: Users },
              ],
            },
          ]
        : [],
    [isAdmin, t]
  );

  const isAuthPage = isPublicPath(pathname);

  const handleLogoutClick = async () => {
    await signOut();
    router.replace("/login");
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

  const footer = (
    <Footer className="mt-auto border-t" messages={footerMessages}>
      <Footer.Container>
        <Footer.Grid>
          <Footer.Copyright year={2026} />
          <Footer.Nav>
            <Footer.WebsiteLink href="https://k-lab.ai" />
            <Footer.Separator />
            <Footer.Feedback />
            <Footer.Separator />
            <Footer.HelpLink href="/branding/guidelines" />
            <Footer.Separator />
            <Footer.Support />
          </Footer.Nav>
          <Footer.SocialLinks />
        </Footer.Grid>
      </Footer.Container>
      <Footer.FeedbackDialog onSubmit={async () => undefined} />
    </Footer>
  );

  return (
    <SupportDialogProvider
      supportTopics={SUPPORT_TOPICS}
      defaultEmail={shellUser?.email ?? undefined}
      onSubmit={async () => undefined}
    >
      <div {...(showSignIn ? { "data-kbrand-guest": "" } : {})} className="contents">
        {showSignIn ? <GuestSidebarSignIn pathname={pathname} /> : null}
        <AppLayoutClient
          className={showSignIn ? "kbrand-guest-chrome" : undefined}
          currentPath={pathname}
          homeHref="/"
          initialCollapsed={initialSidebarCollapsed}
          sidebarCollapseCookieKey={DEFAULT_SIDEBAR_COLLAPSE_COOKIE}
          preferences={preferences}
          primaryNav={primaryNav}
          accordions={[brandingAccordion, ...adminAccordion]}
          bottomNav={[]}
          user={showSignIn ? undefined : shellUser}
          onProfileClick={showSignIn ? undefined : () => undefined}
          onSettingsClick={showSignIn ? undefined : () => router.push("/settings")}
          onLogoutClick={showSignIn ? undefined : handleLogoutClick}
          locale={locale}
          onLocaleChange={(code) => {
            void changeLocale(code);
          }}
          languages={DEFAULT_LANGUAGE_OPTIONS}
          brand={<KBrandSidebarBrand />}
          footer={footer}
          navbarRightSlot={
            showSignIn ? (
              <Button
                variant="accent-brand"
                size="icon"
                className="h-11 w-11 shrink-0"
                icon={<LogIn aria-hidden />}
                href={`/login?next=${encodeURIComponent(pathname)}`}
                aria-label={t("signIn")}
                title={t("signIn")}
              />
            ) : undefined
          }
        mobileHeader={
          <Link
            href="/"
            className="flex h-11 w-full min-w-0 items-center"
            aria-label={t("homeAriaLabel")}
          >
            <span className="inline-flex h-8 max-w-full items-center origin-left scale-[1.08]">
              <KLabBrandLogo
                variant="theme-aware"
                className="h-7 w-auto max-w-full"
                aria-hidden
              />
            </span>
          </Link>
        }
        contentClassName="bg-background"
      >
        <div className="mx-auto w-full max-w-[1800px]">{children}</div>
      </AppLayoutClient>
      </div>
    </SupportDialogProvider>
  );
}
