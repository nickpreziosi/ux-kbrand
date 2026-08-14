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
import {
  assetFormat,
  groupBrandAssets,
  type AssetGroup,
} from "@/contexts/brand-assets/domain/services/asset-grouping";
import {
  EMPTY_ASSET_GROUP_FILTER,
  filterAssetGroups,
  hasActiveAssetGroupFilter,
  type AssetGroupFilter,
} from "@/contexts/brand-assets/domain/services/asset-filtering";
import { AssetTableToolbar } from "@/ui/brand-assets/components/asset-table-toolbar";
import { useAssetAdmin } from "@/ui/brand-assets/hooks/use-asset-admin";
import { usePortalRole } from "@/ui/user-management/hooks/use-portal-role";
import { groupDownloadHref } from "@/ui/brand-assets/lib/asset-download-href";
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
    createAssetGroup,
    saveAssetGroup,
    setGroupVisibility,
    setGroupArchived,
    removeAssetGroup,
  } = useAssetAdmin();
  const { portalUser } = usePortalRole();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AssetGroup | undefined>(
    undefined,
  );
  const [deleting, setDeleting] = React.useState<AssetGroup | undefined>(
    undefined,
  );

  const [filter, setFilter] = React.useState<AssetGroupFilter>(
    EMPTY_ASSET_GROUP_FILTER,
  );

  // One row per artwork, not per file — the admin edits the same unit a
  // visitor downloads, so adding a format never means hunting for siblings.
  const groups = React.useMemo(() => groupBrandAssets(assets), [assets]);
  const visibleGroups = React.useMemo(
    () => filterAssetGroups(groups, filter),
    [groups, filter],
  );

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (group: AssetGroup) => {
    setEditing(group);
    setFormOpen(true);
  };

  const handleSubmit = async (values: AssetFormValues) => {
    try {
      if (editing) {
        await saveAssetGroup(editing.id, {
          title: values.title,
          description: values.description,
          category: values.category,
          visibility: values.visibility,
          tags: values.tags,
          addFiles: values.addFiles,
          removeAssetIds: values.removeAssetIds,
        });
        toast.success(t("toasts.updated"));
      } else {
        await createAssetGroup({
          title: values.title,
          description: values.description,
          category: values.category,
          visibility: values.visibility,
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

  const handleVisibilityToggle = async (group: AssetGroup) => {
    try {
      await setGroupVisibility(
        group.id,
        group.visibility === "public" ? "employee" : "public",
      );
      toast.success(t("toasts.visibilityUpdated"));
    } catch {
      toast.error(t("toasts.saveFailed"));
    }
  };

  const handleArchiveToggle = async (group: AssetGroup) => {
    try {
      const archived = group.status !== "archived";
      await setGroupArchived(group.id, archived);
      toast.success(archived ? t("toasts.archived") : t("toasts.restored"));
    } catch {
      toast.error(t("toasts.saveFailed"));
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await removeAssetGroup(deleting.id);
      toast.success(t("toasts.deleted"));
    } catch {
      toast.error(t("toasts.saveFailed"));
    } finally {
      setDeleting(undefined);
    }
  };

  const columns = React.useMemo<ColumnDef<AssetGroup, unknown>[]>(
    () => [
      {
        accessorKey: "title",
        header: t("columns.title"),
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate font-medium">{row.original.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.assets.length > 1
                ? t("fileCount", { count: row.original.assets.length })
                : row.original.preview.file.fileName}
            </p>
          </div>
        ),
      },
      {
        id: "formats",
        header: t("columns.formats"),
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.assets.map((asset) => (
              <Badge
                key={asset.id}
                variant="outline"
                className="font-semibold uppercase"
              >
                {assetFormat(asset) ?? "file"}
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
            {formatFileSize(row.original.totalBytes)}
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
          const group = row.original;
          const multiFormat = group.assets.length > 1;
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
                <DropdownMenuItem onSelect={() => openEdit(group)}>
                  <Pencil className="me-2 h-4 w-4" aria-hidden />
                  {multiFormat ? t("actions.editFormats") : t("actions.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={groupDownloadHref(group)}
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
                  onSelect={() => void handleVisibilityToggle(group)}
                >
                  {group.visibility === "public" ? (
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
                  onSelect={() => void handleArchiveToggle(group)}
                >
                  {group.status === "archived" ? (
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
                  onSelect={() => setDeleting(group)}
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
          data={visibleGroups}
          loading={loading}
          emptyMessage={
            hasActiveAssetGroupFilter(filter)
              ? t("filters.emptyMessage")
              : t("emptyMessage")
          }
          getRowId={(group) => group.id}
          // Narrowing while on page 3 would otherwise land on an empty page.
          resetPageKey={JSON.stringify(filter)}
          toolbar={
            <AssetTableToolbar
              filter={filter}
              onFilterChange={setFilter}
              resultCount={visibleGroups.length}
              totalCount={groups.length}
              disabled={loading}
            />
          }
        />
      )}

      <AssetFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        group={editing}
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
                count: deleting?.assets.length ?? 0,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutating}>
              {t("deleteDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleDelete()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
