import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { TYPOGRAPHY_TOKEN_FILE } from "@/ui/branding/content/typeface";

const mockUseCategoryAssets = jest.fn();
const mockDownloadAssetBundle = jest.fn();

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

jest.mock("@/ui/brand-assets/lib/download-asset-bundle", () => ({
  downloadAssetBundle: (...args: unknown[]) => mockDownloadAssetBundle(...args),
}));

jest.mock("@/ui/brand-assets/components/asset-grid", () => ({
  AssetGrid: ({ assets }: { assets: BrandAsset[] }) => (
    <div data-testid="asset-grid">{assets.length}</div>
  ),
}));

jest.mock("@/ui/shared/components/k-brand-page-header", () => ({
  KBrandPageHeader: ({
    title,
    actions,
  }: {
    title: string;
    actions?: React.ReactNode;
  }) => (
    <header>
      <h1>{title}</h1>
      {actions}
    </header>
  ),
}));

jest.mock("@k-lab/components", () => ({
  cn: (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" "),
  formatFileSize: (bytes: number) => `${bytes} B`,
  Badge: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  Button: ({
    children,
    href,
    onClick,
    disabled,
  }: React.PropsWithChildren<{
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
  }>) =>
    href ? (
      <a href={href}>{children}</a>
    ) : (
      <button type="button" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    ),
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
import { BrandGuidelinesDocView } from "@/ui/branding/views/BrandGuidelinesDocView";

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

describe("guideline pages category packages", () => {
  beforeEach(() => {
    mockUseCategoryAssets.mockReset();
    mockDownloadAssetBundle.mockReset();
    mockDownloadAssetBundle.mockResolvedValue(undefined);
  });

  it("keeps imagery usage rules and zips the full category", async () => {
    const user = userEvent.setup();
    stubCategory(many("brand-imagery", 6));
    render(<ImageryView />);

    expect(screen.getByRole("heading", { name: "Do" })).toBeInTheDocument();
    expect(screen.queryByTestId("asset-grid")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all Brand imagery" })).toHaveAttribute(
      "href",
      "/assets?category=brand-imagery",
    );

    await user.click(screen.getByRole("button", { name: "Download Brand imagery package" }));
    expect(mockDownloadAssetBundle).toHaveBeenCalledWith({
      assetIds: many("brand-imagery", 6).map((row) => row.id),
      filename: "brand-imagery.zip",
    });
  });

  it("keeps the typeface specimen and zips fonts without the token file", async () => {
    const user = userEvent.setup();
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
    expect(screen.queryByTestId("asset-grid")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all Fonts" })).toHaveAttribute(
      "href",
      "/assets?category=fonts",
    );

    await user.click(screen.getByRole("button", { name: "Download Fonts package" }));
    expect(mockDownloadAssetBundle).toHaveBeenCalledWith({
      assetIds: many("fonts", 5).map((row) => row.id),
      filename: "fonts.zip",
    });
  });

  it("keeps photography principles without a category package", () => {
    render(<PhotographyView />);

    expect(screen.getByRole("heading", { name: "Principles" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Download Photography package" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "View all Photography" }),
    ).not.toBeInTheDocument();
  });

  it("keeps corporate stationery mockups and zips templates", async () => {
    const user = userEvent.setup();
    stubCategory(many("corporate-assets", 6));
    render(<CorporateAssetsView />);

    expect(screen.getByRole("heading", { name: "Stationery system" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all Corporate assets" })).toHaveAttribute(
      "href",
      "/assets?category=corporate-assets",
    );

    await user.click(
      screen.getByRole("button", { name: "Download Corporate assets package" }),
    );
    expect(mockDownloadAssetBundle).toHaveBeenCalledWith({
      assetIds: many("corporate-assets", 6).map((row) => row.id),
      filename: "corporate-assets.zip",
    });
  });

  it("keeps icon style samples and zips icons", async () => {
    const user = userEvent.setup();
    stubCategory(many("iconography", 6));
    render(<IconographyView />);

    expect(screen.getByRole("heading", { name: "Icon style" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all Iconography" })).toHaveAttribute(
      "href",
      "/assets?category=iconography",
    );

    await user.click(screen.getByRole("button", { name: "Download Iconography package" }));
    expect(mockDownloadAssetBundle).toHaveBeenCalledWith({
      assetIds: many("iconography", 6).map((row) => row.id),
      filename: "iconography.zip",
    });
  });

  it("keeps social avatar mockups and zips social files", async () => {
    const user = userEvent.setup();
    stubCategory(many("social-media", 6));
    render(<SocialMediaView />);

    expect(screen.getByRole("heading", { name: "Profile avatars" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all Social media" })).toHaveAttribute(
      "href",
      "/assets?category=social-media",
    );

    await user.click(screen.getByRole("button", { name: "Download Social media package" }));
    expect(mockDownloadAssetBundle).toHaveBeenCalledWith({
      assetIds: many("social-media", 6).map((row) => row.id),
      filename: "social-media.zip",
    });
  });

  it("keeps merchandise treatments without a category package", () => {
    render(<MerchandiseView />);

    expect(screen.getByRole("heading", { name: "Approved items" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Download Merchandise package" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "View all Merchandise" }),
    ).not.toBeInTheDocument();
  });

  it("keeps the sub-brand roster without category packages", () => {
    stubCategory([
      ...Array.from({ length: 5 }, (_, index) =>
        asset(`talk-${index}`, "logos", {
          product: "k-talk",
          tags: ["dark"],
        }),
      ),
    ]);
    render(<SubBrandsView />);

    expect(screen.getByRole("heading", { name: "Product family" })).toBeInTheDocument();
    expect(screen.queryByTestId("asset-grid")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Download Logos package" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Download Brand imagery package" }),
    ).not.toBeInTheDocument();
  });

  it("puts brand-book View and Download in the page header", () => {
    stubCategory([
      asset("ast-001", "brand-guidelines", {
        title: "K Lab Brand Guidelines (WIP)",
        tags: ["brand-book"],
        files: [
          {
            id: "ast-001",
            fileName: "k-lab-brand-guidelines-wip.pdf",
            contentType: "application/pdf",
            sizeBytes: 1783,
            storagePath: "assets/docs/k-lab-brand-guidelines-wip.pdf",
            downloadUrl: "/brand-files/docs/k-lab-brand-guidelines-wip.pdf",
          },
        ],
      }),
    ]);
    render(<BrandGuidelinesDocView />);

    expect(screen.getByRole("link", { name: "View" })).toHaveAttribute(
      "href",
      "/brand-files/docs/k-lab-brand-guidelines-wip.pdf",
    );
    expect(screen.getByRole("link", { name: "Download" })).toHaveAttribute(
      "href",
      "/api/brand-download/ast-001",
    );
  });
});
