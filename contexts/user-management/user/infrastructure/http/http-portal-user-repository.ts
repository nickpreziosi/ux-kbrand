import type {
  InvitePortalUserInput,
  PortalRole,
  PortalUser,
  PortalUserStatus,
} from "@/contexts/user-management/user/domain/models/portal-user.model";
import type { PortalUserRepository } from "@/contexts/user-management/user/domain/repositories/portalUserRepository.interface";
import { fetchJson } from "@/contexts/shared/infrastructure/http/fetch-json";

/** Talks to the mock HTTP backend (app/api/users); Firestore replaces it later. */
export class HttpPortalUserRepository implements PortalUserRepository {
  async list(): Promise<PortalUser[]> {
    const { users } = await fetchJson<{ users: PortalUser[] }>("/api/users");
    return users;
  }

  async getByEmail(email: string): Promise<PortalUser | null> {
    const { user } = await fetchJson<{ user: PortalUser | null }>(
      `/api/users/lookup?email=${encodeURIComponent(email)}`,
    );
    return user;
  }

  async invite(input: InvitePortalUserInput): Promise<PortalUser> {
    const { user } = await fetchJson<{ user: PortalUser }>("/api/users", {
      method: "POST",
      json: input,
    });
    return user;
  }

  async updateRole(id: string, role: PortalRole): Promise<PortalUser> {
    const { user } = await fetchJson<{ user: PortalUser }>(
      `/api/users/${encodeURIComponent(id)}`,
      { method: "PATCH", json: { role } },
    );
    return user;
  }

  async setStatus(id: string, status: PortalUserStatus): Promise<PortalUser> {
    const { user } = await fetchJson<{ user: PortalUser }>(
      `/api/users/${encodeURIComponent(id)}`,
      { method: "PATCH", json: { status } },
    );
    return user;
  }

  async remove(id: string): Promise<void> {
    await fetchJson<{ ok: boolean }>(`/api/users/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }
}
