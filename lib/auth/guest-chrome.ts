import type { ViewerRole } from "@/contexts/shared/domain/viewer-role";

/** Public chrome (Sign in, no account menu) — guest cookie is not an identity. */
export function shouldShowGuestChrome({
  authLoading,
  user,
  viewerRole,
}: {
  authLoading: boolean;
  user: { uid: string } | null;
  viewerRole: ViewerRole;
}): boolean {
  return !authLoading && !user && viewerRole === "public";
}
