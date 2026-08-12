/**
 * Portal roles. Public visitors have no record — a PortalUser exists only for
 * authenticated K Lab people. Admins additionally manage assets and users.
 */
export type PortalRole = "employee" | "admin";

/** invited = record exists, first sign-in pending. disabled = access revoked. */
export type PortalUserStatus = "active" | "invited" | "disabled";

/**
 * Maps 1:1 to a Firestore `users/{id}` document keyed by the Firebase Auth
 * uid once integrated (mock records use seed ids until then; the directory
 * resolves the signed-in user by email).
 */
export interface PortalUser {
  id: string;
  displayName: string;
  email: string;
  role: PortalRole;
  status: PortalUserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface InvitePortalUserInput {
  displayName: string;
  email: string;
  role: PortalRole;
}
