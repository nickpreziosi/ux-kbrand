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
  Button: ({
    children,
    href,
    icon,
    variant,
    className,
  }: React.PropsWithChildren<{
    href?: string;
    icon?: React.ReactNode;
    variant?: string;
    className?: string;
  }>) => (
    <a href={href} data-variant={variant} className={className}>
      {icon}
      {children}
    </a>
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
    expect(link).toHaveAttribute("data-variant", "ghost");
    expect(link.className).toMatch(/justify-start/);
    expect(link.querySelector("svg")).not.toBeNull();
    expect(footer.querySelector("[data-kbrand-guest-sign-in]")).not.toBeNull();

    unmount();
    footer.remove();
  });

  it("finds k-lab SidebarFooter nodes that have no data-sidebar hook", () => {
    const footer = document.createElement("div");
    footer.className = "border-t border-sidebar-border p-4";
    document.body.appendChild(footer);

    expect(findSidebarFooters()).toContain(footer);

    footer.remove();
  });

  it("portals Sign in into a k-lab SidebarFooter without data-sidebar", async () => {
    const footer = document.createElement("div");
    footer.className = "border-t border-sidebar-border p-4";
    document.body.appendChild(footer);

    const { unmount } = render(<GuestSidebarSignIn pathname="/" />);

    await waitFor(() => {
      expect(footer).toHaveTextContent("Sign in");
    });

    unmount();
    footer.remove();
  });
});
