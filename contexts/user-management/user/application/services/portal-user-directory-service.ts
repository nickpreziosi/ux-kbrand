import type {
  InvitePortalUserInput,
  PortalRole,
  PortalUser,
  PortalUserStatus,
} from "@/contexts/user-management/user/domain/models/portal-user.model";
import type { PortalUserRepository } from "@/contexts/user-management/user/domain/repositories/portalUserRepository.interface";

/** Directory operations for the admin area + role resolution for the session. */
export class PortalUserDirectoryService {
  constructor(private readonly users: PortalUserRepository) {}

  list(): Promise<PortalUser[]> {
    return this.users.list();
  }

  /**
   * Resolve the signed-in Firebase user to a portal record. Unknown but
   * authenticated emails default to an active employee (the dev pool is
   * trusted); disabled records resolve to null so gating still applies.
   */
  async resolveByEmail(email: string): Promise<PortalUser | null> {
    const user = await this.users.getByEmail(email);
    if (user) {
      return user.status === "disabled" ? null : user;
    }
    const now = new Date().toISOString();
    return {
      id: `usr-session-${email.toLowerCase()}`,
      displayName: email.split("@")[0],
      email,
      role: "employee",
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
  }

  invite(input: InvitePortalUserInput): Promise<PortalUser> {
    return this.users.invite(input);
  }

  updateRole(id: string, role: PortalRole): Promise<PortalUser> {
    return this.users.updateRole(id, role);
  }

  setStatus(id: string, status: PortalUserStatus): Promise<PortalUser> {
    return this.users.setStatus(id, status);
  }

  remove(id: string): Promise<void> {
    return this.users.remove(id);
  }
}
