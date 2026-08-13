"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@k-lab/components";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

interface AssetPreviewDialogProps {
  asset: BrandAsset | null;
  /** Group title, when the thumbnail stands for a multi-format group. */
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Larger, uncropped view of a catalog thumbnail. */
export function AssetPreviewDialog({
  asset,
  title,
  open,
  onOpenChange,
}: AssetPreviewDialogProps) {
  const previewUrl = asset?.previewUrl;
  const label = title ?? asset?.title ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="w-fit max-w-[90vw] gap-0 border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-[90vw]"
        closeClassName="bg-black/50 text-white hover:bg-black/70 hover:text-white"
      >
        {asset && previewUrl ? (
          <>
            <DialogTitle className="sr-only">{label}</DialogTitle>
            <Image
              src={previewUrl}
              alt={label}
              width={1920}
              height={1080}
              unoptimized
              className="h-auto max-h-[85vh] w-auto max-w-[90vw] object-contain sm:rounded-md"
            />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
