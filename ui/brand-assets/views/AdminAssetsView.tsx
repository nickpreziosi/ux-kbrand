"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  DataTableShell,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  formatFileSize,
} from "@k-lab/components";
import { KBrandPageHeader } from "@/ui/shared/components/k-brand-page-header";
import {
  Archive,
  ArchiveRestore,
  Download,
  FileArchive,
  FolderCog,
  Globe,
  Lock,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  assetTotalBytes,
  fileFormat,
  sortedFiles,
} from "@/contexts/brand-assets/domain/services/asset-files";
import {
  EMPTY_ASSET_GROUP_FILTER,
  filterCatalogAssets,
  hasActiveAssetCatalogFilter,
  type AssetCatalogFilter,
} from "@/contexts/brand-assets/domain/services/asset-filtering";
import { AssetTableToolbar } from "@/ui/brand-assets/components/asset-table-toolbar";
import { useAssetAdmin } from "@/ui/brand-assets/hooks/use-asset-admin";
import { usePortalRole } from "@/ui/user-management/hooks/use-portal-role";
import { assetBundleHref } from "@/ui/brand-assets/lib/asset-download-href";
import {
  AssetFormDialog,
  type AssetFormValues,
} from "@/ui/brand-assets/components/asset-form-dialog";

export function AdminAssetsView() {
  const t = useTranslations("adminAssets");
  const tCategories = useTranslations("brand.categories");
  const {
    assets,
    loading,
    loadError,
    mutating,
    createAsset,
    updateAsset,
    setVisibility,
    setArchived,
    removeAsset,
  } = useAssetAdmin();
  const { portalUser } = usePortalRole();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<BrandAsset | undefined>(undefined);
  const [deleting, setDeleting] = React.useState<BrandAsset | undefined>(undefined);
  const [filter, setFilter] = React.useState<AssetCatalogFilter>(
    EMPTY_ASSET_GROUP_FILTER,
  );

  const visibleAssets = React.useMemo(
    () => filterCatalogAssets(assets, filter),
    [assets, filter],
  );

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (asset: BrandAsset) => {
    setEditing(asset);
    setFormOpen(true);
  };

  const handleSubmit = async (values: AssetFormValues) => {
    try {
      if (editing) {
        await updateAsset(editing.id, {
          title: values.title,
          description: values.description,
          category: values.category,
          visibility: values.visibility,
          product: values.product,
          tags: values.tags,
          addFiles: values.addFiles,
          removeFileIds: values.removeFileIds,
        });
        toast.success(t("toasts.updated"));
      } else {
        await createAsset({
          title: values.title,
          description: values.description,
          category: values.category,
          visibility: values.visibility,
          product: values.product,
          tags: values.tags,
          files: values.addFiles,
          createdBy: portalUser?.id ?? "usr-unknown",
        });
        toast.success(t("toasts.created"));
      }
      setFormOpen(false);
    } catch {
      toast.error(t("toasts.saveFailed"));
    }
  };

  const handleVisibilityToggle = async (asset: BrandAsset) => {
    try {
      await setVisibility(
        asset.id,
        asset.visibility === "public" ? "employee" : "public",
      );
      toast.success(t("toasts.visibilityUpdated"));
    } catch {
      toast.error(t("toasts.saveFailed"));
    }
  };

  const handleArchiveToggle = async (asset: BrandAsset) => {
    try {
      const archived = asset.status !== "archived";
      await setArchived(asset.id, archived);
      toast.success(archived ? t("toasts.archived") : t("toasts.restored"));
    } catch {
      toast.error(t("toasts.saveFailed"));
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await removeAsset(deleting.id);
      toast.success(t("toasts.deleted"));
    } catch {
      toast.error(t("toasts.saveFailed"));
    } finally {
      setDeleting(undefined);
    }
  };

  const columns = React.useMemo<ColumnDef<BrandAsset, unknown>[]>(
    () => [
      {
        accessorKey: "title",
        header: t("columns.title"),
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate font-medium">{row.original.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.files.length > 1
                ? t("fileCount", { count: row.original.files.length })
                : row.original.files[0]?.fileName}
            </p>
          </div>
        ),
      },
      {
        id: "formats",
        header: t("columns.formats"),
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {sortedFiles(row.original.files).map((file) => (
              <Badge
                key={file.id}
                variant="outline"
                className="font-semibold uppercase"
              >
                {fileFormat(file) ?? "file"}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: t("columns.category"),
        cell: ({ row }) => (
          <Badge variant="secondary">
            {tCategories(`${row.original.category}.title`)}
          </Badge>
        ),
      },
      {
        accessorKey: "visibility",
        header: t("columns.visibility"),
        cell: ({ row }) =>
          row.original.visibility === "public" ? (
            <Badge variant="success-soft">{t("visibility.public")}</Badge>
          ) : (
            <Badge variant="warning-soft">{t("visibility.employee")}</Badge>
          ),
      },
      {
        accessorKey: "status",
        header: t("columns.status"),
        cell: ({ row }) =>
          row.original.status === "archived" ? (
            <Badge variant="outline">{t("status.archived")}</Badge>
          ) : (
            <Badge variant="accent-brand-soft">{t("status.active")}</Badge>
          ),
      },
      {
        id: "size",
        header: t("columns.size"),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatFileSize(assetTotalBytes(row.original))}
          </span>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: t("columns.updated"),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {new Date(row.original.updatedAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const asset = row.original;
          const multiFormat = asset.files.length > 1;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("actions.menuAriaLabel")}
                  disabled={mutating}
                >
                  <MoreHorizontal className="h-4 w-4" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => openEdit(asset)}>
                  <Pencil className="me-2 h-4 w-4" aria-hidden />
                  {multiFormat ? t("actions.editFormats") : t("actions.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={assetBundleHref(asset)}
                    target="_blank"
                    rel="noopener"
                  >
                    {multiFormat ? (
                      <FileArchive className="me-2 h-4 w-4" aria-hidden />
                    ) : (
                      <Download className="me-2 h-4 w-4" aria-hidden />
                    )}
                    {multiFormat
                      ? t("actions.downloadAll")
                      : t("actions.download")}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => void handleVisibilityToggle(asset)}
                >
                  {asset.visibility === "public" ? (
                    <>
                      <Lock className="me-2 h-4 w-4" aria-hidden />
                      {t("actions.makeEmployee")}
                    </>
                  ) : (
                    <>
                      <Globe className="me-2 h-4 w-4" aria-hidden />
                      {t("actions.makePublic")}
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => void handleArchiveToggle(asset)}
                >
                  {asset.status === "archived" ? (
                    <>
                      <ArchiveRestore className="me-2 h-4 w-4" aria-hidden />
                      {t("actions.restore")}
                    </>
                  ) : (
                    <>
                      <Archive className="me-2 h-4 w-4" aria-hidden />
                      {t("actions.archive")}
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => setDeleting(asset)}
                >
                  <Trash2 className="me-2 h-4 w-4" aria-hidden />
                  {t("actions.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, tCategories, mutating],
  );

  return (
    <div className="space-y-6">
      <KBrandPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<FolderCog className="h-8 w-8" aria-hidden />}
        actions={
          <Button
            variant="accent-brand"
            icon={<Plus aria-hidden />}
            onClick={openCreate}
          >
            {t("newAsset")}
          </Button>
        }
      />

      {loadError ? (
        <p className="text-sm text-destructive">{t("loadError")}</p>
      ) : (
        <DataTableShell
          columns={columns}
          data={visibleAssets}
          loading={loading}
          emptyMessage={
            hasActiveAssetCatalogFilter(filter)
              ? t("filters.emptyMessage")
              : t("emptyMessage")
          }
          getRowId={(asset) => asset.id}
          resetPageKey={JSON.stringify(filter)}
          toolbar={
            <AssetTableToolbar
              filter={filter}
              onFilterChange={setFilter}
              resultCount={visibleAssets.length}
              totalCount={assets.length}
              disabled={loading}
            />
          }
        />
      )}

      <AssetFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        asset={editing}
        submitting={mutating}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(undefined);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description", {
                title: deleting?.title ?? "",
                count: deleting?.files.length ?? 0,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutating}>
              {t("deleteDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleDelete()}
              className="bg-destructive text-foreground hover:bg-destructive/90"
            >
              {t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
