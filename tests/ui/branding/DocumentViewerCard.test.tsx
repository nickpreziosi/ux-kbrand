import * as React from "react";
import { render, screen } from "@testing-library/react";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

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

jest.mock("@k-lab/components", () => ({
  cn: (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" "),
  formatFileSize: (bytes: number) => `${bytes} B`,
  Button: ({
    children,
    href,
    target,
    rel,
  }: React.PropsWithChildren<{
    href?: string;
    target?: string;
    rel?: string;
  }>) =>
    href ? (
      <a href={href} target={target} rel={rel}>
        {children}
      </a>
    ) : (
      <button type="button">{children}</button>
    ),
  Card: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  CardContent: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Skeleton: () => <div data-testid="skeleton" />,
}));

import { DocumentViewerCard } from "@/ui/branding/components/document-viewer-card";

function brandBook(): BrandAsset {
  return {
    id: "ast-001",
    title: "K Lab Brand Guidelines (WIP)",
    description: "The complete brand guidelines.",
    resourceType: "brand",
    category: "brand-guidelines",
    product: "k-lab",
    visibility: "public",
    status: "active",
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
    tags: ["brand-book"],
    createdAt: "2026-08-10T09:00:00.000Z",
    updatedAt: "2026-08-10T09:00:00.000Z",
    createdBy: "usr-001",
  };
}

describe("DocumentViewerCard", () => {
  it("views the public PDF URL and downloads through the attachment API", () => {
    render(<DocumentViewerCard asset={brandBook()} />);

    expect(screen.getByRole("link", { name: "View" })).toHaveAttribute(
      "href",
      "/brand-files/docs/k-lab-brand-guidelines-wip.pdf",
    );
    expect(screen.getByRole("link", { name: "Download" })).toHaveAttribute(
      "href",
      "/api/brand-download/ast-001",
    );
  });

  it("can hide View and Download when they live in the page header", () => {
    render(<DocumentViewerCard asset={brandBook()} showActions={false} />);

    expect(screen.queryByRole("link", { name: "View" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Download" })).not.toBeInTheDocument();
  });
});
