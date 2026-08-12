import type {
  InvitePortalUserInput,
  PortalRole,
  PortalUser,
  PortalUserStatus,
} from "@/contexts/user-management/user/domain/models/portal-user.model";

export interface PortalUserRepository {
  list(): Promise<PortalUser[]>;
  getByEmail(email: string): Promise<PortalUser | null>;
  invite(input: InvitePortalUserInput): Promise<PortalUser>;
  updateRole(id: string, role: PortalRole): Promise<PortalUser>;
  setStatus(id: string, status: PortalUserStatus): Promise<PortalUser>;
  remove(id: string): Promise<void>;
}
