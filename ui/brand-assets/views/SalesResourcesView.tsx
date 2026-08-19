"use client";

import * as React from "react";
import { Presentation } from "lucide-react";
import { SALES_CATEGORIES } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { ResourceLibraryView } from "@/ui/brand-assets/views/resource-library-view";

export function SalesResourcesView() {
  return (
    <ResourceLibraryView
      resourceType="sales"
      categories={SALES_CATEGORIES}
      headerNamespace="sales"
      icon={<Presentation className="h-8 w-8" aria-hidden />}
    />
  );
}
