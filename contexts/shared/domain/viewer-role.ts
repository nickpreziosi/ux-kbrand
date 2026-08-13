import type { PortalRole } from "@/contexts/user-management/user/domain/models/portal-user.model";

/**
 * The effective role of whoever is looking at the portal right now.
 * "public" is the anonymous (logged-out) state — it has no PortalUser record;
 * the other two come from the signed-in user's directory entry.
 */
export type ViewerRole = "public" | PortalRole;
