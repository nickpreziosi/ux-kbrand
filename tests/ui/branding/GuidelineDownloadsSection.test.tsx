import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

const mockDownloadAssetBundle = jest.fn();

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

jest.mock("@/ui/brand-assets/lib/download-asset-bundle", () => ({
  downloadAssetBundle: (...args: unknown[]) => mockDownloadAssetBundle(...args),
}));

jest.mock("@k-lab/components", () => ({
  Button: ({
    children,
    href,
    onClick,
    disabled,
    type,
  }: React.PropsWithChildren<{
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit";
  }>) =>
    href ? (
      <a href={href}>{children}</a>
    ) : (
      <button type={type ?? "button"} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    ),
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
    mockDownloadAssetBundle.mockReset();
    mockDownloadAssetBundle.mockResolvedValue(undefined);
  });

  it("offers a category package and View all into the library, with no featured grid", async () => {
    const user = userEvent.setup();
    render(
      <GuidelineDownloadsSection
        category="brand-imagery"
        assets={[asset("a"), asset("b")]}
        loading={false}
      />,
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByTestId("asset-grid")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all Brand imagery" })).toHaveAttribute(
      "href",
      "/assets?category=brand-imagery",
    );

    const viewAll = screen.getByRole("link", { name: "View all Brand imagery" });
    const download = screen.getByRole("button", { name: "Download Brand imagery package" });
    expect(viewAll.compareDocumentPosition(download) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    await user.click(
      screen.getByRole("button", { name: "Download Brand imagery package" }),
    );
    expect(mockDownloadAssetBundle).toHaveBeenCalledWith({
      assetIds: ["a", "b"],
      filename: "brand-imagery.zip",
    });
  });

  it("disables the package button when there are no assets", () => {
    render(
      <GuidelineDownloadsSection
        category="corporate-assets"
        assets={[]}
        loading={false}
      />,
    );

    expect(screen.queryByTestId("asset-grid")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Download Corporate assets package" }),
    ).toBeDisabled();
    expect(screen.getByRole("link", { name: "View all Corporate assets" })).toHaveAttribute(
      "href",
      "/assets?category=corporate-assets",
    );
  });

  it("disables the package button while assets are loading", () => {
    render(
      <GuidelineDownloadsSection
        category="brand-imagery"
        assets={[asset("a")]}
        loading
      />,
    );

    expect(
      screen.getByRole("button", { name: "Download Brand imagery package" }),
    ).toBeDisabled();
  });
});
