import type {
  InvitePortalUserInput,
  PortalRole,
  PortalUser,
  PortalUserStatus,
} from "@/contexts/user-management/user/domain/models/portal-user.model";
import type { PortalUserRepository } from "@/contexts/user-management/user/domain/repositories/portalUserRepository.interface";
import { SEED_PORTAL_USERS } from "./seed-users";

const MOCK_LATENCY_MS = 250;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** In-memory directory; swaps for a Firestore `users` collection later. */
export class MockPortalUserRepository implements PortalUserRepository {
  private users: PortalUser[] = clone(SEED_PORTAL_USERS);
  private sequence = 0;

  /** Server-side (mock HTTP backend) passes 0 — the network already adds latency. */
  constructor(private readonly latencyMs: number = MOCK_LATENCY_MS) {}

  async list(): Promise<PortalUser[]> {
    await delay(this.latencyMs);
    return clone(this.users);
  }

  async getByEmail(email: string): Promise<PortalUser | null> {
    await delay(this.latencyMs);
    const normalized = email.trim().toLowerCase();
    const user = this.users.find((u) => u.email.toLowerCase() === normalized);
    return user ? clone(user) : null;
  }

  async invite(input: InvitePortalUserInput): Promise<PortalUser> {
    await delay(this.latencyMs);
    const normalized = input.email.trim().toLowerCase();
    if (this.users.some((u) => u.email.toLowerCase() === normalized)) {
      throw new Error("errors.users.emailExists");
    }
    const now = new Date().toISOString();
    const user: PortalUser = {
      id: `usr-local-${++this.sequence}-${Date.now()}`,
      displayName: input.displayName,
      email: input.email.trim(),
      role: input.role,
      status: "invited",
      createdAt: now,
      updatedAt: now,
    };
    this.users = [user, ...this.users];
    return clone(user);
  }

  async updateRole(id: string, role: PortalRole): Promise<PortalUser> {
    return this.patch(id, { role });
  }

  async setStatus(id: string, status: PortalUserStatus): Promise<PortalUser> {
    return this.patch(id, { status });
  }

  async remove(id: string): Promise<void> {
    await delay(this.latencyMs);
    if (!this.users.some((u) => u.id === id)) {
      throw new Error("errors.users.notFound");
    }
    this.users = this.users.filter((u) => u.id !== id);
  }

  private async patch(
    id: string,
    changes: Partial<Pick<PortalUser, "role" | "status">>,
  ): Promise<PortalUser> {
    await delay(this.latencyMs);
    const existing = this.users.find((u) => u.id === id);
    if (!existing) throw new Error("errors.users.notFound");
    const updated: PortalUser = {
      ...existing,
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    this.users = this.users.map((u) => (u.id === id ? updated : u));
    return clone(updated);
  }
}
