"use client";

import * as React from "react";
import { Button, FloatingLabelInput } from "@k-lab/components";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { PUBLIC_CATEGORIES } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { ASSET_PRODUCTS } from "@/contexts/brand-assets/domain/models/asset-product.model";
import { ASSET_FORMAT_ORDER } from "@/contexts/brand-assets/domain/services/asset-files";
import {
  ANY,
  EMPTY_LIBRARY_FILTER,
  hasActiveLibraryFilter,
  type LibraryFilter,
} from "@/contexts/brand-assets/domain/services/asset-filtering";
import { readFloatingLabelInputValue } from "@/ui/shared/lib/floating-label-input-value";

interface AssetLibraryToolbarProps {
  filter: LibraryFilter;
  onFilterChange: (filter: LibraryFilter) => void;
  resultCount: number;
  totalCount: number;
  disabled?: boolean;
}

/**
 * Search and facets for the public Asset Library (and the sales library).
 * resourceType is owned by the page, not this toolbar — it never appears here.
 */
export function AssetLibraryToolbar({
  filter,
  onFilterChange,
  resultCount,
  totalCount,
  disabled = false,
}: AssetLibraryToolbarProps) {
  const t = useTranslations("assetLibrary");
  const tCategories = useTranslations("brand.categories");

  const set = <K extends keyof LibraryFilter>(key: K, value: LibraryFilter[K]) =>
    onFilterChange({ ...filter, [key]: value });

  const categoryOptions = React.useMemo(
    () => [
      { value: ANY, label: t("allCategories") },
      ...PUBLIC_CATEGORIES.map((value) => ({
        value,
        label: tCategories(`${value}.title`),
      })),
    ],
    [t, tCategories],
  );

  const formatOptions = React.useMemo(
    () => [
      { value: ANY, label: t("allFormats") },
      ...ASSET_FORMAT_ORDER.map((value) => ({
        value,
        label: value.toUpperCase(),
      })),
    ],
    [t],
  );

  const productOptions = React.useMemo(
    () => [
      { value: ANY, label: t("allProducts") },
      ...ASSET_PRODUCTS.map((value) => ({
        value,
        label: t(`products.${value}`),
      })),
    ],
    [t],
  );

  const urlFilter = { ...filter, resourceType: ANY } as LibraryFilter;
  const active = hasActiveLibraryFilter(urlFilter);

  return (
    <div className="@container space-y-4 pb-2">
      <div className="flex flex-col gap-4 @lg:flex-row @lg:flex-wrap @lg:items-center">
        <div className="min-w-0 @lg:min-w-[18rem] @lg:flex-1">
          <FloatingLabelInput
            type="search"
            className="!w-full"
            label={t("searchLabel")}
            value={filter.search}
            onChange={(e) => set("search", readFloatingLabelInputValue(e))}
            onClear={() => set("search", "")}
            disabled={disabled}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-3">
          <FloatingLabelInput
            type="select"
            className="w-full min-w-0 @lg:w-44"
            label={t("categoryLabel")}
            selectOptions={categoryOptions}
            value={filter.category}
            onChange={(e) =>
              set(
                "category",
                readFloatingLabelInputValue(e) as LibraryFilter["category"],
              )
            }
            disabled={disabled}
          />
          <FloatingLabelInput
            type="select"
            className="w-full min-w-0 @lg:w-44"
            label={t("productLabel")}
            selectOptions={productOptions}
            value={filter.product}
            onChange={(e) =>
              set(
                "product",
                readFloatingLabelInputValue(e) as LibraryFilter["product"],
              )
            }
            disabled={disabled}
          />
          <FloatingLabelInput
            type="select"
            className="w-full min-w-0 @lg:w-44"
            label={t("formatLabel")}
            selectOptions={formatOptions}
            value={filter.format}
            onChange={(e) =>
              set("format", readFloatingLabelInputValue(e) as LibraryFilter["format"])
            }
            disabled={disabled}
          />
        </div>
        <Button
          variant="outline"
          size="md"
          className="h-11 w-fit gap-1.5"
          onClick={() =>
            onFilterChange({
              ...EMPTY_LIBRARY_FILTER,
              resourceType: filter.resourceType,
            })
          }
          disabled={disabled || !active}
          aria-label={t("clearAriaLabel")}
        >
          <X className="h-4 w-4" aria-hidden />
          {t("clear")}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {active
          ? t("resultCount", { count: resultCount, total: totalCount })
          : t("totalCount", { count: totalCount })}
      </p>
    </div>
  );
}