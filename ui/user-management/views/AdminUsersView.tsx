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
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  DataTableShell,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FloatingLabelInput,
  PageHeader,
  getInitials,
} from "@k-lab/components";
import {
  MoreHorizontal,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  UserX,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type {
  PortalRole,
  PortalUser,
} from "@/contexts/user-management/user/domain/models/portal-user.model";
import { useUserAdmin } from "@/ui/user-management/hooks/use-user-admin";
import { readFloatingLabelInputValue } from "@/ui/shared/lib/floating-label-input-value";

function RoleBadge({ role, label }: { role: PortalRole; label: string }) {
  return role === "admin" ? (
    <Badge variant="accent-brand-soft">{label}</Badge>
  ) : (
    <Badge variant="secondary">{label}</Badge>
  );
}

export function AdminUsersView() {
  const t = useTranslations("adminUsers");
  const { users, loading, mutating, inviteUser, updateRole, setStatus, removeUser } =
    useUserAdmin();

  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [inviteName, setInviteName] = React.useState("");
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<PortalRole>("employee");
  const [inviteError, setInviteError] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState<PortalUser | undefined>(undefined);

  React.useEffect(() => {
    if (!inviteOpen) return;
    setInviteName("");
    setInviteEmail("");
    setInviteRole("employee");
    setInviteError(null);
  }, [inviteOpen]);

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      setInviteError(t("invite.fieldsRequired"));
      return;
    }
    try {
      await inviteUser({
        displayName: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      toast.success(t("toasts.invited"));
      setInviteOpen(false);
    } catch (err) {
      setInviteError(
        err instanceof Error && err.message === "errors.users.emailExists"
          ? t("invite.emailExists")
          : t("toasts.saveFailed"),
      );
    }
  };

  const handleRoleToggle = async (user: PortalUser) => {
    try {
      const nextRole: PortalRole = user.role === "admin" ? "employee" : "admin";
      await updateRole(user.id, nextRole);
      toast.success(t("toasts.roleUpdated"));
    } catch {
      toast.error(t("toasts.saveFailed"));
    }
  };

  const handleStatusToggle = async (user: PortalUser) => {
    try {
      const nextStatus = user.status === "disabled" ? "active" : "disabled";
      await setStatus(user.id, nextStatus);
      toast.success(
        nextStatus === "disabled" ? t("toasts.disabled") : t("toasts.enabled"),
      );
    } catch {
      toast.error(t("toasts.saveFailed"));
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await removeUser(deleting.id);
      toast.success(t("toasts.deleted"));
    } catch {
      toast.error(t("toasts.saveFailed"));
    } finally {
      setDeleting(undefined);
    }
  };

  const columns = React.useMemo<ColumnDef<PortalUser, unknown>[]>(
    () => [
      {
        accessorKey: "displayName",
        header: t("columns.name"),
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getInitials(row.original.displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">{row.original.displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: t("columns.role"),
        cell: ({ row }) => (
          <RoleBadge role={row.original.role} label={t(`roles.${row.original.role}`)} />
        ),
      },
      {
        accessorKey: "status",
        header: t("columns.status"),
        cell: ({ row }) => {
          const status = row.original.status;
          if (status === "active") {
            return <Badge variant="success-soft">{t("statuses.active")}</Badge>;
          }
          if (status === "invited") {
            return <Badge variant="warning-soft">{t("statuses.invited")}</Badge>;
          }
          return <Badge variant="destructive-soft">{t("statuses.disabled")}</Badge>;
        },
      },
      {
        accessorKey: "lastLoginAt",
        header: t("columns.lastLogin"),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.lastLoginAt
              ? new Date(row.original.lastLoginAt).toLocaleDateString()
              : t("neverLoggedIn")}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const user = row.original;
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
                <DropdownMenuItem onSelect={() => void handleRoleToggle(user)}>
                  <ShieldCheck className="me-2 h-4 w-4" aria-hidden />
                  {user.role === "admin" ? t("actions.makeEmployee") : t("actions.makeAdmin")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => void handleStatusToggle(user)}>
                  {user.status === "disabled" ? (
                    <>
                      <UserCheck className="me-2 h-4 w-4" aria-hidden />
                      {t("actions.enable")}
                    </>
                  ) : (
                    <>
                      <UserX className="me-2 h-4 w-4" aria-hidden />
                      {t("actions.disable")}
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => setDeleting(user)}
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
    [t, mutating],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<Users className="h-8 w-8" aria-hidden />}
        actions={
          <Button
            variant="accent-brand"
            icon={<UserPlus aria-hidden />}
            onClick={() => setInviteOpen(true)}
          >
            {t("inviteUser")}
          </Button>
        }
      />

      <DataTableShell
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage={t("emptyMessage")}
        getRowId={(user) => user.id}
      />

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("invite.title")}</DialogTitle>
            <DialogDescription>{t("invite.description")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <FloatingLabelInput
              label={t("invite.nameLabel")}
              value={inviteName}
              onChange={(e) => setInviteName(readFloatingLabelInputValue(e))}
              disabled={mutating}
              required
            />
            <FloatingLabelInput
              label={t("invite.emailLabel")}
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(readFloatingLabelInputValue(e))}
              disabled={mutating}
              required
            />
            <FloatingLabelInput
              label={t("invite.roleLabel")}
              type="select"
              selectOptions={[
                { value: "employee", label: t("roles.employee") },
                { value: "admin", label: t("roles.admin") },
              ]}
              value={inviteRole}
              onChange={(e) =>
                setInviteRole(readFloatingLabelInputValue(e) as PortalRole)
              }
              disabled={mutating}
            />
            {inviteError ? <p className="text-sm text-destructive">{inviteError}</p> : null}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setInviteOpen(false)}
                disabled={mutating}
              >
                {t("invite.cancel")}
              </Button>
              <Button type="submit" variant="accent-brand" loading={mutating}>
                {t("invite.submit")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
              {t("deleteDialog.description", { name: deleting?.displayName ?? "" })}
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
