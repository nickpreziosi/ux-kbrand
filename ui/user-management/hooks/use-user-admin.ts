"use client";

import * as React from "react";
import type {
  InvitePortalUserInput,
  PortalRole,
  PortalUser,
  PortalUserStatus,
} from "@/contexts/user-management/user/domain/models/portal-user.model";
import { portalUserDirectoryService } from "@/contexts/user-management/user/application/user-management-user-client-services";

export function useUserAdmin() {
  const [users, setUsers] = React.useState<PortalUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [mutating, setMutating] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setUsers(await portalUserDirectoryService.list());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "errors.users.loadFailed");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const runMutation = React.useCallback(
    async <T,>(operation: () => Promise<T>): Promise<T> => {
      setMutating(true);
      try {
        const result = await operation();
        await refresh();
        return result;
      } finally {
        setMutating(false);
      }
    },
    [refresh],
  );

  const inviteUser = React.useCallback(
    (input: InvitePortalUserInput) =>
      runMutation(() => portalUserDirectoryService.invite(input)),
    [runMutation],
  );

  const updateRole = React.useCallback(
    (id: string, role: PortalRole) =>
      runMutation(() => portalUserDirectoryService.updateRole(id, role)),
    [runMutation],
  );

  const setStatus = React.useCallback(
    (id: string, status: PortalUserStatus) =>
      runMutation(() => portalUserDirectoryService.setStatus(id, status)),
    [runMutation],
  );

  const removeUser = React.useCallback(
    (id: string) => runMutation(() => portalUserDirectoryService.remove(id)),
    [runMutation],
  );

  return {
    users,
    loading,
    mutating,
    loadError,
    refresh,
    inviteUser,
    updateRole,
    setStatus,
    removeUser,
  };
}
