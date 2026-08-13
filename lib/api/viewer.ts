import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { PortalUser } from "@/contexts/user-management/user/domain/models/portal-user.model";
import type { ViewerRole } from "@/contexts/shared/domain/viewer-role";
import { canManageAssets, canManageUsers } from "@/contexts/brand-assets/domain";
import { getServerPortalUserDirectoryService } from "@/contexts/user-management/user/application/user-management-user-server-services";
import { PRESENCE_COOKIE_NAME } from "@/lib/auth/presence-cookie";
import { readSessionEmail } from "@/lib/auth/session-email-cookie";
import { PLATFORM_PRESENCE_COOKIE } from "@/lib/platform-auth/constants";
import { isPlatformDeployment } from "@/lib/platform-auth/deployment-profile";

export interface ApiViewer {
  role: ViewerRole;
  /** Directory record when the session email resolves to one (null for anonymous). */
  user: PortalUser | null;
}

export function jsonError(key: string, status: number): NextResponse {
  return NextResponse.json({ error: key }, { status });
}

function hasPresence(request: NextRequest): boolean {
  return isPlatformDeployment()
    ? request.cookies.get(PLATFORM_PRESENCE_COOKIE)?.value === "1"
    : request.cookies.get(PRESENCE_COOKIE_NAME)?.value === "1";
}

/**
 * Resolves the request to a viewer role for the mock HTTP backend, mirroring
 * the client-side rules: no presence cookie → "public"; presence without an
 * identifiable email → plain employee; otherwise the directory record decides
 * (disabled records drop back to "public").
 */
export async function resolveApiViewer(request: NextRequest): Promise<ApiViewer> {
  if (!hasPresence(request)) return { role: "public", user: null };

  const email = readSessionEmail(request);
  if (!email) return { role: "employee", user: null };

  const user = await getServerPortalUserDirectoryService().resolveByEmail(email);
  if (!user) return { role: "public", user: null };
  return { role: user.role, user };
}

/** 401 for anonymous requests, 403 for signed-in non-admins, null when allowed. */
export function denyUnlessAssetManager(viewer: ApiViewer): NextResponse | null {
  if (canManageAssets(viewer.role)) return null;
  return viewer.role === "public"
    ? jsonError("errors.api.unauthorized", 401)
    : jsonError("errors.api.forbidden", 403);
}

export function denyUnlessUserManager(viewer: ApiViewer): NextResponse | null {
  if (canManageUsers(viewer.role)) return null;
  return viewer.role === "public"
    ? jsonError("errors.api.unauthorized", 401)
    : jsonError("errors.api.forbidden", 403);
}
