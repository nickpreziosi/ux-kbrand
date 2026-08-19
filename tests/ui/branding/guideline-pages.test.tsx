import * as React from "react";
import { render, screen } from "@testing-library/react";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { TYPOGRAPHY_TOKEN_FILE } from "@/ui/branding/content/typeface";

const mockUseCategoryAssets = jest.fn();
const capturedGrids: BrandAsset[][] = [];

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.src} alt={props.alt} />
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

jest.mock("@/ui/brand-assets/components/asset-grid", () => ({
  AssetGrid: ({ assets }: { assets: BrandAsset[] }) => {
    capturedGrids.push(assets);
    return <div data-testid="asset-grid">{assets.length}</div>;
  },
}));

jest.mock("@/ui/shared/components/k-brand-page-header", () => ({
  KBrandPageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock("@k-lab/components", () => ({
  cn: (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" "),
  Badge: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  Button: ({
    children,
    href,
  }: React.PropsWithChildren<{ href?: string }>) =>
    href ? <a href={href}>{children}</a> : <button type="button">{children}</button>,
  Card: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  CardContent: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  CardTitle: ({ children }: React.PropsWithChildren) => <h3>{children}</h3>,
  Skeleton: () => <div data-testid="skeleton" />,
}));

import { ImageryView } from "@/ui/branding/views/ImageryView";
import { TypographyView } from "@/ui/branding/views/TypographyView";
import { PhotographyView } from "@/ui/branding/views/PhotographyView";
import { CorporateAssetsView } from "@/ui/branding/views/CorporateAssetsView";
import { IconographyView } from "@/ui/branding/views/IconographyView";
import { SocialMediaView } from "@/ui/branding/views/SocialMediaView";
import { MerchandiseView } from "@/ui/branding/views/MerchandiseView";
import { SubBrandsView } from "@/ui/branding/views/SubBrandsView";

function asset(
  id: string,
  category: AssetCategory,
  extra: Partial<BrandAsset> = {},
): BrandAsset {
  return {
    id,
    title: id,
    description: "",
    resourceType: "brand",
    category,
    product: extra.product ?? "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id,
        fileName: extra.files?.[0]?.fileName ?? `${id}.png`,
        contentType: "image/png",
        sizeBytes: 1,
        storagePath: `assets/${id}.png`,
        downloadUrl: `/brand-files/${id}.png`,
      },
    ],
    previewUrl: `/brand-files/${id}.png`,
    tags: extra.tags ?? [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
    ...extra,
  };
}

function many(category: AssetCategory, count: number): BrandAsset[] {
  return Array.from({ length: count }, (_, index) =>
    asset(`${category}-${index}`, category),
  );
}

function stubCategory(assets: BrandAsset[]) {
  mockUseCategoryAssets.mockImplementation((category: AssetCategory) => ({
    assets: assets.filter((row) => row.category === category),
    loading: false,
    loadError: null,
    refresh: jest.fn(),
  }));
}

describe("guideline pages featured downloads", () => {
  beforeEach(() => {
    capturedGrids.length = 0;
    mockUseCategoryAssets.mockReset();
  });

  it("keeps imagery usage rules and caps the library dump", () => {
    stubCategory(many("brand-imagery", 6));
    render(<ImageryView />);

    expect(screen.getByRole("heading", { name: "Do" })).toBeInTheDocument();
    expect(capturedGrids[0]).toHaveLength(4);
    expect(screen.getByRole("link", { name: "View all Brand imagery" })).toHaveAttribute(
      "href",
      "/assets?category=brand-imagery",
    );
  });

  it("keeps the typeface specimen and caps font downloads", () => {
    stubCategory([
      ...many("fonts", 5),
      asset("tokens", "fonts", {
        files: [
          {
            id: "tokens",
            fileName: TYPOGRAPHY_TOKEN_FILE,
            contentType: "text/css",
            sizeBytes: 1,
            storagePath: `assets/${TYPOGRAPHY_TOKEN_FILE}`,
            downloadUrl: `/brand-files/${TYPOGRAPHY_TOKEN_FILE}`,
          },
        ],
      }),
    ]);
    render(<TypographyView />);

    expect(screen.getByRole("heading", { name: "Typeface" })).toBeInTheDocument();
    expect(capturedGrids[0]).toHaveLength(4);
    expect(capturedGrids[0].every((row) => row.id !== "tokens")).toBe(true);
    expect(screen.getByRole("link", { name: "View all Fonts" })).toHaveAttribute(
      "href",
      "/assets?category=fonts",
    );
  });

  it("keeps photography principles and caps approved renders", () => {
    stubCategory(many("photography", 6));
    render(<PhotographyView />);

    expect(screen.getByRole("heading", { name: "Principles" })).toBeInTheDocument();
    expect(capturedGrids[0]).toHaveLength(4);
    expect(screen.getByRole("link", { name: "View all Photography" })).toHaveAttribute(
      "href",
      "/assets?category=photography",
    );
  });

  it("keeps corporate stationery mockups and caps template downloads", () => {
    stubCategory(many("corporate-assets", 6));
    render(<CorporateAssetsView />);

    expect(screen.getByRole("heading", { name: "Stationery system" })).toBeInTheDocument();
    expect(capturedGrids[0]).toHaveLength(4);
    expect(screen.getByRole("link", { name: "View all Corporate assets" })).toHaveAttribute(
      "href",
      "/assets?category=corporate-assets",
    );
  });

  it("keeps icon style samples and caps icon downloads", () => {
    stubCategory(many("iconography", 6));
    render(<IconographyView />);

    expect(screen.getByRole("heading", { name: "Icon style" })).toBeInTheDocument();
    expect(capturedGrids[0]).toHaveLength(4);
    expect(screen.getByRole("link", { name: "View all Iconography" })).toHaveAttribute(
      "href",
      "/assets?category=iconography",
    );
  });

  it("keeps social avatar mockups and caps social downloads", () => {
    stubCategory(many("social-media", 6));
    render(<SocialMediaView />);

    expect(screen.getByRole("heading", { name: "Profile avatars" })).toBeInTheDocument();
    expect(capturedGrids[0]).toHaveLength(4);
    expect(screen.getByRole("link", { name: "View all Social media" })).toHaveAttribute(
      "href",
      "/assets?category=social-media",
    );
  });

  it("keeps merchandise treatments and caps artwork downloads", () => {
    stubCategory(many("merchandise", 6));
    render(<MerchandiseView />);

    expect(screen.getByRole("heading", { name: "Approved items" })).toBeInTheDocument();
    expect(capturedGrids[0]).toHaveLength(4);
    expect(screen.getByRole("link", { name: "View all Merchandise" })).toHaveAttribute(
      "href",
      "/assets?category=merchandise",
    );
  });

  it("keeps the sub-brand roster and caps both download grids", () => {
    stubCategory([
      ...Array.from({ length: 5 }, (_, index) =>
        asset(`talk-${index}`, "logos", {
          product: "k-talk",
          tags: ["dark"],
        }),
      ),
      ...Array.from({ length: 5 }, (_, index) =>
        asset(`kv-${index}`, "brand-imagery", { tags: ["keyvisual"] }),
      ),
    ]);
    render(<SubBrandsView />);

    expect(screen.getByRole("heading", { name: "Product family" })).toBeInTheDocument();
    expect(capturedGrids).toHaveLength(2);
    expect(capturedGrids[0]).toHaveLength(4);
    expect(capturedGrids[1]).toHaveLength(4);
    expect(screen.getByRole("link", { name: "View all Logos" })).toHaveAttribute(
      "href",
      "/assets?category=logos",
    );
    expect(screen.getByRole("link", { name: "View all Brand imagery" })).toHaveAttribute(
      "href",
      "/assets?category=brand-imagery",
    );
  });
});
