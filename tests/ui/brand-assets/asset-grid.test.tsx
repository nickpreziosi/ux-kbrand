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
      fileCount: "{count} files",
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
  groupId?: string;
  groupTitle?: string;
  groupDescription?: string;
}): BrandAsset {
  const fileName = partial.fileName ?? `${partial.id}.webp`;
  return {
    id: partial.id,
    title: partial.title,
    description: partial.description ?? "Hero background.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName,
      contentType: "image/webp",
      sizeBytes: partial.sizeBytes ?? 1024,
      storagePath: `assets/backgrounds/${fileName}`,
      downloadUrl: `/brand-files/backgrounds/${fileName}`,
    },
    previewUrl: partial.previewUrl,
    groupId: partial.groupId,
    groupTitle: partial.groupTitle,
    groupDescription: partial.groupDescription,
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

const logoGroup = [
  asset({
    id: "ast-010",
    title: "K Lab logo — primary (blue), PNG",
    fileName: "k-lab-logo-blue.png",
    sizeBytes: 1000,
    previewUrl: "/brand-files/logos/k-lab-logo-blue.png",
    groupId: "k-lab-logo-blue",
    groupTitle: "K Lab logo — primary (blue)",
    groupDescription: "The default lockup.",
  }),
  asset({
    id: "ast-010-ai",
    title: "K Lab logo — primary (blue), AI",
    fileName: "k-lab-logo-blue.ai",
    sizeBytes: 20,
    groupId: "k-lab-logo-blue",
    groupTitle: "K Lab logo — primary (blue)",
    groupDescription: "The default lockup.",
  }),
  asset({
    id: "ast-010-svg",
    title: "K Lab logo — primary (blue), SVG",
    fileName: "k-lab-logo-blue.svg",
    sizeBytes: 300,
    groupId: "k-lab-logo-blue",
    groupTitle: "K Lab logo — primary (blue)",
    groupDescription: "The default lockup.",
  }),
];

describe("AssetGrid download menu", () => {
  it("renders one card for a group", () => {
    render(<AssetGrid assets={logoGroup} />);

    expect(
      screen.getAllByRole("heading", { name: "K Lab logo — primary (blue)" }),
    ).toHaveLength(1);
    expect(screen.queryByText(/, PNG$/)).not.toBeInTheDocument();
    expect(screen.getByText("3 files")).toBeInTheDocument();
    expect(screen.getByText("The default lockup.")).toBeInTheDocument();
  });

  it("puts every format and an All option in one Download menu", () => {
    render(<AssetGrid assets={logoGroup} />);

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
    expect(all).toHaveAttribute("href", "/api/brand-bundle/k-lab-logo-blue");
    expect(all).toHaveTextContent("All");
    expect(all).toHaveTextContent("1320 B");
  });

  it("orders formats raster first, editable masters last, All at the end", () => {
    render(<AssetGrid assets={logoGroup} />);

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

  it("leaves a single-file asset as a direct download", () => {
    render(<AssetGrid assets={[chevron]} />);

    expect(screen.getByText("WEBP")).toBeInTheDocument();
    expect(screen.getByText("1024 B")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Download" })).toHaveAttribute(
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

  it("does not make thumbnails expandable unless expandPreview is set", () => {
    render(<AssetGrid assets={[chevron]} />);

    expect(
      screen.queryByRole("button", { name: "Chevron neon" }),
    ).not.toBeInTheDocument();
  });
});
