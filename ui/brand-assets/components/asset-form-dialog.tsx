"use client";

import * as React from "react";
import {
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
} from "@k-lab/components";
import { useTranslations } from "next-intl";
import {
  ASSET_CATEGORIES,
  defaultVisibilityForCategory,
  type AssetCategory,
} from "@/contexts/brand-assets/domain/models/asset-category.model";
import type {
  AssetFile,
  AssetVisibility,
  BrandAsset,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { uploadAssetFile } from "@/contexts/brand-assets/infrastructure/http/upload-asset-file";
import { readFloatingLabelInputValue } from "@/ui/shared/lib/floating-label-input-value";

export interface AssetFormValues {
  title: string;
  description: string;
  category: AssetCategory;
  visibility: AssetVisibility;
  tags: string[];
  /** Present only when a new file was chosen (create always; edit = replace). */
  file?: AssetFile;
  /**
   * Sent alongside a new file only: the file's own bytes for images, "" to
   * clear a stale preview when the replacement can't preview itself. Left
   * undefined when no file was chosen, which keeps the stored preview.
   */
  previewUrl?: string;
}

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Existing asset when editing; undefined when creating. */
  asset?: BrandAsset;
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

export function AssetFormDialog({
  open,
  onOpenChange,
  asset,
  submitting = false,
  onSubmit,
}: AssetFormDialogProps) {
  const t = useTranslations("adminAssets.form");
  const tCategories = useTranslations("brand.categories");
  const isEdit = Boolean(asset);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState<AssetCategory>("brand-guidelines");
  const [visibility, setVisibility] = React.useState<AssetVisibility>("public");
  const [tags, setTags] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const busy = submitting || uploading;

  React.useEffect(() => {
    if (!open) return;
    setTitle(asset?.title ?? "");
    setDescription(asset?.description ?? "");
    setCategory(asset?.category ?? "brand-guidelines");
    setVisibility(asset?.visibility ?? "public");
    setTags(asset?.tags.join(", ") ?? "");
    setFiles([]);
    setFormError(null);
  }, [open, asset]);

  const handleCategoryChange = (value: string) => {
    const next = value as AssetCategory;
    setCategory(next);
    if (!isEdit) {
      setVisibility(defaultVisibilityForCategory(next));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setFormError(t("titleRequired"));
      return;
    }
    if (!isEdit && files.length === 0) {
      setFormError(t("fileRequired"));
      return;
    }
    setFormError(null);
    const chosen = files[0];
    let assetFile: AssetFile | undefined;
    if (chosen) {
      setUploading(true);
      try {
        assetFile = await toAssetFile(chosen, category);
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
      file: assetFile,
      previewUrl: chosen && assetFile ? selfPreviewUrl(chosen, assetFile) : undefined,
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
            <FloatingLabelInput
              label={t("visibilityLabel")}
              type="select"
              selectOptions={visibilityOptions}
              value={visibility}
              onChange={(e) =>
                setVisibility(readFloatingLabelInputValue(e) as AssetVisibility)
              }
              disabled={busy}
            />
          </div>
          <FloatingLabelInput
            label={t("tagsLabel")}
            value={tags}
            onChange={(e) => setTags(readFloatingLabelInputValue(e))}
            disabled={busy}
          />
          <Dropzone files={files} onFilesChange={setFiles} maxFiles={1} disabled={busy}>
            <DropzoneArea>
              <DropzoneUploadIcon />
              <DropzoneLabel>
                {isEdit ? t("replaceFileLabel") : t("fileLabel")}
              </DropzoneLabel>
              <DropzoneDescription>{t("fileDescription")}</DropzoneDescription>
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
