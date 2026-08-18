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

jest.mock("@/lib/brand/auth-brand-layers", () => ({
  logoRightBrandLayers: () => [],
}));

jest.mock("@/ui/shared/components/k-lab-brand-logo", () => ({
  KLabBrandLogoMark: () => <div>mark</div>,
}));

jest.mock("@k-lab/components", () => {
  function Tile() {
    return null;
  }
  Tile.Navigation = () => null;
  return {
    Button: ({
      children,
      href,
      onClick,
    }: React.PropsWithChildren<{ href?: string; onClick?: () => void }>) =>
      href ? <a href={href}>{children}</a> : <button onClick={onClick}>{children}</button>,
    Hero: ({
      title,
      actions,
    }: {
      title: string;
      actions: React.ReactNode;
    }) => (
      <section>
        <h1>{title}</h1>
        {actions}
      </section>
    ),
    Tile,
  };
});

import { HomeView } from "@/ui/brand-assets/views/HomeView";

describe("HomeView employee sign in", () => {
  beforeEach(() => {
    authState = { user: null, loading: false };
    viewerRole = "public";
  });

  it("shows Employee sign in for guests so they can still Microsoft-login", () => {
    render(<HomeView />);

    expect(screen.getByRole("link", { name: /employee sign in/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("hides Employee sign in when a Microsoft user is present", () => {
    authState = { user: { uid: "u1" }, loading: false };
    viewerRole = "employee";
    render(<HomeView />);

    expect(screen.queryByRole("link", { name: /employee sign in/i })).not.toBeInTheDocument();
  });
});
