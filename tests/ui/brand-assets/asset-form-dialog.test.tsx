import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

jest.mock("next-intl", () => ({
  useTranslations: () => {
    const messages: Record<string, string> = {
      createTitle: "New asset",
      editTitle: "Edit asset",
      createDescription: "Publish a new resource.",
      editDescription: "Update the details.",
      titleLabel: "Title",
      descriptionLabel: "Description",
      categoryLabel: "Category",
      visibilityLabel: "Visibility",
      tagsLabel: "Tags",
      productLabel: "Product",
      "products.k-lab": "K Lab",
      "products.k-talk": "K Talk",
      "products.k-rails": "K Rails",
      "products.k-risk": "K Risk",
      visibilityPublic: "Public",
      visibilityEmployee: "Employees only",
      filesLabel: "Drop files here",
      addFormatsLabel: "Drop files to add more formats",
      filesDescription: "Any file type.",
      currentFormats: "Published formats",
      removeFormat: "Remove {format}",
      restoreFormat: "Keep {format}",
      removalPending: "{count} pending removals",
      titleRequired: "A title is required.",
      fileRequired: "Choose at least one file to publish.",
      keepOneFile: "An asset needs at least one file.",
      duplicateFormats: "Each format can appear only once: {formats}.",
      uploadFailed: "Uploading the file failed.",
      cancel: "Cancel",
      save: "Save changes",
      create: "Create asset",
      "logos.title": "Logos",
      "brand-guidelines.title": "Brand guidelines",
      "brand-imagery.title": "Brand imagery",
      "fonts.title": "Fonts",
      "pitch-decks.title": "Pitch decks",
      "sales-materials.title": "Sales materials",
    };
    return (key: string, values?: Record<string, string | number>) => {
      const message = messages[key] ?? key;
      if (!values) return message;
      return message.replace(/\{(\w+)\}/g, (_match, name: string) =>
        String(values[name] ?? ""),
      );
    };
  },
}));

jest.mock("@/contexts/brand-assets/infrastructure/http/upload-asset-file", () => ({
  uploadAssetFile: jest.fn(async (file: File, category: string) => ({
    fileName: file.name,
    contentType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    storagePath: `assets/${category}/${file.name}`,
    downloadUrl: `/api/uploads/upl-${file.name}`,
  })),
}));

jest.mock("@k-lab/components", () => {
  const cn = (...parts: Array<string | false | undefined>) =>
    parts.filter(Boolean).join(" ");
  return {
    cn,
    formatFileSize: (bytes: number) => `${bytes} B`,
    Badge: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
    Button: ({
      children,
      type,
      disabled,
      onClick,
      "aria-label": ariaLabel,
    }: React.PropsWithChildren<{
      type?: "button" | "submit";
      disabled?: boolean;
      loading?: boolean;
      onClick?: () => void;
      "aria-label"?: string;
    }>) => (
      <button
        type={type === "submit" ? "submit" : "button"}
        disabled={disabled}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    ),
    Dialog: ({ open, children }: React.PropsWithChildren<{ open?: boolean }>) =>
      open ? <div role="dialog">{children}</div> : null,
    DialogContent: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    DialogDescription: ({ children }: React.PropsWithChildren) => <p>{children}</p>,
    DialogFooter: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    DialogHeader: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    DialogTitle: ({ children }: React.PropsWithChildren) => <h2>{children}</h2>,
    // Only the wiring the form depends on: a controlled file input.
    Dropzone: ({
      onFilesChange,
      disabled,
      children,
    }: React.PropsWithChildren<{
      files?: File[];
      onFilesChange?: (files: File[]) => void;
      maxFiles?: number;
      disabled?: boolean;
    }>) => (
      <div>
        {children}
        <label>
          Upload
          <input
            type="file"
            multiple
            disabled={disabled}
            onChange={(event) =>
              onFilesChange?.(Array.from(event.target.files ?? []))
            }
          />
        </label>
      </div>
    ),
    DropzoneArea: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    DropzoneDescription: ({ children }: React.PropsWithChildren) => <p>{children}</p>,
    DropzoneInput: () => null,
    DropzoneLabel: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
    DropzonePreviewList: () => null,
    DropzoneUploadIcon: () => null,
    FloatingLabelInput: ({
      label,
      value,
      onChange,
      type,
      selectOptions,
      disabled,
    }: {
      label: string;
      value: string;
      onChange: (event: React.ChangeEvent<HTMLElement & { value: string }>) => void;
      type?: string;
      selectOptions?: { value: string; label: string }[];
      disabled?: boolean;
      required?: boolean;
    }) => (
      <label>
        {label}
        {type === "select" ? (
          <select value={value} onChange={onChange} disabled={disabled}>
            {(selectOptions ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea value={value} onChange={onChange} disabled={disabled} />
        ) : (
          <input value={value} onChange={onChange} disabled={disabled} />
        )}
      </label>
    ),
  };
});

import {
  AssetFormDialog,
  type AssetFormValues,
} from "@/ui/brand-assets/components/asset-form-dialog";

function artwork(files: Array<{ fileName: string; id: string; sizeBytes?: number }>): BrandAsset {
  return {
    id: "partner-lockup",
    title: "Partner lockup",
    description: "Co-branded lockup.",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: files.map((item) => ({
      id: item.id,
      fileName: item.fileName,
      contentType: "application/octet-stream",
      sizeBytes: item.sizeBytes ?? 1000,
      storagePath: `assets/logos/${item.fileName}`,
      downloadUrl: `/brand-files/logos/${item.fileName}`,
    })),
    tags: ["partner"],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
  };
}

const twoFormatAsset = artwork([
  { fileName: "partner-lockup.png", id: "ast-1", sizeBytes: 900 },
  { fileName: "partner-lockup.svg", id: "ast-2", sizeBytes: 300 },
]);
const oneFormatAsset = artwork([{ fileName: "solo.pdf", id: "ast-3", sizeBytes: 500 }]);

function renderDialog(
  props: Partial<React.ComponentProps<typeof AssetFormDialog>> = {},
) {
  const onSubmit = jest.fn<Promise<void>, [AssetFormValues]>(async () => {});
  render(
    <AssetFormDialog
      open
      onOpenChange={() => {}}
      onSubmit={onSubmit}
      {...props}
    />,
  );
  return onSubmit;
}

describe("AssetFormDialog — publishing several formats at once", () => {
  it("uploads every chosen file and submits them as one artwork", async () => {
    const user = userEvent.setup();
    const onSubmit = renderDialog();

    await user.type(screen.getByLabelText("Title"), "Partner lockup");
    await user.upload(screen.getByLabelText("Upload"), [
      new File(["png"], "partner-lockup.png", { type: "image/png" }),
      new File(["svg"], "partner-lockup.svg", { type: "image/svg+xml" }),
    ]);
    await user.click(screen.getByRole("button", { name: "Create asset" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const values = onSubmit.mock.calls[0][0];
    expect(values.title).toBe("Partner lockup");
    expect(values.addFiles.map((entry) => entry.file.fileName)).toEqual([
      "partner-lockup.png",
      "partner-lockup.svg",
    ]);
    // Images preview from their own bytes; other formats fall back to an icon.
    expect(values.addFiles[0].previewUrl).toBe(
      "/api/uploads/upl-partner-lockup.png",
    );
    expect(values.removeFileIds).toEqual([]);
  });

  it("refuses to publish an artwork with no file", async () => {
    const user = userEvent.setup();
    const onSubmit = renderDialog();

    await user.type(screen.getByLabelText("Title"), "Partner lockup");
    await user.click(screen.getByRole("button", { name: "Create asset" }));

    expect(
      screen.getByText("Choose at least one file to publish."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe("AssetFormDialog — adding formats to an existing artwork", () => {
  it("lists the formats already published, with their own sizes", () => {
    renderDialog({ asset: twoFormatAsset });

    expect(screen.getByText("Published formats")).toBeInTheDocument();
    expect(screen.getByText("partner-lockup.png")).toBeInTheDocument();
    expect(screen.getByText("900 B")).toBeInTheDocument();
    expect(screen.getByText("partner-lockup.svg")).toBeInTheDocument();
    expect(screen.getByText("300 B")).toBeInTheDocument();
  });

  it("submits the missing format as an addition, keeping the rest", async () => {
    const user = userEvent.setup();
    const onSubmit = renderDialog({ asset: twoFormatAsset });

    await user.upload(
      screen.getByLabelText("Upload"),
      new File(["pdf"], "partner-lockup.pdf", { type: "application/pdf" }),
    );
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    const values = onSubmit.mock.calls[0][0];
    expect(values.addFiles.map((entry) => entry.file.fileName)).toEqual([
      "partner-lockup.pdf",
    ]);
    expect(values.removeFileIds).toEqual([]);
    expect(values.title).toBe("Partner lockup");
  });

  it("blocks a format the artwork already publishes", async () => {
    const user = userEvent.setup();
    const onSubmit = renderDialog({ asset: twoFormatAsset });

    await user.upload(
      screen.getByLabelText("Upload"),
      new File(["png"], "other-name.png", { type: "image/png" }),
    );
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      screen.getByText("Each format can appear only once: PNG."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("marks a dropped format for deletion, and lets it be put back", async () => {
    const user = userEvent.setup();
    const onSubmit = renderDialog({ asset: twoFormatAsset });

    await user.click(screen.getByRole("button", { name: "Remove SVG" }));
    expect(screen.getByText("1 pending removals")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Keep SVG" }));
    expect(screen.queryByText("1 pending removals")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove SVG" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(onSubmit.mock.calls[0][0].removeFileIds).toEqual(["ast-2"]);
  });

  it("will not let the last remaining file be removed", () => {
    renderDialog({ asset: oneFormatAsset });

    expect(screen.getByRole("button", { name: "Remove PDF" })).toBeDisabled();
  });
});
