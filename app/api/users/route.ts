import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type {
  InvitePortalUserInput,
  PortalRole,
} from "@/contexts/user-management/user/domain/models/portal-user.model";
import { getServerPortalUserDirectoryService } from "@/contexts/user-management/user/application/user-management-user-server-services";
import {
  denyUnlessUserManager,
  jsonError,
  resolveApiViewer,
} from "@/lib/api/viewer";
import { isRecord } from "@/contexts/shared/domain/is-record";

function isPortalRole(value: unknown): value is PortalRole {
  return value === "employee" || value === "admin";
}

/** Mock HTTP backend — admin user directory. */
export async function GET(request: NextRequest) {
  const viewer = await resolveApiViewer(request);
  const denied = denyUnlessUserManager(viewer);
  if (denied) return denied;

  const users = await getServerPortalUserDirectoryService().list();
  return NextResponse.json({ users });
}

/** Admin invite. */
export async function POST(request: NextRequest) {
  const viewer = await resolveApiViewer(request);
  const denied = denyUnlessUserManager(viewer);
  if (denied) return denied;

  const body: unknown = await request.json().catch(() => null);
  if (
    !isRecord(body) ||
    typeof body.displayName !== "string" ||
    !body.displayName.trim() ||
    typeof body.email !== "string" ||
    !body.email.trim() ||
    !isPortalRole(body.role)
  ) {
    return jsonError("errors.api.invalidRequest", 400);
  }

  const input: InvitePortalUserInput = {
    displayName: body.displayName.trim(),
    email: body.email.trim(),
    role: body.role,
  };

  try {
    const user = await getServerPortalUserDirectoryService().invite(input);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "errors.users.emailExists") {
      return jsonError(err.message, 409);
    }
    return jsonError("errors.api.requestFailed", 500);
  }
}
