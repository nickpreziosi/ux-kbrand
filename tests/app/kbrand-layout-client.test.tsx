import * as React from "react";
import { render, screen } from "@testing-library/react";

const captured: { props: Record<string, unknown> | null } = { props: null };
let authState = {
  user: null as { uid: string; displayName: string; email: string; photoUrl: string | null } | null,
  loading: false,
  signOut: jest.fn(),
};
let portalState = {
  viewerRole: "public" as "public" | "employee" | "admin",
  devRoleOverride: null as string | null,
  isAdmin: false,
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => "/branding",
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("next-intl", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const messages = require("@/public/locales/en.json");
  return {
    useTranslations:
      (namespace: string) =>
      (key: string) => {
        const path = `${namespace}.${key}`;
        const message = path
          .split(".")
          .reduce<unknown>(
            (node, part) => (node as Record<string, unknown>)?.[part],
            messages,
          );
        if (typeof message !== "string") {
          throw new Error(`Missing message: ${path}`);
        }
        return message;
      },
    useMessages: () => messages,
  };
});

jest.mock("@/ui/user-management/auth/auth-provider", () => ({
  useAuth: () => authState,
}));

jest.mock("@/ui/user-management/hooks/use-portal-role", () => ({
  usePortalRole: () => portalState,
}));

jest.mock("@/ui/user-management/dev/dev-role-override", () => ({
  DEV_ROLE_OVERRIDE_ENABLED: false,
  writeDevRoleOverride: jest.fn(),
}));

jest.mock("@/app/providers/app-intl-provider", () => ({
  useAppLocaleChange: () => ({ locale: "en", changeLocale: jest.fn() }),
}));

jest.mock("@/ui/shared/components/k-brand-sidebar-brand", () => ({
  KBrandSidebarBrand: () => <div>brand</div>,
}));

jest.mock("@/ui/shared/components/k-lab-brand-logo", () => ({
  KLabBrandLogo: () => <div>logo</div>,
}));

jest.mock("@/ui/user-management/components/guest-sidebar-sign-in", () => ({
  GuestSidebarSignIn: ({ pathname }: { pathname: string }) => (
    <div data-testid="guest-sidebar-sign-in">{pathname}</div>
  ),
}));

jest.mock("@k-lab/components", () => ({
  cn: (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" "),
  DEFAULT_LANGUAGE_OPTIONS: [{ code: "en", label: "English" }],
  DEFAULT_SIDEBAR_COLLAPSE_COOKIE: "k-lab-sidebar-collapsed",
  PREFERENCES_BAR_LAYOUT_FIXED_CLASS: "",
  PREFERENCES_BAR_LAYOUT_FLUSH_CLASS: "",
  PREFERENCES_BAR_LAYOUT_RESPONSIVE_CLASS: "",
  Button: ({
    children,
    href,
    icon,
    "aria-label": ariaLabel,
    title,
  }: React.PropsWithChildren<{
    href?: string;
    icon?: React.ReactNode;
    "aria-label"?: string;
    title?: string;
  }>) => (
    <a href={href} aria-label={ariaLabel} title={title}>
      {icon}
      {children}
    </a>
  ),
  Footer: Object.assign(
    ({ children }: React.PropsWithChildren) => <footer>{children}</footer>,
    {
      Container: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
      Grid: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
      Copyright: () => null,
      Nav: ({ children }: React.PropsWithChildren) => <nav>{children}</nav>,
      WebsiteLink: () => null,
      Separator: () => null,
      Feedback: () => null,
      HelpLink: () => null,
      Support: () => null,
      SocialLinks: () => null,
      FeedbackDialog: () => null,
    },
  ),
  PreferencesBar: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  PreferencesBarThemeToggle: () => null,
  PreferencesBarLanguageCommand: () => null,
  PreferencesBarDevEntityRoleDropdown: () => null,
  SupportDialogProvider: ({ children }: React.PropsWithChildren) => <>{children}</>,
  AppLayoutClient: (props: Record<string, unknown>) => {
    captured.props = props;
    return (
      <div data-testid="app-layout">
        {props.navbarRightSlot as React.ReactNode}
        {props.children as React.ReactNode}
      </div>
    );
  },
}));

import { KBrandLayoutClient } from "@/app/kbrand-layout-client";

describe("KBrandLayoutClient resources nav", () => {
  beforeEach(() => {
    captured.props = null;
    authState = { user: null, loading: false, signOut: jest.fn() };
    portalState = { viewerRole: "public", devRoleOverride: null, isAdmin: false };
  });

  it("keeps Branding as Brand guidelines and adds a Resources accordion with the Asset Library", () => {
    render(
      <KBrandLayoutClient>
        <div>page</div>
      </KBrandLayoutClient>,
    );

    const accordions = captured.props?.accordions as Array<{
      id: string;
      label: string;
      items: Array<{ href: string; label: string }>;
    }>;

    expect(accordions.map((item) => item.id)).toEqual(["branding", "resources"]);
    expect(accordions[0].label).toBe("Brand guidelines");
    expect(accordions[1].label).toBe("Resources");
    expect(accordions[1].items).toEqual([
      expect.objectContaining({ href: "/assets", label: "Asset library" }),
    ]);
    expect(accordions[1].items.some((item) => item.href === "/sales")).toBe(false);
    expect(captured.props?.bottomNav).toEqual([]);
  });

  it("shows Sales resources in Resources for employees, not in the bottom nav", () => {
    portalState = { viewerRole: "employee", devRoleOverride: null, isAdmin: false };
    authState = {
      user: {
        uid: "u1",
        displayName: "Ada",
        email: "ada@k-lab.ai",
        photoUrl: null,
      },
      loading: false,
      signOut: jest.fn(),
    };

    render(
      <KBrandLayoutClient>
        <div>page</div>
      </KBrandLayoutClient>,
    );

    const accordions = captured.props?.accordions as Array<{
      id: string;
      items: Array<{ href: string; label: string }>;
    }>;
    const resources = accordions.find((item) => item.id === "resources");

    expect(resources?.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/assets", label: "Asset library" }),
        expect.objectContaining({ href: "/sales", label: "Sales resources" }),
      ]),
    );
    expect(captured.props?.bottomNav).toEqual([]);
  });

  it("keeps admin destinations in the bottom nav", () => {
    portalState = { viewerRole: "admin", devRoleOverride: null, isAdmin: true };
    authState = {
      user: {
        uid: "u1",
        displayName: "Ada",
        email: "ada@k-lab.ai",
        photoUrl: null,
      },
      loading: false,
      signOut: jest.fn(),
    };

    render(
      <KBrandLayoutClient>
        <div>page</div>
      </KBrandLayoutClient>,
    );

    const accordions = captured.props?.accordions as Array<{
      id: string;
      items: Array<{ href: string }>;
    }>;
    const resources = accordions.find((item) => item.id === "resources");

    expect(resources?.items.some((item) => item.href === "/sales")).toBe(true);
    expect(captured.props?.bottomNav).toEqual([
      expect.objectContaining({ href: "/admin/assets", label: "Manage assets" }),
      expect.objectContaining({ href: "/admin/users", label: "Users & access" }),
    ]);
  });
});

describe("KBrandLayoutClient guest chrome", () => {
  beforeEach(() => {
    captured.props = null;
    authState = { user: null, loading: false, signOut: jest.fn() };
    portalState = { viewerRole: "public", devRoleOverride: null, isAdmin: false };
  });

  it("does not pass a user menu and shows Sign in for guests", () => {
    render(
      <KBrandLayoutClient>
        <div>page</div>
      </KBrandLayoutClient>,
    );

    expect(captured.props?.user).toBeUndefined();
    expect(captured.props?.onLogoutClick).toBeUndefined();
    expect(captured.props?.onSettingsClick).toBeUndefined();
    expect(captured.props?.onProfileClick).toBeUndefined();
    const signIn = screen.getByRole("link", { name: "Sign in" });
    expect(signIn).toHaveAttribute("href", "/login?next=%2Fbranding");
    expect(signIn).toHaveAttribute("aria-label", "Sign in");
    expect(signIn).toHaveAttribute("title", "Sign in");
    expect(screen.getByTestId("guest-sidebar-sign-in")).toHaveTextContent("/branding");
    const host = document.querySelector("[data-kbrand-guest]");
    expect(host).not.toBeNull();
    expect(String(captured.props?.className ?? "")).toContain("kbrand-guest-chrome");
  });

  it("passes the Microsoft user through to the account menu", () => {
    authState = {
      user: {
        uid: "u1",
        displayName: "Ada",
        email: "ada@k-lab.ai",
        photoUrl: null,
      },
      loading: false,
      signOut: jest.fn(),
    };
    portalState = { viewerRole: "employee", devRoleOverride: null, isAdmin: false };

    render(
      <KBrandLayoutClient>
        <div>page</div>
      </KBrandLayoutClient>,
    );

    expect(captured.props?.user).toEqual({
      name: "Ada",
      email: "ada@k-lab.ai",
      avatar: undefined,
    });
    expect(captured.props?.onLogoutClick).toEqual(expect.any(Function));
    expect(captured.props?.onSettingsClick).toEqual(expect.any(Function));
    expect(screen.queryByRole("link", { name: /sign in/i })).not.toBeInTheDocument();
    expect(screen.queryByTestId("guest-sidebar-sign-in")).not.toBeInTheDocument();
    expect(document.querySelector("[data-kbrand-guest]")).toBeNull();
    expect(String(captured.props?.className ?? "")).not.toContain("kbrand-guest-chrome");
  });
});
