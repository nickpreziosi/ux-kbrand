import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { findSidebarFooters, GuestSidebarSignIn } from "@/ui/user-management/components/guest-sidebar-sign-in";

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

jest.mock("@k-lab/components", () => ({
  TooltipProvider: ({ children }: React.PropsWithChildren) => <>{children}</>,
  Tooltip: ({ children }: React.PropsWithChildren) => <>{children}</>,
  TooltipTrigger: ({ children }: React.PropsWithChildren) => <>{children}</>,
  TooltipContent: ({
    children,
    side,
  }: React.PropsWithChildren<{ side?: string }>) => (
    <div data-testid="guest-sign-in-tooltip" data-side={side}>
      {children}
    </div>
  ),
}));

describe("GuestSidebarSignIn", () => {
  it("portals Sign in into the sidebar footer with a login next path", async () => {
    const footer = document.createElement("div");
    footer.setAttribute("data-sidebar", "footer");
    document.body.appendChild(footer);

    const { unmount } = render(<GuestSidebarSignIn pathname="/branding/logo" />);

    await waitFor(() => {
      expect(footer).toHaveTextContent("Sign in");
    });
    const link = screen.getByRole("link", { name: /sign in/i });
    expect(link).toHaveAttribute("href", "/login?next=%2Fbranding%2Flogo");
    expect(link.className).toMatch(/justify-start/);
    expect(link.className).toMatch(/overflow-hidden/);
    expect(link.className).toMatch(/h-10/);
    expect(link.className).toMatch(/w-full/);
    expect(link.querySelector("svg")).not.toBeNull();
    expect(footer.querySelector("[data-kbrand-guest-sign-in]")).not.toBeNull();
    expect(screen.queryByTestId("guest-sign-in-tooltip")).not.toBeInTheDocument();

    unmount();
    footer.remove();
  });

  it("finds k-lab SidebarFooter nodes that have no data-sidebar hook", () => {
    const footer = document.createElement("div");
    footer.className = "border-t border-sidebar-border p-5";
    document.body.appendChild(footer);

    expect(findSidebarFooters()).toContain(footer);

    footer.remove();
  });

  it("portals Sign in into a k-lab SidebarFooter without data-sidebar", async () => {
    const footer = document.createElement("div");
    footer.className = "border-t border-sidebar-border p-5";
    document.body.appendChild(footer);

    const { unmount } = render(<GuestSidebarSignIn pathname="/" />);

    await waitFor(() => {
      expect(footer).toHaveTextContent("Sign in");
    });

    unmount();
    footer.remove();
  });

  it("matches collapsed sidebar links: icon-only control with a right tooltip", async () => {
    const sidebar = document.createElement("div");
    sidebar.setAttribute("data-collapsed", "true");
    const footer = document.createElement("div");
    footer.className = "border-t border-sidebar-border p-5";
    sidebar.appendChild(footer);
    document.body.appendChild(sidebar);

    const { unmount } = render(<GuestSidebarSignIn pathname="/" />);

    await waitFor(() => {
      expect(footer.querySelector("[data-kbrand-guest-sign-in]")).not.toBeNull();
    });
    const link = screen.getByRole("link", { name: "Sign in" });
    expect(link).toHaveAttribute("href", "/login?next=%2F");
    expect(link).toHaveAttribute("aria-label", "Sign in");
    expect(link).not.toHaveTextContent("Sign in");
    expect(link.className).toMatch(/h-10/);
    expect(link.className).toMatch(/w-10/);
    expect(link.className).toMatch(/justify-center/);
    expect(link.querySelector("svg")).not.toBeNull();
    const tooltip = screen.getByTestId("guest-sign-in-tooltip");
    expect(tooltip).toHaveTextContent("Sign in");
    expect(tooltip).toHaveAttribute("data-side", "right");

    unmount();
    sidebar.remove();
  });
});
