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
  FileText,
  Globe,
  Image as ImageIcon,
  Lock,
  Maximize2,
  Type,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { brandDownloadUrl } from "@/ui/branding/content/logo-formats";

function downloadHrefForAsset(asset: BrandAsset): string {
  if (asset.file.downloadUrl.startsWith("/brand-files/")) {
    return brandDownloadUrl(asset.id);
  }
  return asset.file.downloadUrl;
}

function fileExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.slice(dot + 1).toUpperCase() : "FILE";
}

function PreviewFallbackIcon({ contentType }: { contentType: string }) {
  const className = "h-10 w-10 text-muted-foreground";
  if (contentType.startsWith("image/")) return <ImageIcon className={className} aria-hidden />;
  if (contentType === "text/css") return <Type className={className} aria-hidden />;
  return <FileText className={className} aria-hidden />;
}

interface AssetCardProps {
  asset: BrandAsset;
  /** Show the asset's gating badge (employees/admins; read-only here). */
  showVisibility?: boolean;
  /** Opens a larger preview when the thumbnail is clicked. */
  onPreview?: () => void;
  className?: string;
}

/** Catalog card: preview, metadata badges, and a direct download action. */
export function AssetCard({
  asset,
  showVisibility = false,
  onPreview,
  className,
}: AssetCardProps) {
  const t = useTranslations("assets");
  const previewImage = asset.previewUrl ? (
    <Image
      src={asset.previewUrl}
      alt={asset.title}
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
            aria-label={asset.title}
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
          <PreviewFallbackIcon contentType={asset.file.contentType} />
        )}
        {showVisibility ? (
          <Badge
            variant={asset.visibility === "public" ? "success-soft" : "warning-soft"}
            className="pointer-events-none absolute start-2 top-2 z-10 gap-1"
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
          <Badge variant="secondary" className="shrink-0">
            {fileExtension(asset.file.fileName)}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-sm">
          {asset.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2 p-4 pt-0">
        <span className="text-xs text-muted-foreground">
          {formatFileSize(asset.file.sizeBytes)}
        </span>
        <Button
          variant="accent-brand"
          size="sm"
          icon={<Download aria-hidden />}
          href={downloadHrefForAsset(asset)}
        >
          {t("download")}
        </Button>
      </CardFooter>
    </Card>
  );
}
