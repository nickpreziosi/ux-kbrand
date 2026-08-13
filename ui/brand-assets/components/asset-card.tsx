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
  cn,
  formatFileSize,
} from "@k-lab/components";
import {
  Download,
  FileArchive,
  FileText,
  Globe,
  Image as ImageIcon,
  Lock,
  Maximize2,
  Type,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  assetFormat,
  type AssetGroup,
} from "@/contexts/brand-assets/domain/services/asset-grouping";
import { brandBundleUrl } from "@/ui/branding/content/logo-formats";
import { assetDownloadHref } from "@/ui/brand-assets/lib/asset-download-href";

function formatLabel(asset: BrandAsset): string {
  return assetFormat(asset)?.toUpperCase() ?? "FILE";
}

function PreviewFallbackIcon({ contentType }: { contentType: string }) {
  const className = "h-10 w-10 text-muted-foreground";
  if (contentType.startsWith("image/")) return <ImageIcon className={className} aria-hidden />;
  if (contentType === "text/css") return <Type className={className} aria-hidden />;
  return <FileText className={className} aria-hidden />;
}

interface AssetCardProps {
  /** One artwork and every format it ships in (single-file assets are a group of one). */
  group: AssetGroup;
  /** Show the group's gating badge (employees/admins; read-only here). */
  showVisibility?: boolean;
  /** Opens a larger preview when the thumbnail is clicked. */
  onPreview?: () => void;
  className?: string;
}

/**
 * Catalog card for one artwork. When the group holds several formats, each one
 * gets a chip carrying its own size and its own download link, and the footer
 * action bundles the lot — so a card answers "how big is the PNG?" without a
 * click and still lets you take one file or all of them.
 */
export function AssetCard({
  group,
  showVisibility = false,
  onPreview,
  className,
}: AssetCardProps) {
  const t = useTranslations("assets");
  const { preview, assets } = group;
  const multiFormat = assets.length > 1;

  const previewImage = preview.previewUrl ? (
    <Image
      src={preview.previewUrl}
      alt={group.title}
      fill
      unoptimized
      className={cn(
        "object-cover",
        onPreview && "transition-transform duration-200 group-hover:scale-[1.03]",
      )}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    />
  ) : null;

  return (
    <Card className={cn("flex h-full flex-col overflow-hidden", className)}>
      <div className="relative flex aspect-video items-center justify-center overflow-hidden border-b border-border bg-secondary">
        {previewImage && onPreview ? (
          <button
            type="button"
            onClick={onPreview}
            className="group absolute inset-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            aria-label={group.title}
          >
            {previewImage}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30 group-focus-visible:bg-black/30">
              <Maximize2
                className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                aria-hidden
              />
            </span>
          </button>
        ) : previewImage ? (
          previewImage
        ) : (
          <PreviewFallbackIcon contentType={preview.file.contentType} />
        )}
        {showVisibility ? (
          <Badge
            variant={group.visibility === "public" ? "success-soft" : "warning-soft"}
            className="pointer-events-none absolute start-2 top-2 z-10 gap-1"
          >
            {group.visibility === "public" ? (
              <Globe className="h-3 w-3" aria-hidden />
            ) : (
              <Lock className="h-3 w-3" aria-hidden />
            )}
            {t(`visibility.${group.visibility}`)}
          </Badge>
        ) : null}
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{group.title}</CardTitle>
          <Badge
            variant={multiFormat ? "accent-brand-soft" : "secondary"}
            className="shrink-0"
          >
            {multiFormat
              ? t("fileCount", { count: assets.length })
              : formatLabel(preview)}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-sm">
          {group.description}
        </CardDescription>
      </CardContent>

      {multiFormat ? (
        // Every format, its own size, its own download — the answer to "which
        // one do I need?" without opening anything.
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {assets.map((asset) => (
            <Button
              key={asset.id}
              variant="outline"
              size="sm"
              href={assetDownloadHref(asset)}
              aria-label={t("downloadFormat", { format: formatLabel(asset) })}
              className="h-auto gap-1.5 px-2 py-1 text-xs font-semibold"
            >
              {formatLabel(asset)}
              <span className="font-normal text-muted-foreground">
                {formatFileSize(asset.file.sizeBytes)}
              </span>
            </Button>
          ))}
        </div>
      ) : null}

      <CardFooter className="flex items-center justify-between gap-2 p-4 pt-0">
        <span className="text-xs text-muted-foreground">
          {multiFormat
            ? t("totalSize", { size: formatFileSize(group.totalBytes) })
            : formatFileSize(preview.file.sizeBytes)}
        </span>
        <Button
          variant="accent-brand"
          size="sm"
          icon={multiFormat ? <FileArchive aria-hidden /> : <Download aria-hidden />}
          href={multiFormat ? brandBundleUrl(group.id) : assetDownloadHref(preview)}
        >
          {multiFormat ? t("downloadAll") : t("download")}
        </Button>
      </CardFooter>
    </Card>
  );
}
