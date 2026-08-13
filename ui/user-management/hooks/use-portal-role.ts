"use client";

import * as React from "react";
import type { PortalUser } from "@/contexts/user-management/user/domain/models/portal-user.model";
import type { ViewerRole } from "@/contexts/shared/domain/viewer-role";
import { portalUserDirectoryService } from "@/contexts/user-management/user/application/user-management-user-client-services";
import { useAuth } from "@/ui/user-management/auth/auth-provider";
import {
  readDevRoleOverride,
  subscribeDevRoleOverride,
} from "@/ui/user-management/dev/dev-role-override";

const getServerDevRoleOverride = () => null;

/**
 * Resolves the signed-in Firebase user to a portal record (role + status).
 * Anonymous visitors resolve to null with loading=false; their effective
 * viewerRole is "public" (the logged-out state — see asset-access rules).
 *
 * On dev builds the DevRoleSwitcher may override the effective viewerRole
 * (and everything derived from it) to preview the portal as another role;
 * portalUser/role keep reporting the real directory record.
 */
export function usePortalRole() {
  const { user, loading: authLoading } = useAuth();
  const [portalUser, setPortalUser] = React.useState<PortalUser | null>(null);
  const [resolving, setResolving] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    if (authLoading) return;
    if (!user?.email) {
      setPortalUser(null);
      return;
    }
    setResolving(true);
    void portalUserDirectoryService
      .resolveByEmail(user.email)
      .then((resolved) => {
        if (!cancelled) setPortalUser(resolved);
      })
      .catch(() => {
        if (!cancelled) setPortalUser(null);
      })
      .finally(() => {
        if (!cancelled) setResolving(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authLoading, user?.email]);

  const devRoleOverride = React.useSyncExternalStore(
    subscribeDevRoleOverride,
    readDevRoleOverride,
    getServerDevRoleOverride,
  );

  const actualViewerRole: ViewerRole = portalUser?.role ?? "public";
  const viewerRole: ViewerRole = devRoleOverride ?? actualViewerRole;

  return {
    portalUser,
    role: portalUser?.role ?? null,
    /** Effective role for gating: "public" until a signed-in user resolves. */
    viewerRole,
    /** The real resolved role, ignoring any dev override. */
    actualViewerRole,
    /** Non-null only when the DevRoleSwitcher is mocking a role (dev builds). */
    devRoleOverride,
    isAdmin: viewerRole === "admin",
    isEmployee: viewerRole === "employee",
    loading: authLoading || resolving,
  };
}
