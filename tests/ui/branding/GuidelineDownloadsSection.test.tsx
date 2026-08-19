import * as React from "react";
import { render, screen } from "@testing-library/react";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

const gridAssets: BrandAsset[][] = [];

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

jest.mock("@/ui/brand-assets/components/asset-grid", () => ({
  AssetGrid: ({ assets }: { assets: BrandAsset[] }) => {
    gridAssets.push(assets);
    return <div data-testid="asset-grid">{assets.length} cards</div>;
  },
}));

jest.mock("@k-lab/components", () => ({
  Button: ({
    children,
    href,
  }: React.PropsWithChildren<{ href?: string }>) =>
    href ? <a href={href}>{children}</a> : <button type="button">{children}</button>,
}));

import { GuidelineDownloadsSection } from "@/ui/branding/components/guideline-downloads-section";

function asset(id: string): BrandAsset {
  return {
    id,
    title: id,
    description: "",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id,
        fileName: `${id}.webp`,
        contentType: "image/webp",
        sizeBytes: 1,
        storagePath: `assets/${id}.webp`,
        downloadUrl: `/brand-files/${id}.webp`,
      },
    ],
    tags: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
  };
}

describe("GuidelineDownloadsSection", () => {
  beforeEach(() => {
    gridAssets.length = 0;
  });

  it("renders the given cards and a View all link into the library", () => {
    render(
      <GuidelineDownloadsSection
        title="Image library"
        description="Approved backgrounds."
        category="brand-imagery"
        assets={[asset("a"), asset("b")]}
        loading={false}
      />,
    );

    expect(screen.getByRole("heading", { name: "Image library" })).toBeInTheDocument();
    expect(screen.getByText("Approved backgrounds.")).toBeInTheDocument();
    expect(screen.getByTestId("asset-grid")).toHaveTextContent("2 cards");
    expect(screen.getByRole("link", { name: "View all Brand imagery" })).toHaveAttribute(
      "href",
      "/assets?category=brand-imagery",
    );
  });

  it("does not dump an empty grid when there are no featured assets", () => {
    render(
      <GuidelineDownloadsSection
        title="Templates"
        description="Print files."
        category="corporate-assets"
        assets={[]}
        loading={false}
      />,
    );

    expect(screen.queryByTestId("asset-grid")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all Corporate assets" })).toHaveAttribute(
      "href",
      "/assets?category=corporate-assets",
    );
  });
});
