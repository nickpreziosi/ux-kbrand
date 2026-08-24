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
import {
  ASSET_PRODUCTS,
  type AssetProduct,
} from "@/contexts/brand-assets/domain/models/asset-product.model";
import type {
  AssetFileDraft,
  AssetFileInput,
  AssetVisibility,
  BrandAsset,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  fileFormat,
  formatFromFileName,
  sortedFiles,
} from "@/contexts/brand-assets/domain/services/asset-files";
import { uploadAssetFile } from "@/contexts/brand-assets/infrastructure/http/upload-asset-file";
import { readFloatingLabelInputValue } from "@/ui/shared/lib/floating-label-input-value";

const MAX_GROUP_FILES = 10;

export interface AssetFormValues {
  title: string;
  description: string;
  category: AssetCategory;
  visibility: AssetVisibility;
  product: AssetProduct;
  tags: string[];
  addFiles: AssetFileInput[];
  removeFileIds: string[];
}

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: BrandAsset;
  submitting?: boolean;
  onSubmit: (values: AssetFormValues) => Promise<void> | void;
}

async function toAssetFile(
  file: File,
  category: AssetCategory,
): Promise<AssetFileDraft> {
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

function selfPreviewUrl(file: File, assetFile: AssetFileDraft): string {
  return file.type.startsWith("image/") ? assetFile.downloadUrl : "";
}

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
  const [product, setProduct] = React.useState<AssetProduct>("k-lab");
  const [tags, setTags] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [removedIds, setRemovedIds] = React.useState<string[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const busy = submitting || uploading;

  React.useEffect(() => {
    if (!open) return;
    setTitle(asset?.title ?? "");
    setDescription(asset?.description ?? "");
    setCategory(asset?.category ?? "brand-guidelines");
    setVisibility(asset?.visibility ?? "public");
    setProduct(asset?.product ?? "k-lab");
    setTags(asset?.tags.join(", ") ?? "");
    setFiles([]);
    setRemovedIds([]);
    setFormError(null);
  }, [open, asset]);

  const salesGated = isSalesCategory(category);
  const existingFiles = asset ? sortedFiles(asset.files) : [];
  const keptFiles = existingFiles.filter((file) => !removedIds.includes(file.id));
  const totalFiles = keptFiles.length + files.length;

  const handleCategoryChange = (value: string) => {
    const next = value as AssetCategory;
    setCategory(next);
    setVisibility((current) => resolveVisibilityForCategory(next, current));
  };

  const toggleRemoved = (fileId: string) => {
    setFormError(null);
    setRemovedIds((current) =>
      current.includes(fileId)
        ? current.filter((id) => id !== fileId)
        : [...current, fileId],
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

    const duplicates = duplicateFormats([
      ...keptFiles.map((file) => file.fileName),
      ...files.map((file) => file.name),
    ]);
    if (duplicates.length > 0) {
      setFormError(t("duplicateFormats", { formats: duplicates.join(", ") }));
      return;
    }

    setFormError(null);

    let addFiles: AssetFileInput[] = [];
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
      product,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      addFiles,
      removeFileIds: removedIds,
    });
  };

  const categoryOptions = ASSET_CATEGORIES.map((value) => ({
    value,
    label: tCategories(`${value}.title`),
  }));

  const productOptions = ASSET_PRODUCTS.map((value) => ({
    value,
    label: t(`products.${value}`),
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
              label={t("productLabel")}
              type="select"
              selectOptions={productOptions}
              value={product}
              onChange={(e) =>
                setProduct(readFloatingLabelInputValue(e) as AssetProduct)
              }
              disabled={busy}
            />
          </div>
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
            {salesGated ? (
              <p className="text-xs text-muted-foreground">
                {t("visibilitySalesLocked")}
              </p>
            ) : null}
          </div>
          <FloatingLabelInput
            label={t("tagsLabel")}
            value={tags}
            onChange={(e) => setTags(readFloatingLabelInputValue(e))}
            disabled={busy}
          />

          {existingFiles.length > 0 ? (
            <section className="space-y-2">
              <p className="text-sm font-medium">{t("currentFormats")}</p>
              <ul className="divide-y divide-border rounded-md border border-border">
                {existingFiles.map((file) => {
                  const removed = removedIds.includes(file.id);
                  return (
                    <li
                      key={file.id}
                      className="flex items-center gap-3 p-2 ps-3 text-sm"
                    >
                      <Badge
                        variant={removed ? "outline" : "secondary"}
                        className="shrink-0 font-semibold"
                      >
                        {fileFormat(file)?.toUpperCase() ?? "FILE"}
                      </Badge>
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate",
                          removed && "text-muted-foreground line-through",
                        )}
                      >
                        {file.fileName}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatFileSize(file.sizeBytes)}
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
                                format: fileFormat(file)?.toUpperCase() ?? "",
                              })
                            : t("removeFormat", {
                                format: fileFormat(file)?.toUpperCase() ?? "",
                              })
                        }
                        onClick={() => toggleRemoved(file.id)}
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
