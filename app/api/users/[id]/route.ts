import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type {
  PortalRole,
  PortalUserStatus,
} from "@/contexts/user-management/user/domain/models/portal-user.model";
import { getServerPortalUserDirectoryService } from "@/contexts/user-management/user/application/user-management-user-server-services";
import {
  denyUnlessUserManager,
  jsonError,
  resolveApiViewer,
} from "@/lib/api/viewer";
import { isRecord } from "@/contexts/shared/domain/is-record";

type RouteContext = { params: Promise<{ id: string }> };

function isPortalRole(value: unknown): value is PortalRole {
  return value === "employee" || value === "admin";
}

function isPortalUserStatus(value: unknown): value is PortalUserStatus {
  return value === "active" || value === "invited" || value === "disabled";
}

function mapKnownError(err: unknown): NextResponse {
  if (err instanceof Error && err.message === "errors.users.notFound") {
    return jsonError(err.message, 404);
  }
  return jsonError("errors.api.requestFailed", 500);
}

/** Admin role/status change: body is `{ role }` or `{ status }`. */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const viewer = await resolveApiViewer(request);
  const denied = denyUnlessUserManager(viewer);
  if (denied) return denied;

  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body)) return jsonError("errors.api.invalidRequest", 400);

  try {
    const directory = getServerPortalUserDirectoryService();
    if (isPortalRole(body.role)) {
      const user = await directory.updateRole(id, body.role);
      return NextResponse.json({ user });
    }
    if (isPortalUserStatus(body.status)) {
      const user = await directory.setStatus(id, body.status);
      return NextResponse.json({ user });
    }
    return jsonError("errors.api.invalidRequest", 400);
  } catch (err) {
    return mapKnownError(err);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const viewer = await resolveApiViewer(request);
  const denied = denyUnlessUserManager(viewer);
  if (denied) return denied;

  try {
    await getServerPortalUserDirectoryService().remove(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return mapKnownError(err);
  }
}
