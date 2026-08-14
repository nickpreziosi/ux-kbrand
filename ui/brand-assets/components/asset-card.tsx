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
  /** One artwork and every format it ships in (single-file assets are a group of one). */
  group: AssetGroup;
  /** Show the group's gating badge (employees/admins; read-only here). */
  showVisibility?: boolean;
  /** Opens a larger preview when the thumbnail is clicked. */
  onPreview?: () => void;
  /** Eager-load this thumbnail — set on the first grid card, which is often LCP. */
  priority?: boolean;
  className?: string;
}

/**
 * Catalog card for one artwork. Every format lands in one Download menu (and a
 * zip of the lot when there is more than one), so a second file on the same
 * group appears without a UI change.
 */
export function AssetCard({
  group,
  showVisibility = false,
  onPreview,
  priority = false,
  className,
}: AssetCardProps) {
  const t = useTranslations("assets");
  const { preview, assets } = group;
  const multiFormat = assets.length > 1;
  // Lockups (transparent wordmarks) must fit inside the frame; product shots
  // and imagery fill it, same as the rest of the catalog.
  const coverPreview =
    group.category !== "logos" || group.tags.includes("product");

  const previewImage = preview.previewUrl ? (
    <Image
      src={preview.previewUrl}
      alt={group.title}
      fill
      unoptimized
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      className={cn(
        coverPreview ? "object-cover" : "object-contain",
        onPreview && "transition-transform duration-200 group-hover:scale-[1.03]",
      )}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    />
  ) : null;

  return (
    <Card className={cn("flex h-full flex-col overflow-hidden", className)}>
      <div
        className={cn(
          "relative flex aspect-video items-center justify-center overflow-hidden border-b border-border bg-secondary",
          onPreview && "group",
        )}
      >
        {previewImage ? (
          <>
            <div
              className={cn(
                "absolute",
                coverPreview ? "inset-0" : "inset-6",
              )}
            >
              {previewImage}
            </div>
            {onPreview ? (
              <button
                type="button"
                onClick={onPreview}
                className="absolute inset-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                aria-label={group.title}
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
          <Badge variant="accent-brand-soft" className="shrink-0">
            {t(
              assets.length === 1 ? "fileCount.one" : "fileCount.other",
              { count: assets.length },
            )}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-sm">
          {group.description}
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
            {assets.map((asset) => (
              <DropdownMenuItem key={asset.id} asChild>
                <a
                  href={assetDownloadHref(asset)}
                  className="flex items-center gap-1.5"
                  aria-label={t("downloadFormat", {
                    format: formatLabel(asset),
                  })}
                >
                  <FormatSizeLabel
                    label={formatLabel(asset)}
                    sizeBytes={asset.file.sizeBytes}
                  />
                </a>
              </DropdownMenuItem>
            ))}
            {multiFormat ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a
                    href={brandBundleUrl(group.id)}
                    className="flex items-center gap-1.5"
                    aria-label={t("downloadAll")}
                  >
                    <FormatSizeLabel
                      label={
                        t.has("downloadAllOption")
                          ? t("downloadAllOption")
                          : t("downloadAll")
                      }
                      sizeBytes={group.totalBytes}
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
