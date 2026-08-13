"use client";

import * as React from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dropzone,
  DropzoneArea,
  DropzoneDescription,
  DropzoneInput,
  DropzoneLabel,
  DropzonePreviewList,
  DropzoneUploadIcon,
  FloatingLabelInput,
  cn,
  formatFileSize,
} from "@k-lab/components";
import { Undo2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  ASSET_CATEGORIES,
  isSalesCategory,
  resolveVisibilityForCategory,
  type AssetCategory,
} from "@/contexts/brand-assets/domain/models/asset-category.model";
import type {
  AssetFile,
  AssetGroupFileInput,
  AssetVisibility,
  BrandAsset,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  assetFormat,
  formatFromFileName,
  type AssetGroup,
} from "@/contexts/brand-assets/domain/services/asset-grouping";
import { uploadAssetFile } from "@/contexts/brand-assets/infrastructure/http/upload-asset-file";
import { readFloatingLabelInputValue } from "@/ui/shared/lib/floating-label-input-value";

/** How many formats one artwork may carry — PNG/SVG/WEBP/PDF/AI/EPS and room. */
const MAX_GROUP_FILES = 10;

export interface AssetFormValues {
  title: string;
  description: string;
  category: AssetCategory;
  visibility: AssetVisibility;
  tags: string[];
  /** Formats to publish: every file on create, only the new ones on edit. */
  addFiles: AssetGroupFileInput[];
  /** Member asset ids the admin dropped (edit only). */
  removeAssetIds: string[];
}

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Existing artwork and its formats when editing; undefined when creating. */
  group?: AssetGroup;
  submitting?: boolean;
  onSubmit: (values: AssetFormValues) => Promise<void> | void;
}

/**
 * Builds domain file metadata from a browser File. Default: upload the bytes
 * to the mock HTTP backend so every tab (and download gating) can serve them.
 * The in-browser mock (NEXT_PUBLIC_USE_MOCK_BRAND_API=true) keeps the old
 * blob-URL shortcut — bytes never leave the browser there.
 */
async function toAssetFile(file: File, category: AssetCategory): Promise<AssetFile> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_BRAND_API === "true") {
    return {
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      storagePath: `assets/${category}/${file.name}`,
      downloadUrl: URL.createObjectURL(file),
    };
  }
  return uploadAssetFile(file, category);
}

/**
 * Images preview from their own bytes, the way the seeded PNGs do (uploads are
 * served inline by /api/uploads/[id]). PDFs, fonts and stylesheets have no
 * thumbnail to show, so they fall back to the card's file-type icon.
 */
function selfPreviewUrl(file: File, assetFile: AssetFile): string {
  return file.type.startsWith("image/") ? assetFile.downloadUrl : "";
}

function formatLabel(fileName: string): string {
  return formatFromFileName(fileName)?.toUpperCase() ?? "FILE";
}

/** Formats claimed twice across the files the group would end up with. */
function duplicateFormats(fileNames: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const fileName of fileNames) {
    const format = formatFromFileName(fileName);
    if (!format) continue;
    if (seen.has(format)) duplicates.add(format.toUpperCase());
    seen.add(format);
  }
  return [...duplicates];
}

export function AssetFormDialog({
  open,
  onOpenChange,
  group,
  submitting = false,
  onSubmit,
}: AssetFormDialogProps) {
  const t = useTranslations("adminAssets.form");
  const tCategories = useTranslations("brand.categories");
  const isEdit = Boolean(group);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState<AssetCategory>("brand-guidelines");
  const [visibility, setVisibility] = React.useState<AssetVisibility>("public");
  const [tags, setTags] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [removedIds, setRemovedIds] = React.useState<string[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const busy = submitting || uploading;

  React.useEffect(() => {
    if (!open) return;
    setTitle(group?.title ?? "");
    setDescription(group?.description ?? "");
    setCategory(group?.category ?? "brand-guidelines");
    setVisibility(group?.visibility ?? "public");
    setTags(group?.tags.join(", ") ?? "");
    setFiles([]);
    setRemovedIds([]);
    setFormError(null);
  }, [open, group]);

  // Sales categories are employee-only by domain rule, so the picker follows
  // the category instead of offering a choice that cannot be honoured.
  const salesGated = isSalesCategory(category);

  const existingFiles: BrandAsset[] = group?.assets ?? [];
  const keptFiles = existingFiles.filter((asset) => !removedIds.includes(asset.id));
  const totalFiles = keptFiles.length + files.length;

  const handleCategoryChange = (value: string) => {
    const next = value as AssetCategory;
    setCategory(next);
    setVisibility((current) => resolveVisibilityForCategory(next, current));
  };

  const toggleRemoved = (assetId: string) => {
    setFormError(null);
    setRemovedIds((current) =>
      current.includes(assetId)
        ? current.filter((id) => id !== assetId)
        : [...current, assetId],
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setFormError(t("titleRequired"));
      return;
    }
    if (totalFiles === 0) {
      setFormError(isEdit ? t("keepOneFile") : t("fileRequired"));
      return;
    }
    if (totalFiles > MAX_GROUP_FILES) {
      setFormError(t("tooManyFiles", { max: MAX_GROUP_FILES }));
      return;
    }

    // One format per artwork: a second PNG would render as a duplicate chip
    // with no way for a visitor to tell the two apart.
    const duplicates = duplicateFormats([
      ...keptFiles.map((asset) => asset.file.fileName),
      ...files.map((file) => file.name),
    ]);
    if (duplicates.length > 0) {
      setFormError(t("duplicateFormats", { formats: duplicates.join(", ") }));
      return;
    }

    setFormError(null);

    let addFiles: AssetGroupFileInput[] = [];
    if (files.length > 0) {
      setUploading(true);
      try {
        addFiles = await Promise.all(
          files.map(async (file) => {
            const uploaded = await toAssetFile(file, category);
            return { file: uploaded, previewUrl: selfPreviewUrl(file, uploaded) };
          }),
        );
      } catch {
        setFormError(t("uploadFailed"));
        return;
      } finally {
        setUploading(false);
      }
    }

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      visibility,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      addFiles,
      removeAssetIds: removedIds,
    });
  };

  const categoryOptions = ASSET_CATEGORIES.map((value) => ({
    value,
    label: tCategories(`${value}.title`),
  }));

  const visibilityOptions: { value: AssetVisibility; label: string }[] = [
    { value: "public", label: t("visibilityPublic") },
    { value: "employee", label: t("visibilityEmployee") },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? t("editTitle") : t("createTitle")}</DialogTitle>
          <DialogDescription>
            {isEdit ? t("editDescription") : t("createDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingLabelInput
            label={t("titleLabel")}
            value={title}
            onChange={(e) => setTitle(readFloatingLabelInputValue(e))}
            disabled={busy}
            required
          />
          <FloatingLabelInput
            label={t("descriptionLabel")}
            type="textarea"
            value={description}
            onChange={(e) => setDescription(readFloatingLabelInputValue(e))}
            disabled={busy}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FloatingLabelInput
              label={t("categoryLabel")}
              type="select"
              selectOptions={categoryOptions}
              value={category}
              onChange={(e) => handleCategoryChange(readFloatingLabelInputValue(e))}
              disabled={busy}
            />
            <div className="space-y-1">
              <FloatingLabelInput
                label={t("visibilityLabel")}
                type="select"
                selectOptions={visibilityOptions}
                value={visibility}
                onChange={(e) =>
                  setVisibility(readFloatingLabelInputValue(e) as AssetVisibility)
                }
                disabled={busy || salesGated}
              />
              {/* The server enforces this either way — say so rather than let
                  an admin pick "Public" and watch it silently flip back. */}
              {salesGated ? (
                <p className="text-xs text-muted-foreground">
                  {t("visibilitySalesLocked")}
                </p>
              ) : null}
            </div>
          </div>
          <FloatingLabelInput
            label={t("tagsLabel")}
            value={tags}
            onChange={(e) => setTags(readFloatingLabelInputValue(e))}
            disabled={busy}
          />

          {/* The formats already published for this artwork. Dropping one here
              deletes that file on save; the group must keep at least one. */}
          {existingFiles.length > 0 ? (
            <section className="space-y-2">
              <p className="text-sm font-medium">{t("currentFormats")}</p>
              <ul className="divide-y divide-border rounded-md border border-border">
                {existingFiles.map((asset) => {
                  const removed = removedIds.includes(asset.id);
                  return (
                    <li
                      key={asset.id}
                      className="flex items-center gap-3 p-2 ps-3 text-sm"
                    >
                      <Badge
                        variant={removed ? "outline" : "secondary"}
                        className="shrink-0 font-semibold"
                      >
                        {assetFormat(asset)?.toUpperCase() ?? "FILE"}
                      </Badge>
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate",
                          removed && "text-muted-foreground line-through",
                        )}
                      >
                        {asset.file.fileName}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatFileSize(asset.file.sizeBytes)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        disabled={busy || (!removed && totalFiles <= 1)}
                        aria-label={
                          removed
                            ? t("restoreFormat", {
                                format: assetFormat(asset)?.toUpperCase() ?? "",
                              })
                            : t("removeFormat", {
                                format: assetFormat(asset)?.toUpperCase() ?? "",
                              })
                        }
                        onClick={() => toggleRemoved(asset.id)}
                      >
                        {removed ? (
                          <Undo2 className="h-4 w-4" aria-hidden />
                        ) : (
                          <X className="h-4 w-4" aria-hidden />
                        )}
                      </Button>
                    </li>
                  );
                })}
              </ul>
              {removedIds.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  {t("removalPending", { count: removedIds.length })}
                </p>
              ) : null}
            </section>
          ) : null}

          <Dropzone
            files={files}
            onFilesChange={(next) => {
              setFormError(null);
              setFiles(next);
            }}
            maxFiles={MAX_GROUP_FILES}
            disabled={busy}
          >
            <DropzoneArea>
              <DropzoneUploadIcon />
              <DropzoneLabel>
                {isEdit ? t("addFormatsLabel") : t("filesLabel")}
              </DropzoneLabel>
              <DropzoneDescription>{t("filesDescription")}</DropzoneDescription>
              <DropzoneInput />
            </DropzoneArea>
            <DropzonePreviewList />
          </Dropzone>
          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={busy}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" variant="accent-brand" loading={busy}>
              {isEdit ? t("save") : t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
