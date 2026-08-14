"use client";

import * as React from "react";
import { Button, FloatingLabelInput } from "@k-lab/components";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  ASSET_CATEGORIES,
  type AssetCategory,
} from "@/contexts/brand-assets/domain/models/asset-category.model";
import type {
  AssetStatus,
  AssetVisibility,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  ANY,
  EMPTY_ASSET_GROUP_FILTER,
  hasActiveAssetGroupFilter,
  type AssetGroupFilter,
} from "@/contexts/brand-assets/domain/services/asset-filtering";
import { readFloatingLabelInputValue } from "@/ui/shared/lib/floating-label-input-value";

interface AssetTableToolbarProps {
  filter: AssetGroupFilter;
  onFilterChange: (filter: AssetGroupFilter) => void;
  /** Rows left after filtering, out of the whole catalog. */
  resultCount: number;
  totalCount: number;
  disabled?: boolean;
}

/**
 * Search and facets for the manage-assets table. Filtering happens over the
 * grouped rows rather than through the table's own global filter, so a search
 * can reach the file names and formats folded inside a row — the table only
 * ever sees columns.
 */
export function AssetTableToolbar({
  filter,
  onFilterChange,
  resultCount,
  totalCount,
  disabled = false,
}: AssetTableToolbarProps) {
  const t = useTranslations("adminAssets.filters");
  const tAdmin = useTranslations("adminAssets");
  const tCategories = useTranslations("brand.categories");

  const set = <K extends keyof AssetGroupFilter>(
    key: K,
    value: AssetGroupFilter[K],
  ) => onFilterChange({ ...filter, [key]: value });

  const categoryOptions = React.useMemo(
    () => [
      { value: ANY, label: t("allCategories") },
      ...ASSET_CATEGORIES.map((value) => ({
        value,
        label: tCategories(`${value}.title`),
      })),
    ],
    [t, tCategories],
  );

  const visibilityOptions = React.useMemo(
    () => [
      { value: ANY, label: t("allVisibility") },
      { value: "public", label: tAdmin("visibility.public") },
      { value: "employee", label: tAdmin("visibility.employee") },
    ],
    [t, tAdmin],
  );

  const statusOptions = React.useMemo(
    () => [
      { value: ANY, label: t("allStatuses") },
      { value: "active", label: tAdmin("status.active") },
      { value: "archived", label: tAdmin("status.archived") },
    ],
    [t, tAdmin],
  );

  const active = hasActiveAssetGroupFilter(filter);

  return (
    <div className="@container space-y-4 pb-2">
      {/* Search takes the slack; the facets keep a fixed width and wrap onto
          their own line before they get too narrow to read. */}
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
                readFloatingLabelInputValue(e) as AssetCategory | typeof ANY,
              )
            }
            disabled={disabled}
          />
          <FloatingLabelInput
            type="select"
            className="w-full min-w-0 @lg:w-44"
            label={t("visibilityLabel")}
            selectOptions={visibilityOptions}
            value={filter.visibility}
            onChange={(e) =>
              set(
                "visibility",
                readFloatingLabelInputValue(e) as AssetVisibility | typeof ANY,
              )
            }
            disabled={disabled}
          />
          <FloatingLabelInput
            type="select"
            className="w-full min-w-0 @lg:w-44"
            label={t("statusLabel")}
            selectOptions={statusOptions}
            value={filter.status}
            onChange={(e) =>
              set(
                "status",
                readFloatingLabelInputValue(e) as AssetStatus | typeof ANY,
              )
            }
            disabled={disabled}
          />
        </div>
        <Button
          variant="outline"
          size="md"
          className="h-11 w-fit gap-1.5"
          onClick={() => onFilterChange(EMPTY_ASSET_GROUP_FILTER)}
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
