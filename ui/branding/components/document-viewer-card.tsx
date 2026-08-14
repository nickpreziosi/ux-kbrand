"use client";

import * as React from "react";
import {
  Button,
  Card,
  CardContent,
  Skeleton,
  cn,
  formatFileSize,
} from "@k-lab/components";
import { Download, ExternalLink, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { assetDownloadHref } from "@/ui/brand-assets/lib/asset-download-href";

interface DocumentViewerCardProps {
  asset?: BrandAsset;
  loading?: boolean;
  /** Renders the inline preview frame; off for compact reference cards. */
  showPreview?: boolean;
  className?: string;
}

/**
 * The complete brand guidelines document stays the source of truth — the
 * portal embeds it for reading and offers a download rather than converting
 * it into web content.
 */
export function DocumentViewerCard({
  asset,
  loading = false,
  showPreview = true,
  className,
}: DocumentViewerCardProps) {
  const t = useTranslations("branding.document");

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-full max-w-md" />
          {showPreview ? <Skeleton className="aspect-[4/3] w-full" /> : null}
        </CardContent>
      </Card>
    );
  }

  if (!asset) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">{t("unavailable")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-app-radius bg-secondary">
              <FileText className="h-5 w-5 text-accent-brand" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <h3 className="text-lg font-semibold leading-snug">{asset.title}</h3>
              <p className="text-sm text-muted-foreground">{asset.description}</p>
              <p className="text-xs text-muted-foreground">
                {asset.file.fileName} · {formatFileSize(asset.file.sizeBytes)} ·{" "}
                {t("updated", {
                  date: new Date(asset.updatedAt).toLocaleDateString(),
                })}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              icon={<ExternalLink aria-hidden />}
              href={asset.file.downloadUrl}
              target="_blank"
              rel="noopener"
            >
              {t("view")}
            </Button>
            <Button
              variant="accent-brand"
              icon={<Download aria-hidden />}
              href={assetDownloadHref(asset)}
            >
              {t("download")}
            </Button>
          </div>
        </div>

        {showPreview ? (
          <div className="overflow-hidden rounded-app-radius border border-border bg-secondary">
            <object
              data={asset.file.downloadUrl}
              type={asset.file.contentType}
              aria-label={asset.title}
              className="h-[70vh] max-h-[860px] min-h-[420px] w-full"
            >
              <div className="flex flex-col items-center gap-3 p-10 text-center">
                <p className="text-sm text-muted-foreground">{t("previewFallback")}</p>
                <Button
                  variant="outline"
                  href={asset.file.downloadUrl}
                  target="_blank"
                  rel="noopener"
                >
                  {t("openInNewTab")}
                </Button>
              </div>
            </object>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
