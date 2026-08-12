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
import { Download, FileText, Image as ImageIcon, Type } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

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
  className?: string;
}

/** Catalog card: preview, metadata badges, and a direct download action. */
export function AssetCard({ asset, className }: AssetCardProps) {
  const t = useTranslations("assets");

  return (
    <Card className={cn("flex h-full flex-col overflow-hidden", className)}>
      <div className="relative flex aspect-video items-center justify-center border-b border-border bg-secondary">
        {asset.previewUrl ? (
          <Image
            src={asset.previewUrl}
            alt={asset.title}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <PreviewFallbackIcon contentType={asset.file.contentType} />
        )}
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
          href={asset.file.downloadUrl}
          target="_blank"
          rel="noopener"
        >
          {t("download")}
        </Button>
      </CardFooter>
    </Card>
  );
}
