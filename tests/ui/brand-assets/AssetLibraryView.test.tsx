import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

const mockUseLibraryAssets = jest.fn();
const mockReplace = jest.fn();
const mockDownloadBrandBundle = jest.fn();

let searchString = "";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(searchString),
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/assets",
}));

jest.mock("next-intl", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const messages = require("@/public/locales/en.json");
  const format = (message: string, values: Record<string, unknown>) =>
    message
      .replace(
        /\{(\w+), plural, one \{([^}]*)\} other \{([^}]*)\}\}/g,
        (_match, name: string, one: string, other: string) => {
          const count = Number(values[name]);
          return (count === 1 ? one : other).replace(/#/g, String(count));
        },
      )
      .replace(/\{(\w+)\}/g, (_match, name: string) => String(values[name]));

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

jest.mock("@/ui/brand-assets/hooks/use-library-assets", () => ({
  useLibraryAssets: (...args: unknown[]) => mockUseLibraryAssets(...args),
}));

jest.mock("@/ui/brand-assets/lib/download-brand-bundle", () => ({
  downloadBrandBundle: (...args: unknown[]) => mockDownloadBrandBundle(...args),
}));

jest.mock("@/ui/shared/components/k-brand-page-header", () => ({
  KBrandPageHeader: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <header>
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </header>
  ),
}));

jest.mock("@/ui/brand-assets/components/asset-grid", () => ({
  AssetGrid: ({
    assets,
    selectable,
    selectedIds,
    onSelectedChange,
  }: {
    assets: BrandAsset[];
    selectable?: boolean;
    selectedIds?: ReadonlySet<string>;
    onSelectedChange?: (id: string, selected: boolean) => void;
  }) => (
    <ul>
      {assets.map((asset) => (
        <li key={asset.id}>
          <label>
            <input
              type="checkbox"
              aria-label={asset.title}
              disabled={!selectable}
              checked={selectedIds?.has(asset.id) ?? false}
              onChange={(event) => onSelectedChange?.(asset.id, event.target.checked)}
            />
            {asset.title}
          </label>
        </li>
      ))}
    </ul>
  ),
}));

jest.mock("@k-lab/components", () => ({
  Button: ({
    children,
    disabled,
    onClick,
    "aria-label": ariaLabel,
  }: React.PropsWithChildren<{
    disabled?: boolean;
    onClick?: () => void;
    "aria-label"?: string;
  }>) => (
    <button type="button" disabled={disabled} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  ),
  FloatingLabelInput: ({
    label,
    value,
    onChange,
    selectOptions,
    type,
  }: {
    label: string;
    value: string;
    onChange: (event: { target: { value: string } }) => void;
    selectOptions?: { value: string; label: string }[];
    type?: string;
  }) => {
    const id = `field-${label}`;
    if (selectOptions) {
      return (
        <>
          <label htmlFor={id}>{label}</label>
          <select id={id} value={value} onChange={onChange}>
            {selectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </>
      );
    }
    return (
      <>
        <label htmlFor={id}>{label}</label>
        <input id={id} type={type} value={value} onChange={onChange} />
      </>
    );
  },
}));

import { AssetLibraryView } from "@/ui/brand-assets/views/AssetLibraryView";

function asset(partial: {
  id: string;
  title: string;
  category?: BrandAsset["category"];
}): BrandAsset {
  return {
    id: partial.id,
    title: partial.title,
    description: "",
    resourceType: "brand",
    category: partial.category ?? "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: `${partial.id}-png`,
        fileName: `${partial.id}.png`,
        contentType: "image/png",
        sizeBytes: 10,
        storagePath: `assets/${partial.id}.png`,
        downloadUrl: `/brand-files/${partial.id}.png`,
      },
      {
        id: `${partial.id}-svg`,
        fileName: `${partial.id}.svg`,
        contentType: "image/svg+xml",
        sizeBytes: 4,
        storagePath: `assets/${partial.id}.svg`,
        downloadUrl: `/brand-files/${partial.id}.svg`,
      },
    ],
    tags: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
  };
}

const logo = asset({ id: "k-lab-logo-blue", title: "K Lab logo — primary (blue)" });
const talk = asset({ id: "k-talk-logo", title: "K Talk — product logo" });

function renderLibrary() {
  mockUseLibraryAssets.mockReturnValue({
    assets: [logo, talk],
    loading: false,
    loadError: null,
  });
  return render(<AssetLibraryView />);
}

describe("AssetLibraryView", () => {
  beforeEach(() => {
    searchString = "";
    mockReplace.mockReset();
    mockUseLibraryAssets.mockReset();
    mockDownloadBrandBundle.mockReset();
    mockDownloadBrandBundle.mockResolvedValue(undefined);
  });

  it("asks the catalog for brand assets only, using the URL facets", () => {
    searchString = "category=logos&product=k-talk&format=svg&q=lockup";
    renderLibrary();

    expect(mockUseLibraryAssets).toHaveBeenCalledWith({
      search: "lockup",
      category: "logos",
      product: "k-talk",
      format: "svg",
      resourceType: "brand",
    });
    expect(screen.getByRole("heading", { name: "Asset library" })).toBeInTheDocument();
  });

  it("writes filter changes back onto the URL without a resourceType toggle", async () => {
    const user = userEvent.setup();
    renderLibrary();

    await user.selectOptions(screen.getByLabelText("Category"), "photography");

    expect(mockReplace).toHaveBeenCalledWith("/assets?category=photography");
  });

  it("selects every asset matching the current filter", async () => {
    const user = userEvent.setup();
    renderLibrary();

    await user.click(screen.getByRole("button", { name: "Select all" }));

    expect(screen.getByLabelText("K Lab logo — primary (blue)")).toBeChecked();
    expect(screen.getByLabelText("K Talk — product logo")).toBeChecked();
    expect(screen.getByText("2 selected")).toBeInTheDocument();
  });

  it("downloads every format when no format filter is set", async () => {
    const user = userEvent.setup();
    renderLibrary();

    expect(
      screen.getByRole("button", { name: "Download selected (all formats)" }),
    ).toBeDisabled();

    await user.click(screen.getByLabelText("K Lab logo — primary (blue)"));
    await user.click(
      screen.getByRole("button", { name: "Download selected (all formats)" }),
    );

    expect(mockDownloadBrandBundle).toHaveBeenCalledWith({
      assetIds: ["k-lab-logo-blue"],
    });
    expect(
      screen.getByText(/every file on each selected asset is included/i),
    ).toBeInTheDocument();
  });

  it("downloads only the filtered format when one is set", async () => {
    searchString = "format=svg";
    const user = userEvent.setup();
    renderLibrary();

    await user.click(screen.getByLabelText("K Talk — product logo"));
    await user.click(screen.getByRole("button", { name: "Download selected (SVG)" }));

    expect(mockDownloadBrandBundle).toHaveBeenCalledWith({
      assetIds: ["k-talk-logo"],
      format: "svg",
    });
  });
});
