"use client";

import * as React from "react";
import type { PortalUser } from "@/contexts/user-management/user/domain/models/portal-user.model";
import { portalUserDirectoryService } from "@/contexts/user-management/user/application/user-management-user-client-services";
import { useAuth } from "@/ui/user-management/auth/auth-provider";

/**
 * Resolves the signed-in Firebase user to a portal record (role + status).
 * Anonymous visitors resolve to null with loading=false.
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

  return {
    portalUser,
    role: portalUser?.role ?? null,
    isAdmin: portalUser?.role === "admin",
    loading: authLoading || resolving,
  };
}
