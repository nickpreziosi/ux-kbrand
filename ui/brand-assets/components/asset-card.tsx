"use client";

import * as React from "react";
import Image from "next/image";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  cn,
  formatFileSize,
} from "@k-lab/components";
import {
  ChevronDown,
  Download,
  FileText,
  Globe,
  Image as ImageIcon,
  Lock,
  Maximize2,
  Type,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { AssetFile } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  assetTotalBytes,
  fileFormat,
  sortedFiles,
} from "@/contexts/brand-assets/domain/services/asset-files";
import {
  assetPresentationKind,
  presentationAllowsExpand,
  presentationShowsImagePreview,
} from "@/contexts/brand-assets/domain/services/asset-presentation";
import { brandBundleUrl } from "@/ui/branding/content/logo-formats";
import { fileDownloadHref } from "@/ui/brand-assets/lib/asset-download-href";
import { assetThumbnail } from "@/ui/brand-assets/lib/asset-thumbnail";

function formatLabel(file: AssetFile): string {
  return fileFormat(file)?.toUpperCase() ?? "FILE";
}

function PreviewFallbackIcon({ kind, contentType }: { kind: string; contentType: string }) {
  const className = "h-10 w-10 text-muted-foreground";
  if (kind === "font") return <Type className={className} aria-hidden />;
  if (kind === "icon" || kind === "logo" || kind === "imagery") {
    return <ImageIcon className={className} aria-hidden />;
  }
  if (kind === "document" || !contentType.startsWith("image/")) {
    return <FileText className={className} aria-hidden />;
  }
  return <ImageIcon className={className} aria-hidden />;
}

function FormatSizeLabel({
  label,
  sizeBytes,
}: {
  label: string;
  sizeBytes: number;
}) {
  return (
    <>
      <span className="font-semibold">{label}</span>
      <span className="font-normal text-muted-foreground">
        {formatFileSize(sizeBytes)}
      </span>
    </>
  );
}

interface AssetCardProps {
  asset: BrandAsset;
  showVisibility?: boolean;
  onPreview?: () => void;
  priority?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  className?: string;
}

/**
 * Catalog card for one artwork. Every format lands in one Download menu (and a
 * zip of the lot when there is more than one).
 */
export function AssetCard({
  asset,
  showVisibility = false,
  onPreview,
  priority = false,
  selectable = false,
  selected = false,
  onSelectedChange,
  className,
}: AssetCardProps) {
  const t = useTranslations("assets");
  const files = sortedFiles(asset.files);
  const multiFormat = files.length > 1;
  const kind = assetPresentationKind(asset.category);
  const expand = onPreview && presentationAllowsExpand(kind);
  const { fit, surfaceClassName, clearspace } = assetThumbnail(asset);
  const previewFile = files[0];
  const showImage =
    Boolean(asset.previewUrl) && presentationShowsImagePreview(kind);

  const previewImage = showImage && asset.previewUrl ? (
    <Image
      src={asset.previewUrl}
      alt={asset.title}
      fill
      unoptimized
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      className={cn(
        fit === "cover" ? "object-cover" : "object-contain",
        expand && "transition-transform duration-200 group-hover:scale-[1.03]",
      )}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    />
  ) : null;

  return (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden",
        selected && "ring-2 ring-accent-brand",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex aspect-video items-center justify-center overflow-hidden border-b border-border",
          surfaceClassName,
          expand && "group",
        )}
      >
        {selectable ? (
          <div className="absolute start-2 top-2 z-20">
            <Checkbox
              variant="accent-brand"
              checked={selected}
              onCheckedChange={(value) => onSelectedChange?.(value === true)}
              aria-label={asset.title}
            />
          </div>
        ) : null}
        {previewImage ? (
          <>
            <div className={cn("absolute", clearspace ? "inset-6" : "inset-0")}>
              {previewImage}
            </div>
            {expand ? (
              <button
                type="button"
                onClick={onPreview}
                className="absolute inset-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                aria-label={asset.title}
              >
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30 group-focus-visible:bg-black/30">
                  <Maximize2
                    className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                    aria-hidden
                  />
                </span>
              </button>
            ) : null}
          </>
        ) : kind === "font" ? (
          <div className="px-4 text-center">
            <p className="font-extrabold tracking-tight text-2xl">{asset.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">Aa Bb Cc 123</p>
          </div>
        ) : (
          <PreviewFallbackIcon
            kind={kind}
            contentType={previewFile?.contentType ?? ""}
          />
        )}
        {showVisibility ? (
          <Badge
            variant={asset.visibility === "public" ? "success-soft" : "warning-soft"}
            className="pointer-events-none absolute end-2 top-2 z-10 gap-1"
          >
            {asset.visibility === "public" ? (
              <Globe className="h-3 w-3" aria-hidden />
            ) : (
              <Lock className="h-3 w-3" aria-hidden />
            )}
            {t(`visibility.${asset.visibility}`)}
          </Badge>
        ) : null}
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{asset.title}</CardTitle>
          <Badge variant="accent-brand-soft" className="shrink-0">
            {t(
              files.length === 1 ? "fileCount.one" : "fileCount.other",
              { count: files.length },
            )}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-sm">
          {asset.description}
        </CardDescription>
      </CardContent>

      <CardFooter className="flex items-center justify-end gap-2 p-4 pt-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="accent-brand"
              size="sm"
              icon={<Download aria-hidden />}
            >
              {t("download")}
              <ChevronDown className="h-3.5 w-3.5 opacity-80" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {files.map((file) => (
              <DropdownMenuItem key={file.id} asChild>
                <a
                  href={fileDownloadHref(file)}
                  className="flex items-center gap-1.5"
                  aria-label={t("downloadFormat", {
                    format: formatLabel(file),
                  })}
                >
                  <FormatSizeLabel
                    label={formatLabel(file)}
                    sizeBytes={file.sizeBytes}
                  />
                </a>
              </DropdownMenuItem>
            ))}
            {multiFormat ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a
                    href={brandBundleUrl(asset.id)}
                    className="flex items-center gap-1.5"
                    aria-label={t("downloadAll")}
                  >
                    <FormatSizeLabel
                      label={
                        t.has("downloadAllOption")
                          ? t("downloadAllOption")
                          : t("downloadAll")
                      }
                      sizeBytes={assetTotalBytes(asset)}
                    />
                  </a>
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
