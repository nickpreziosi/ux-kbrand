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
    const t = (key: string) => {
      if (key === "download") return "Download";
      if (key === "empty.title") return "Nothing here yet";
      if (key === "empty.description") return "Empty";
      return key;
    };
    return t;
  },
}));

jest.mock("@/ui/user-management/hooks/use-portal-role", () => ({
  usePortalRole: () => ({ viewerRole: "public" }),
}));

jest.mock("@k-lab/components", () => {
  return {
    cn: (...parts: Array<string | false | undefined>) =>
      parts.filter(Boolean).join(" "),
    formatFileSize: () => "1 KB",
    Button: ({
      children,
      href,
      ...rest
    }: React.PropsWithChildren<{ href?: string }>) => {
      if (href) {
        return (
          <a href={href} {...rest}>
            {children}
          </a>
        );
      }
      return (
        <button type="button" {...rest}>
          {children}
        </button>
      );
    },
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
}): BrandAsset {
  return {
    id: partial.id,
    title: partial.title,
    description: partial.description ?? "Hero background.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: `${partial.id}.webp`,
      contentType: "image/webp",
      sizeBytes: 1024,
      storagePath: `assets/backgrounds/${partial.id}.webp`,
      downloadUrl: `/brand-files/backgrounds/${partial.id}.webp`,
    },
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
