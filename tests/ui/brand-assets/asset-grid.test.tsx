import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: {
    src: string;
    alt: string;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.src} alt={props.alt} className={props.className} />
  ),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => {
    const messages: Record<string, string> = {
      download: "Download",
      downloadAll: "Download all",
      downloadAllOption: "All",
      downloadFormat: "Download {format}",
      "fileCount.one": "{count} file",
      "fileCount.other": "{count} files",
      totalSize: "{size} total",
      "empty.title": "Nothing here yet",
      "empty.description": "Empty",
    };
    const t = (key: string, values?: Record<string, string | number>) => {
      const message = messages[key] ?? key;
      if (!values) return message;
      return message.replace(/\{(\w+)\}/g, (_match, name: string) =>
        String(values[name] ?? ""),
      );
    };
    return Object.assign(t, {
      has: (key: string) => Object.prototype.hasOwnProperty.call(messages, key),
    });
  },
}));

jest.mock("@/ui/user-management/hooks/use-portal-role", () => ({
  usePortalRole: () => ({ viewerRole: "public" }),
}));

jest.mock("@k-lab/components", () => {
  return {
    cn: (...parts: Array<string | false | undefined>) =>
      parts.filter(Boolean).join(" "),
    formatFileSize: (bytes: number) => `${bytes} B`,
    // Only the props the DOM needs; icon/variant/size stay off the element.
    Button: ({
      children,
      href,
      className,
      "aria-label": ariaLabel,
    }: React.PropsWithChildren<{
      href?: string;
      className?: string;
      "aria-label"?: string;
    }>) => {
      if (href) {
        return (
          <a href={href} className={className} aria-label={ariaLabel}>
            {children}
          </a>
        );
      }
      return (
        <button type="button" className={className} aria-label={ariaLabel}>
          {children}
        </button>
      );
    },
    DropdownMenu: ({ children }: React.PropsWithChildren) => (
      <div>{children}</div>
    ),
    DropdownMenuTrigger: ({
      children,
      asChild,
    }: React.PropsWithChildren<{ asChild?: boolean }>) =>
      asChild ? <>{children}</> : <button type="button">{children}</button>,
    DropdownMenuContent: ({ children }: React.PropsWithChildren) => (
      <div>{children}</div>
    ),
    DropdownMenuItem: ({
      children,
      asChild,
    }: React.PropsWithChildren<{ asChild?: boolean }>) =>
      asChild ? <>{children}</> : <div>{children}</div>,
    DropdownMenuSeparator: () => <hr />,
    Badge: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
    Card: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    CardContent: ({ children }: React.PropsWithChildren) => (
      <div>{children}</div>
    ),
    CardDescription: ({ children }: React.PropsWithChildren) => (
      <p>{children}</p>
    ),
    CardFooter: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    CardTitle: ({ children }: React.PropsWithChildren) => <h3>{children}</h3>,
    Dialog: ({
      open,
      children,
    }: React.PropsWithChildren<{
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
    }>) => (open ? <div role="dialog">{children}</div> : null),
    DialogContent: ({ children }: React.PropsWithChildren) => (
      <div>{children}</div>
    ),
    DialogTitle: ({
      children,
      className,
    }: React.PropsWithChildren<{ className?: string }>) => (
      <h2 className={className}>{children}</h2>
    ),
    Empty: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    EmptyDescription: ({ children }: React.PropsWithChildren) => (
      <p>{children}</p>
    ),
    EmptyIcon: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    EmptyTitle: ({ children }: React.PropsWithChildren) => <h2>{children}</h2>,
    Checkbox: ({
      checked,
      onCheckedChange,
      "aria-label": ariaLabel,
    }: {
      checked?: boolean;
      onCheckedChange?: (value: boolean) => void;
      "aria-label"?: string;
    }) => (
      <input
        type="checkbox"
        checked={Boolean(checked)}
        aria-label={ariaLabel}
        onChange={(event) => onCheckedChange?.(event.target.checked)}
      />
    ),
    Skeleton: ({ className }: { className?: string }) => (
      <div data-testid="skeleton" className={className} />
    ),
  };
});

import { AssetGrid } from "@/ui/brand-assets/components/asset-grid";

function asset(partial: {
  id: string;
  title: string;
  previewUrl?: string;
  description?: string;
  fileName?: string;
  sizeBytes?: number;
  category?: BrandAsset["category"];
  files?: BrandAsset["files"];
}): BrandAsset {
  const fileName = partial.fileName ?? `${partial.id}.webp`;
  return {
    id: partial.id,
    title: partial.title,
    description: partial.description ?? "Hero background.",
    resourceType: "brand",
    category: partial.category ?? "brand-imagery",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: partial.files ?? [
      {
        id: partial.id,
        fileName,
        contentType: "image/webp",
        sizeBytes: partial.sizeBytes ?? 1024,
        storagePath: `assets/backgrounds/${fileName}`,
        downloadUrl: `/brand-files/backgrounds/${fileName}`,
      },
    ],
    previewUrl: partial.previewUrl,
    tags: ["background"],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
  };
}

const chevron = asset({
  id: "ast-040",
  title: "Chevron neon",
  previewUrl: "/brand-files/backgrounds/k-lab-bg-001.webp",
});

const logoAsset = asset({
  id: "k-lab-logo-blue",
  title: "K Lab logo — primary (blue)",
  description: "The default lockup.",
  category: "logos",
  previewUrl: "/brand-files/logos/k-lab-logo-blue.png",
  files: [
    {
      id: "ast-010",
      fileName: "k-lab-logo-blue.png",
      contentType: "image/png",
      sizeBytes: 1000,
      storagePath: "assets/logos/k-lab-logo-blue.png",
      downloadUrl: "/brand-files/logos/k-lab-logo-blue.png",
    },
    {
      id: "ast-010-svg",
      fileName: "k-lab-logo-blue.svg",
      contentType: "image/svg+xml",
      sizeBytes: 300,
      storagePath: "assets/logos/k-lab-logo-blue.svg",
      downloadUrl: "/brand-files/logos/k-lab-logo-blue.svg",
    },
    {
      id: "ast-010-ai",
      fileName: "k-lab-logo-blue.ai",
      contentType: "application/postscript",
      sizeBytes: 20,
      storagePath: "assets/logos/k-lab-logo-blue.ai",
      downloadUrl: "/brand-files/logos/k-lab-logo-blue.ai",
    },
  ],
});

describe("AssetGrid download menu", () => {
  it("renders one card for a group", () => {
    render(<AssetGrid assets={[logoAsset]} />);

    expect(
      screen.getAllByRole("heading", { name: "K Lab logo — primary (blue)" }),
    ).toHaveLength(1);
    expect(screen.queryByText(/, PNG$/)).not.toBeInTheDocument();
    expect(screen.getByText("3 files")).toBeInTheDocument();
    expect(screen.getByText("The default lockup.")).toBeInTheDocument();
  });

  it("puts every format and an All option in one Download menu", () => {
    render(<AssetGrid assets={[logoAsset]} />);

    expect(screen.getByRole("button", { name: "Download" })).toBeInTheDocument();

    const png = screen.getByRole("link", { name: "Download PNG" });
    expect(png).toHaveAttribute("href", "/api/brand-download/ast-010");
    expect(png).toHaveTextContent("PNG");
    expect(png).toHaveTextContent("1000 B");

    expect(screen.getByRole("link", { name: "Download SVG" })).toHaveAttribute(
      "href",
      "/api/brand-download/ast-010-svg",
    );
    expect(screen.getByRole("link", { name: "Download AI" })).toHaveAttribute(
      "href",
      "/api/brand-download/ast-010-ai",
    );

    const all = screen.getByRole("link", { name: "Download all" });
    expect(all).toHaveAttribute("href", "/api/asset-bundle/k-lab-logo-blue");
    expect(all).toHaveTextContent("All");
    expect(all).toHaveTextContent("1320 B");
  });

  it("orders formats raster first, editable masters last, All at the end", () => {
    render(<AssetGrid assets={[logoAsset]} />);

    const formats = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("aria-label"))
      .filter((label): label is string => Boolean(label?.startsWith("Download")));

    expect(formats).toEqual([
      "Download PNG",
      "Download SVG",
      "Download AI",
      "Download all",
    ]);
  });

  it("puts a single-file asset in the same Download menu, without All", () => {
    render(<AssetGrid assets={[chevron]} />);

    expect(screen.getByText("1 file")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Download WEBP" })).toHaveAttribute(
      "href",
      "/api/brand-download/ast-040",
    );
    expect(
      screen.queryByRole("link", { name: "Download all" }),
    ).not.toBeInTheDocument();
  });
});

describe("AssetGrid expandPreview", () => {
  it("opens a dialog with the full image when a thumbnail is clicked", async () => {
    const user = userEvent.setup();
    render(<AssetGrid assets={[chevron]} expandPreview />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Chevron neon" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).not.toHaveTextContent("Hero background.");
    expect(within(dialog).getByRole("heading", { name: "Chevron neon" })).toHaveClass(
      "sr-only",
    );
    expect(
      screen.getAllByRole("img", { name: "Chevron neon" }).some(
        (img) =>
          img.getAttribute("src") ===
          "/brand-files/backgrounds/k-lab-bg-001.webp",
      ),
    ).toBe(true);
  });

  it("expands photography the same way as brand imagery", async () => {
    const user = userEvent.setup();
    const photo = asset({
      id: "ast-photo",
      title: "Studio portrait",
      category: "photography",
      previewUrl: "/brand-files/photography/portrait.webp",
    });
    render(<AssetGrid assets={[photo]} expandPreview />);

    await user.click(screen.getByRole("button", { name: "Studio portrait" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not make thumbnails expandable unless expandPreview is set", () => {
    render(<AssetGrid assets={[chevron]} />);

    expect(
      screen.queryByRole("button", { name: "Chevron neon" }),
    ).not.toBeInTheDocument();
  });
});

describe("AssetGrid presentation kinds", () => {
  it("shows a logo preview without a full-screen expand control", () => {
    render(<AssetGrid assets={[logoAsset]} expandPreview />);

    expect(
      screen.getByRole("img", { name: "K Lab logo — primary (blue)" }),
    ).toHaveAttribute("src", "/brand-files/logos/k-lab-logo-blue.png");
    expect(
      screen.queryByRole("button", { name: "K Lab logo — primary (blue)" }),
    ).not.toBeInTheDocument();
  });

  it("shows font name and sample text instead of an image, even with a previewUrl", () => {
    const font = asset({
      id: "ast-060",
      title: "Sora — variable font",
      category: "fonts",
      previewUrl: "/brand-files/fonts/sora-specimen.png",
      fileName: "sora-variable.ttf",
    });
    render(<AssetGrid assets={[font]} expandPreview />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sora — variable font" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Aa Bb Cc 123")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Sora — variable font" }),
    ).not.toBeInTheDocument();
  });

  it("shows a document thumbnail when one exists, without expanding", () => {
    const doc = asset({
      id: "ast-001",
      title: "Brand guidelines",
      category: "brand-guidelines",
      previewUrl: "/brand-files/docs/guidelines-cover.png",
      fileName: "guidelines.pdf",
    });
    render(<AssetGrid assets={[doc]} expandPreview />);

    expect(screen.getByRole("img", { name: "Brand guidelines" })).toHaveAttribute(
      "src",
      "/brand-files/docs/guidelines-cover.png",
    );
    expect(
      screen.queryByRole("button", { name: "Brand guidelines" }),
    ).not.toBeInTheDocument();
  });

  it("falls back to a file-type treatment when a document has no thumbnail", () => {
    const deck = asset({
      id: "ast-100",
      title: "Platform pitch",
      category: "pitch-decks",
      fileName: "pitch.pdf",
    });
    render(<AssetGrid assets={[deck]} expandPreview />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Platform pitch")).toBeInTheDocument();
  });

  it("shows an icon preview without expanding", () => {
    const icon = asset({
      id: "ast-icon",
      title: "App icon",
      category: "iconography",
      previewUrl: "/brand-files/icons/app-icon.svg",
      fileName: "app-icon.svg",
    });
    render(<AssetGrid assets={[icon]} expandPreview />);

    expect(screen.getByRole("img", { name: "App icon" })).toHaveAttribute(
      "src",
      "/brand-files/icons/app-icon.svg",
    );
    expect(screen.queryByRole("button", { name: "App icon" })).not.toBeInTheDocument();
  });
});
