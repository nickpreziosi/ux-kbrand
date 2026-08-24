"use client";

import * as React from "react";
import { Images } from "lucide-react";
import { PUBLIC_CATEGORIES } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { ResourceLibraryView } from "@/ui/brand-assets/views/resource-library-view";

export function AssetLibraryView() {
  return (
    <ResourceLibraryView
      resourceType="brand"
      categories={PUBLIC_CATEGORIES}
      headerNamespace="assetLibrary"
      icon={<Images className="h-8 w-8" aria-hidden />}
    />
  );
}
