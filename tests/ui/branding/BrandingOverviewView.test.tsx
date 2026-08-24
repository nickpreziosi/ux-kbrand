import * as React from "react";
import { render, screen } from "@testing-library/react";

const mockUseCategoryAssets = jest.fn();

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.src} alt={props.alt} className={props.className} />
  ),
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
  };
});

jest.mock("@/ui/brand-assets/hooks/use-category-assets", () => ({
  useCategoryAssets: (...args: unknown[]) => mockUseCategoryAssets(...args),
}));

jest.mock("@/ui/shared/components/k-brand-page-header", () => ({
  KBrandPageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock("@/ui/shared/components/k-lab-brand-logo", () => ({
  KLabBrandLogoMark: () => <span>logo</span>,
}));

jest.mock("@/ui/branding/components/document-viewer-card", () => ({
  DocumentViewerCard: () => <div data-testid="brand-book" />,
}));

jest.mock("@k-lab/components", () => ({
  Card: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  CardContent: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Tile: {
    Navigation: ({ title }: { title: string }) => <a href="/">{title}</a>,
  },
}));

import { BrandingOverviewView } from "@/ui/branding/views/BrandingOverviewView";
import { OVERVIEW_WELCOME_BACKGROUND } from "@/ui/branding/content/brand-overview";

describe("BrandingOverviewView", () => {
  beforeEach(() => {
    mockUseCategoryAssets.mockReturnValue({
      assets: [],
      loading: false,
      loadError: null,
      refresh: jest.fn(),
    });
  });

  it("renders the overview artboards before the section tiles", () => {
    render(<BrandingOverviewView />);

    expect(
      screen.getByRole("heading", {
        name: "Welcome to the K Lab Brand Guidelines.",
      }),
    ).toBeInTheDocument();
    expect(
      document.querySelector(`img[src="${OVERVIEW_WELCOME_BACKGROUND}"]`),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "About K Lab" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Brand Vision" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Fundamentals" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Brand Values" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Trust")).toBeInTheDocument();
    expect(screen.getByText("Why K Rails exists")).toBeInTheDocument();
    expect(screen.getByTestId("brand-book")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Brand sections" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Logos" })).toBeInTheDocument();
  });
});
