import * as React from "react";
import { render, screen, within } from "@testing-library/react";

let authState = { user: null as { uid: string } | null, loading: false };
let viewerRole: "public" | "employee" | "admin" = "public";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
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
  };
});

jest.mock("@/ui/user-management/auth/auth-provider", () => ({
  useAuth: () => authState,
}));

jest.mock("@/ui/user-management/hooks/use-portal-role", () => ({
  usePortalRole: () => ({
    viewerRole,
    isAdmin: viewerRole === "admin",
  }),
}));

jest.mock("@/ui/shared/components/k-lab-brand-logo", () => ({
  KLabBrandLogoMark: () => <div>mark</div>,
}));

jest.mock("@k-lab/components", () => {
  function Tile() {
    return null;
  }
  Tile.Navigation = ({
    href,
    title,
  }: {
    href?: string;
    title?: string;
  }) => (href ? <a href={href}>{title}</a> : null);

  function Hero({
    title,
    actions,
    children,
  }: {
    title?: string;
    actions?: React.ReactNode;
    children?: React.ReactNode;
  }) {
    return (
      <section>
        {title ? <h1>{title}</h1> : null}
        {actions}
        {children}
      </section>
    );
  }
  Hero.Carousel = ({ children }: React.PropsWithChildren) => (
    <div data-testid="hero-carousel">{children}</div>
  );
  Hero.Slide = ({ children }: React.PropsWithChildren) => (
    <div data-testid="hero-slide">{children}</div>
  );
  Hero.Media = ({
    layers,
  }: {
    layers?: Array<{ src?: string }>;
  }) => <div data-testid="hero-media" data-src={layers?.[0]?.src} />;
  Hero.Content = ({ children }: React.PropsWithChildren) => <div>{children}</div>;
  Hero.Logo = ({ children }: React.PropsWithChildren) => <div>{children}</div>;
  Hero.Title = ({ children }: React.PropsWithChildren) => <h1>{children}</h1>;
  Hero.Description = ({ children }: React.PropsWithChildren) => <p>{children}</p>;
  Hero.Actions = ({ children }: React.PropsWithChildren) => (
    <div data-testid="hero-actions">{children}</div>
  );

  function LaunchPage({ children }: React.PropsWithChildren) {
    return <div>{children}</div>;
  }
  LaunchPage.Hero = Hero;
  LaunchPage.Body = ({ children }: React.PropsWithChildren) => <div>{children}</div>;
  LaunchPage.Main = ({ children }: React.PropsWithChildren) => <div>{children}</div>;
  LaunchPage.Cards = ({ children }: React.PropsWithChildren) => <div>{children}</div>;
  LaunchPage.Section = ({
    children,
    title,
  }: React.PropsWithChildren<{ title?: string }>) => (
    <section>
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
  function LaunchTile({
    href,
    children,
  }: React.PropsWithChildren<{ href?: string }>) {
    return href ? <a href={href}>{children}</a> : <div>{children}</div>;
  }
  LaunchTile.Title = ({ children }: React.PropsWithChildren) => (
    <h3>{children}</h3>
  );
  LaunchTile.Description = ({ children }: React.PropsWithChildren) => (
    <p>{children}</p>
  );
  LaunchTile.Icon = ({ children }: React.PropsWithChildren) => <div>{children}</div>;
  LaunchTile.Header = ({ children }: React.PropsWithChildren) => <div>{children}</div>;
  LaunchTile.Footer = ({ children }: React.PropsWithChildren) => <div>{children}</div>;
  LaunchTile.Action = () => null;
  LaunchPage.Tile = LaunchTile;

  return {
    cn: (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" "),
    Button: ({
      children,
      href,
      onClick,
      variant,
      className,
    }: React.PropsWithChildren<{
      href?: string;
      onClick?: () => void;
      variant?: string;
      className?: string;
    }>) =>
      href ? (
        <a href={href} data-variant={variant} className={className}>
          {children}
        </a>
      ) : (
        <button onClick={onClick} data-variant={variant} className={className}>
          {children}
        </button>
      ),
    Hero,
    Tile,
    LaunchPage,
  };
});

import { HomeView } from "@/ui/brand-assets/views/HomeView";

describe("HomeView launch tiles", () => {
  beforeEach(() => {
    authState = { user: null, loading: false };
    viewerRole = "public";
  });

  it("gives guests one destination per slide plus Employee sign in", () => {
    render(<HomeView />);

    const slides = screen.getAllByTestId("hero-slide");
    expect(slides).toHaveLength(2);

    expect(within(slides[0]).getByRole("heading", { level: 1 })).toHaveTextContent(
      "The K Lab brand, ready to use",
    );
    expect(within(slides[0]).getByText(/lockups, color, type/i)).toBeInTheDocument();
    const guidelinesCta = within(slides[0]).getByRole("link", { name: "Brand guidelines" });
    expect(guidelinesCta).toHaveAttribute("href", "/branding");
    expect(guidelinesCta).toHaveAttribute("data-variant", "accent-brand");
    const signIn = within(slides[0]).getByRole("link", { name: "Employee sign in" });
    expect(signIn).toHaveAttribute("href", "/login");
    expect(signIn.className).toMatch(/bg-white/);

    expect(within(slides[1]).getByRole("heading", { level: 1 })).toHaveTextContent("Asset library");
    const assetsCta = within(slides[1]).getByRole("link", { name: "Asset library" });
    expect(assetsCta).toHaveAttribute("href", "/assets");
    expect(assetsCta).toHaveAttribute("data-variant", "accent-brand");
    expect(within(slides[1]).getByRole("link", { name: "Employee sign in" })).toHaveAttribute(
      "href",
      "/login",
    );

    expect(
      screen.queryAllByRole("link").filter((link) => link.getAttribute("href") === "/sales"),
    ).toHaveLength(0);
    expect(
      screen.queryAllByRole("link").filter((link) => link.getAttribute("href") === "/admin/assets"),
    ).toHaveLength(0);
  });

  it("hides Employee sign in for signed-in employees and adds a Sales resources slide", () => {
    authState = { user: { uid: "u1" }, loading: false };
    viewerRole = "employee";
    render(<HomeView />);

    expect(screen.queryByRole("link", { name: /employee sign in/i })).not.toBeInTheDocument();
    const slides = screen.getAllByTestId("hero-slide");
    expect(slides).toHaveLength(3);
    const salesCta = within(slides[2]).getByRole("link", { name: "Sales resources" });
    expect(salesCta).toHaveAttribute("href", "/sales");
    expect(salesCta).toHaveAttribute("data-variant", "accent-brand");
  });

  it("shows an Admin slide for admins", () => {
    authState = { user: { uid: "u1" }, loading: false };
    viewerRole = "admin";
    render(<HomeView />);

    const slides = screen.getAllByTestId("hero-slide");
    expect(slides).toHaveLength(4);
    const adminCta = within(slides[3]).getByRole("link", { name: "Admin" });
    expect(adminCta).toHaveAttribute("href", "/admin/assets");
    expect(adminCta).toHaveAttribute("data-variant", "accent-brand");

    const srcs = screen.getAllByTestId("hero-media").map((node) =>
      node.getAttribute("data-src"),
    );
    expect(srcs[srcs.length - 1]).toContain("k-lab-bg-004");
  });

  it("does not dump branding category tiles on home", () => {
    render(<HomeView />);

    expect(screen.queryByRole("link", { name: /^logos$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^colors$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^typography$/i })).not.toBeInTheDocument();
  });

  it("leads the carousel with the catalog background that was previously second", () => {
    render(<HomeView />);

    const srcs = screen.getAllByTestId("hero-media").map((node) =>
      node.getAttribute("data-src"),
    );

    expect(srcs[0]).toContain("k-lab-bg-003");
    expect(srcs.length).toBeGreaterThanOrEqual(2);
    expect(new Set(srcs).size).toBe(srcs.length);
  });
});
