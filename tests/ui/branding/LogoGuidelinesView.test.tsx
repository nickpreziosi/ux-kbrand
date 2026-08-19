import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

const mockUseCategoryAssets = jest.fn();

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.src} alt={props.alt} className={props.className} />
  ),
}));

jest.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    const catalog: Record<string, Record<string, string>> = {
      "branding.logo": {
        title: "Logo",
        subtitle: "Lockups and usage.",
        loadError: "Failed",
        clearspaceTitle: "Clearspace & minimum size",
        clearspaceDescription: "Keep clearspace.",
        minimumSize: "Min size 24px.",
        rulesTitle: "Do and don't",
        allFilesTitle: "All logo files",
        allFilesDescription: "Every file.",
        "rules.dos.clearspace": "Respect clearspace.",
        "rules.dos.approvedFiles": "Use approved files.",
        "rules.dos.contrast": "Use contrast.",
        "rules.dos.scaleProportionally": "Scale proportionally.",
        "rules.donts.recolor": "Don't recolor.",
        "rules.donts.distort": "Don't distort.",
        "rules.donts.effects": "Don't add effects.",
        "rules.donts.rebuild": "Don't rebuild.",
      },
      assets: {
        viewAll: "View all {category}",
      },
      "brand.categories": {
        "logos.title": "Logos",
      },
    };
    const table = catalog[namespace ?? ""] ?? {};
    const t = (key: string, values?: Record<string, string | number>) => {
      const message = table[key] ?? key;
      if (!values) return message;
      return message.replace(/\{(\w+)\}/g, (_match, name: string) =>
        String(values[name] ?? ""),
      );
    };
    return t;
  },
}));

jest.mock("@/ui/brand-assets/hooks/use-category-assets", () => ({
  useCategoryAssets: (...args: unknown[]) => mockUseCategoryAssets(...args),
}));

const capturedGrids: BrandAsset[][] = [];

jest.mock("@/ui/brand-assets/components/asset-grid", () => ({
  AssetGrid: ({ assets }: { assets: BrandAsset[] }) => {
    capturedGrids.push(assets);
    return <div data-testid="asset-grid">{assets.length}</div>;
  },
}));

jest.mock("@/ui/shared/components/k-brand-page-header", () => ({
  KBrandPageHeader: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <header>
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </header>
  ),
}));

jest.mock("@k-lab/components", () => {
  const ReactLib = require("react") as typeof import("react");
  return {
    cn: (...parts: Array<string | false | undefined>) =>
      parts.filter(Boolean).join(" "),
    Button: ({
      children,
      href,
      disabled,
      ...rest
    }: React.PropsWithChildren<{
      href?: string;
      disabled?: boolean;
      variant?: string;
      size?: string;
      icon?: React.ReactNode;
      target?: string;
      rel?: string;
      className?: string;
    }>) => {
      if (href && !disabled) {
        return (
          <a href={href} {...rest}>
            {children}
          </a>
        );
      }
      return (
        <button type="button" disabled={disabled} {...rest}>
          {children}
        </button>
      );
    },
    Card: ({
      children,
      className,
    }: React.PropsWithChildren<{ className?: string }>) => (
      <div className={className}>{children}</div>
    ),
    CardContent: ({
      children,
      className,
    }: React.PropsWithChildren<{ className?: string }>) => (
      <div className={className}>{children}</div>
    ),
    Skeleton: ({ className }: { className?: string }) => (
      <div data-testid="skeleton" className={className} />
    ),
  };
});

import { LogoGuidelinesView } from "@/ui/branding/views/LogoGuidelinesView";

function asset(partial: {
  id: string;
  fileName: string;
  tags: string[];
  title?: string;
}): BrandAsset {
  return {
    id: partial.id,
    title: partial.title ?? partial.id,
    description: "",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: partial.id,
        fileName: partial.fileName,
        contentType: "image/png",
        sizeBytes: 1,
        storagePath: `assets/logos/${partial.fileName}`,
        downloadUrl: `/brand-files/logos/${partial.fileName}`,
      },
    ],
    previewUrl: `/brand-files/logos/${partial.fileName}`,
    tags: partial.tags,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
  };
}

const fixtureAssets: BrandAsset[] = [
  asset({
    id: "ast-primary-png",
    fileName: "k-lab-logo-blue.png",
    tags: ["primary", "logo", "png", "blue"],
    title: "Primary PNG",
  }),
  asset({
    id: "ast-primary-svg",
    fileName: "k-lab-logo-blue.svg",
    tags: ["primary", "logo", "svg", "blue"],
    title: "Primary SVG",
  }),
  asset({
    id: "ast-primary-ai",
    fileName: "k-lab-logo-blue.ai",
    tags: ["primary", "logo", "ai", "blue"],
    title: "Primary AI",
  }),
  asset({
    id: "ast-mark-png",
    fileName: "k-lab-logomark.png",
    tags: ["mark", "icon", "logomark", "png"],
    title: "Mark PNG",
  }),
  asset({
    id: "ast-dark",
    fileName: "k-lab-logo-dark.png",
    tags: ["dark", "logo"],
    title: "Dark",
  }),
  asset({
    id: "ast-reversed",
    fileName: "k-lab-logo-white.png",
    tags: ["reversed", "logo"],
    title: "Reversed",
  }),
  asset({
    id: "ast-extra-1",
    fileName: "k-lab-favicon.png",
    tags: ["favicon"],
    title: "Favicon",
  }),
  asset({
    id: "ast-extra-2",
    fileName: "k-lab-app-icon.png",
    tags: ["app-icon"],
    title: "App icon",
  }),
];

describe("LogoGuidelinesView", () => {
  beforeEach(() => {
    capturedGrids.length = 0;
    mockUseCategoryAssets.mockReturnValue({
      assets: fixtureAssets,
      loading: false,
      loadError: null,
      refresh: jest.fn(),
    });
  });

  it("renders real full and icon logos in the clearspace section", () => {
    render(<LogoGuidelinesView />);

    const clearspaceHeading = screen.getByRole("heading", {
      name: "Clearspace & minimum size",
    });
    const clearspaceSection = clearspaceHeading.closest("div")!;
    const images = within(clearspaceSection).getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute(
      "src",
      "/brand-files/logos/k-lab-logo-blue.png",
    );
    expect(images[1]).toHaveAttribute(
      "src",
      "/brand-files/logos/k-lab-logomark.png",
    );
    expect(within(clearspaceSection).queryByText("K Lab")).not.toBeInTheDocument();
  });

  it("caps the downloadable section and links View all to the library", () => {
    render(<LogoGuidelinesView />);

    expect(capturedGrids).toHaveLength(1);
    expect(capturedGrids[0]).toHaveLength(4);
    expect(capturedGrids[0].map((row) => row.id)).toEqual([
      "ast-primary-png",
      "ast-dark",
      "ast-reversed",
      "ast-mark-png",
    ]);
    expect(screen.getByRole("link", { name: "View all Logos" })).toHaveAttribute(
      "href",
      "/assets?category=logos",
    );
  });
});
