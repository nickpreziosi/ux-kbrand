import * as React from "react";
import { render, screen } from "@testing-library/react";

const mockPathname = jest.fn(() => "/branding/logo");

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

jest.mock("next-intl", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const messages = require("@/public/locales/en.json");
  const format = (message: string, values: Record<string, unknown>) =>
    message.replace(/\{(\w+)\}/g, (_match, name: string) => String(values[name] ?? ""));

  return {
    useTranslations:
      (namespace: string) =>
      (key: string, values?: Record<string, unknown>) => {
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
        return format(message, values ?? {});
      },
    useMessages: () => messages,
  };
});

jest.mock("@k-lab/components", () => ({
  Button: ({
    children,
    href,
  }: React.PropsWithChildren<{
    href?: string;
  }>) => (href ? <a href={href}>{children}</a> : <button type="button">{children}</button>),
}));

import { GuidelinePagePager } from "@/ui/branding/components/guideline-page-pager";

function renderPager(pathname: string) {
  mockPathname.mockReturnValue(pathname);
  return render(<GuidelinePagePager />);
}

describe("GuidelinePagePager", () => {
  beforeEach(() => {
    mockPathname.mockReturnValue("/branding/logo");
  });

  it("on logos, previous goes to overview and next goes to colors", () => {
    renderPager("/branding/logo");

    expect(screen.getByRole("link", { name: /branding/i })).toHaveAttribute("href", "/branding");
    expect(screen.getByRole("link", { name: /colors/i })).toHaveAttribute("href", "/branding/colors");
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("on colors, previous goes to logos and next goes to typography", () => {
    renderPager("/branding/colors");

    expect(screen.getByRole("link", { name: /logos/i })).toHaveAttribute("href", "/branding/logo");
    expect(screen.getByRole("link", { name: /typography/i })).toHaveAttribute(
      "href",
      "/branding/typography",
    );
  });

  it("on sub-brands, next goes to brand guidelines", () => {
    renderPager("/branding/sub-brands");

    expect(screen.getByRole("link", { name: /merchandise/i })).toHaveAttribute(
      "href",
      "/branding/merchandise",
    );
    expect(screen.getByRole("link", { name: /brand guidelines/i })).toHaveAttribute(
      "href",
      "/branding/guidelines",
    );
  });

  it("does not render on the overview or brand guidelines pages", () => {
    const { unmount } = renderPager("/branding");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
    unmount();

    renderPager("/branding/guidelines");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
  });
});
