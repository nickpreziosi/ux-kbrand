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
  usePathname: () => "/sales",
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

jest.mock("@/ui/brand-assets/lib/download-asset-bundle", () => ({
  downloadAssetBundle: (...args: unknown[]) => mockDownloadBrandBundle(...args),
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

import { SalesResourcesView } from "@/ui/brand-assets/views/SalesResourcesView";

function asset(partial: {
  id: string;
  title: string;
  category?: BrandAsset["category"];
}): BrandAsset {
  return {
    id: partial.id,
    title: partial.title,
    description: "",
    resourceType: "sales",
    category: partial.category ?? "pitch-decks",
    product: "k-lab",
    visibility: "employee",
    status: "active",
    files: [
      {
        id: partial.id,
        fileName: `${partial.id}.pdf`,
        contentType: "application/pdf",
        sizeBytes: 10,
        storagePath: `assets/${partial.id}.pdf`,
        downloadUrl: `/api/sales-files/${partial.id}`,
      },
    ],
    tags: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-002",
  };
}

const deck = asset({ id: "ast-100", title: "K Lab Platform Pitch 2026" });
const onePager = asset({
  id: "ast-110",
  title: "Product One-Pagers Pack",
  category: "sales-materials",
});

function renderSales() {
  mockUseLibraryAssets.mockReturnValue({
    assets: [deck, onePager],
    loading: false,
    loadError: null,
  });
  return render(<SalesResourcesView />);
}

describe("SalesResourcesView", () => {
  beforeEach(() => {
    searchString = "";
    mockReplace.mockReset();
    mockUseLibraryAssets.mockReset();
    mockDownloadBrandBundle.mockReset();
    mockDownloadBrandBundle.mockResolvedValue(undefined);
  });

  it("asks the catalog for sales assets only, using the URL facets", () => {
    searchString = "category=pitch-decks&product=k-rails&format=pdf&q=invoice";
    renderSales();

    expect(mockUseLibraryAssets).toHaveBeenCalledWith({
      search: "invoice",
      category: "pitch-decks",
      product: "k-rails",
      format: "pdf",
      resourceType: "sales",
    });
    expect(screen.getByRole("heading", { name: "Sales resources" })).toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  it("offers sales categories only, not brand ones", () => {
    renderSales();

    expect(screen.getByRole("option", { name: "Pitch decks" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Sales materials" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Logos" })).not.toBeInTheDocument();
  });

  it("writes filter changes back onto /sales without a resourceType toggle", async () => {
    const user = userEvent.setup();
    renderSales();

    await user.selectOptions(screen.getByLabelText("Category"), "sales-materials");

    expect(mockReplace).toHaveBeenCalledWith("/sales?category=sales-materials");
  });

  it("selects every sales asset matching the current filter", async () => {
    const user = userEvent.setup();
    renderSales();

    await user.click(screen.getByRole("button", { name: "Select all" }));

    expect(screen.getByLabelText("K Lab Platform Pitch 2026")).toBeChecked();
    expect(screen.getByLabelText("Product One-Pagers Pack")).toBeChecked();
    expect(screen.getByText("2 selected")).toBeInTheDocument();
  });

  it("downloads the selected sales files", async () => {
    const user = userEvent.setup();
    renderSales();

    await user.click(screen.getByLabelText("K Lab Platform Pitch 2026"));
    await user.click(
      screen.getByRole("button", { name: "Download selected (all formats)" }),
    );

    expect(mockDownloadBrandBundle).toHaveBeenCalledWith({
      assetIds: ["ast-100"],
    });
  });
});
