import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerPortalUserRepository } from "@/contexts/user-management/user/application/user-management-user-server-services";
import { jsonError, resolveApiViewer } from "@/lib/api/viewer";

/**
 * Directory lookup by email — backs the client-side role resolution
 * (`PortalUserDirectoryService.resolveByEmail`). Signed-in only; anonymous
 * visitors never resolve a role.
 */
export async function GET(request: NextRequest) {
  const viewer = await resolveApiViewer(request);
  if (viewer.role === "public") {
    return jsonError("errors.api.unauthorized", 401);
  }

  const email = request.nextUrl.searchParams.get("email")?.trim();
  if (!email) return jsonError("errors.api.invalidRequest", 400);

  const user = await getServerPortalUserRepository().getByEmail(email);
  return NextResponse.json({ user });
}
