import * as React from "react";
import { render, screen } from "@testing-library/react";

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
  usePortalRole: () => ({ viewerRole }),
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
    Button: ({
      children,
      href,
      onClick,
    }: React.PropsWithChildren<{ href?: string; onClick?: () => void }>) =>
      href ? <a href={href}>{children}</a> : <button onClick={onClick}>{children}</button>,
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

  it("shows Employee login for guests along with Brand guidelines and Brand assets", () => {
    render(<HomeView />);

    expect(screen.getByRole("link", { name: /employee login/i })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(screen.getByRole("link", { name: /brand guidelines/i })).toHaveAttribute(
      "href",
      "/branding",
    );
    expect(screen.getByRole("link", { name: /brand assets/i })).toHaveAttribute(
      "href",
      "/assets",
    );
    expect(
      screen.queryAllByRole("link").filter((link) => link.getAttribute("href") === "/sales"),
    ).toHaveLength(0);
    expect(screen.queryByRole("link", { name: /employee sign in/i })).not.toBeInTheDocument();
  });

  it("hides Employee login for signed-in employees and shows Sales resources", () => {
    authState = { user: { uid: "u1" }, loading: false };
    viewerRole = "employee";
    render(<HomeView />);

    expect(screen.queryByRole("link", { name: /employee login/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sales resources/i })).toHaveAttribute(
      "href",
      "/sales",
    );
  });

  it("does not dump branding category tiles on home", () => {
    render(<HomeView />);

    expect(screen.queryByRole("link", { name: /^logos$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^colors$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^typography$/i })).not.toBeInTheDocument();
  });

  it("carousels approved catalog backgrounds, one image per slide", () => {
    render(<HomeView />);

    const slides = screen.getAllByTestId("hero-slide");
    const srcs = screen.getAllByTestId("hero-media").map((node) =>
      node.getAttribute("data-src"),
    );

    expect(slides.length).toBeGreaterThanOrEqual(2);
    expect(srcs.every((src) => src?.includes("k-lab-bg-"))).toBe(true);
    expect(new Set(srcs).size).toBe(srcs.length);
  });
});
