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
        clearspaceFullLabel: "Full lockup",
        clearspaceIconLabel: "Icon",
        minimumSize: "Min size 24px.",
        rulesTitle: "Do and don't",
        primaryTitle: "Primary logos",
        "primaryTreatments.whiteOnBlack.label": "White on black",
        "primaryTreatments.whiteOnBlack.description": "White on dark.",
        "primaryTreatments.greyOnWhite.label": "Grey on white",
        "primaryTreatments.greyOnWhite.description": "Grey on light.",
        allFilesDescription: "Every file.",
        "rules.dos.clearspace": "Respect clearspace.",
        "rules.dos.approvedFiles": "Use approved files.",
        "rules.dos.contrast": "Use contrast.",
        "rules.dos.scaleProportionally": "Scale proportionally.",
        "rules.donts.stretch": "Don't stretch.",
        "rules.donts.rotate": "Don't rotate.",
        "rules.donts.containers": "Don't add containers.",
        "rules.donts.flipHorizontal": "Don't flip horizontally.",
        "rules.donts.flipVertical": "Don't flip vertically.",
        "rules.donts.shear": "Don't shear.",
        backgroundsTitle: "Logo backgrounds",
        backgroundsDescription: "Pick contrast.",
        "backgrounds.photoGradient.label": "Reversed on photography",
        "backgrounds.photoGradient.description": "White on a gradient.",
        "backgrounds.neonField.label": "Reversed on brand imagery",
        "backgrounds.neonField.description": "White on neon.",
        "backgrounds.solidWhite.label": "Primary on white",
        "backgrounds.solidWhite.description": "Blue on white.",
        "backgrounds.greyOnWhite.label": "Grey on white",
        "backgrounds.greyOnWhite.description": "Charcoal on white.",
        cobrandingTitle: "Co-branding",
        cobrandingDescription: "Equal weight.",
        "cobranding.divider": "Use a divider.",
        "cobranding.spacing": "Keep 0.5× gaps.",
        "cobranding.parity": "Match wordmark height.",
        cobrandingSpacingLabel: "Spacing",
        cobrandingFinalLabel: "Partner lockup",
        cobrandingPartnerLabel: "Partner",
        misuseTitle: "Logo misuse",
        misuseDescription: "Never alter the logo.",
        "misuse.stretch": "Do not stretch the logo",
        "misuse.rotate": "Do not rotate the logo",
        "misuse.containers": "Do not add containers",
        "misuse.flipHorizontal": "Do not flip horizontally",
        "misuse.flipVertical": "Do not flip vertically",
        "misuse.shear": "Do not shear the logo",
      },
      assets: {
        viewAll: "View all {category}",
        downloadPackage: "Download {category} package",
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

jest.mock("@/ui/brand-assets/components/asset-grid", () => ({
  AssetGrid: ({ assets }: { assets: BrandAsset[] }) => (
    <div data-testid="asset-grid">{assets.length}</div>
  ),
}));

jest.mock("@/ui/shared/components/k-brand-page-header", () => ({
  KBrandPageHeader: ({
    title,
    subtitle,
    actions,
  }: {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
  }) => (
    <header>
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
      {actions}
    </header>
  ),
}));

jest.mock("@k-lab/components", () => {
  const ReactLib = require("react") as typeof import("react");
  return {
    cn: (...parts: Array<string | false | undefined>) =>
      parts.filter(Boolean).join(" "),
    KLabLogo: require("@/tests/helpers/library-logo-stubs").StubKLabLogo,
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
    mockUseCategoryAssets.mockReturnValue({
      assets: fixtureAssets,
      loading: false,
      loadError: null,
      refresh: jest.fn(),
    });
  });

  it("renders library full and icon logos in the clearspace section", () => {
    render(<LogoGuidelinesView />);

    const clearspaceHeading = screen.getByRole("heading", {
      name: "Clearspace & minimum size",
    });
    const clearspaceSection = clearspaceHeading.closest("div")!;
    const images = within(clearspaceSection).getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute(
      "src",
      "/logos/k-lab/klab_full_logo_blue.svg",
    );
    expect(images[1]).toHaveAttribute(
      "src",
      "/logos/k-lab/klab_logomark_dark.svg",
    );
    expect(within(clearspaceSection).queryByText("K Lab")).not.toBeInTheDocument();
  });

  it("offers a logo package and links View all to the library", () => {
    render(<LogoGuidelinesView />);

    expect(screen.queryByTestId("asset-grid")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download Logos package" })).toBeEnabled();
    expect(screen.getByRole("link", { name: "View all Logos" })).toHaveAttribute(
      "href",
      "/assets?category=logos",
    );
  });

  it("recreates background, co-branding, and misuse examples from library lockups", () => {
    render(<LogoGuidelinesView />);

    expect(
      screen.getByRole("heading", { name: "Logo backgrounds" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Reversed on photography" }),
    ).toHaveAttribute("src", "/logos/k-lab/klab_full_logo_light.svg");
    expect(
      screen.getByRole("img", { name: "Primary on white" }),
    ).toHaveAttribute("src", "/logos/k-lab/klab_full_logo_blue.svg");

    expect(screen.getByRole("img", { name: "Spacing" })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Partner lockup" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Logo misuse" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Do not stretch the logo")).toBeInTheDocument();
    expect(screen.getByText("Do not add containers")).toBeInTheDocument();
    expect(screen.getByText("Do not shear the logo")).toBeInTheDocument();
  });

  it("renders library lockups even when the catalog has no preview URLs", () => {
    mockUseCategoryAssets.mockReturnValue({
      assets: [],
      loading: false,
      loadError: null,
      refresh: jest.fn(),
    });

    const { container } = render(<LogoGuidelinesView />);

    expect(
      container.querySelector('img[alt="White on black"]'),
    ).toHaveAttribute("src", "/logos/k-lab/klab_full_logo_light.svg");
    expect(
      container.querySelector(
        'img[alt="Grey on white"][class*="sm:h-14"]',
      ),
    ).toHaveAttribute("src", "/logos/k-lab/klab_full_logo_dark.svg");
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
  });
});
