"use client";

import type { ViewerRole } from "@/contexts/shared/domain/viewer-role";

/**
 * DEV-ONLY viewer-role override backing the DevRoleSwitcher. Lets anyone on a
 * dev build preview the portal as public / employee / admin without juggling
 * accounts. Persisted in localStorage so it survives reloads; a custom event
 * keeps every usePortalRole instance in sync. Inert in production builds:
 * readers always resolve to null and the switcher never mounts.
 */

const STORAGE_KEY = "kbrand.devRoleOverride";
const CHANGE_EVENT = "kbrand:dev-role-override";

export const DEV_ROLE_OVERRIDE_ENABLED = process.env.NODE_ENV === "development";

const VIEWER_ROLES: ViewerRole[] = ["public", "employee", "admin"];

function isViewerRole(value: string | null): value is ViewerRole {
  return value !== null && (VIEWER_ROLES as string[]).includes(value);
}

export function readDevRoleOverride(): ViewerRole | null {
  if (!DEV_ROLE_OVERRIDE_ENABLED || typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isViewerRole(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** Pass null to clear the override and return to the real resolved role. */
export function writeDevRoleOverride(role: ViewerRole | null): void {
  if (!DEV_ROLE_OVERRIDE_ENABLED || typeof window === "undefined") return;
  try {
    if (role === null) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, role);
    }
  } catch {
    // Storage unavailable (private mode); the in-page event still applies it.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** useSyncExternalStore subscribe — also follows changes from other tabs. */
export function subscribeDevRoleOverride(onChange: () => void): () => void {
  if (!DEV_ROLE_OVERRIDE_ENABLED || typeof window === "undefined") {
    return () => undefined;
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
