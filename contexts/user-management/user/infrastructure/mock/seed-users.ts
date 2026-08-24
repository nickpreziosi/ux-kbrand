import type { PortalUser } from "@/contexts/user-management/user/domain/models/portal-user.model";

/**
 * Seed directory for prototype development. The signed-in Firebase user is
 * matched by email; anyone authenticated but not listed falls back to the
 * "employee" role (see PortalUserDirectoryService.resolveByEmail).
 *
 * Microsoft-only sign-in presents Entra UPN emails, so every admin is seeded
 * with their k-lab.ai work address. Personal-email seeds (gmail etc.) cannot
 * sign in at all and must not be listed.
 */
export const SEED_PORTAL_USERS: PortalUser[] = [
  {
    id: "usr-007",
    displayName: "Nicholas Preziosi",
    email: "nicholas.preziosi+stabldevbuy@k-lab.ai",
    role: "admin",
    status: "active",
    createdAt: "2026-05-01T08:02:00.000Z",
    updatedAt: "2026-08-01T10:00:00.000Z",
    lastLoginAt: "2026-08-11T13:30:00.000Z",
  },
  {
    id: "usr-008",
    displayName: "Nelson Reina (K Lab)",
    email: "nelson.reina@k-lab.ai",
    role: "admin",
    status: "active",
    createdAt: "2026-05-01T08:03:00.000Z",
    updatedAt: "2026-08-01T10:00:00.000Z",
    lastLoginAt: "2026-08-12T09:45:00.000Z",
  },
  {
    id: "usr-002",
    displayName: "Marta Villanueva",
    email: "marta.villanueva@k-lab.ai",
    role: "admin",
    status: "active",
    createdAt: "2026-05-01T08:05:00.000Z",
    updatedAt: "2026-07-20T11:00:00.000Z",
    lastLoginAt: "2026-08-08T14:40:00.000Z",
  },
  {
    id: "usr-009",
    displayName: "Carolina",
    email: "carolina@k-lab.ai",
    role: "admin",
    status: "active",
    createdAt: "2026-08-17T09:00:00.000Z",
    updatedAt: "2026-08-17T09:00:00.000Z",
  },
  {
    id: "usr-010",
    displayName: "Nicholas Preziosi",
    email: "nicholas.preziosi@k-lab.ai",
    role: "admin",
    status: "active",
    createdAt: "2026-08-18T17:10:00.000Z",
    updatedAt: "2026-08-18T17:10:00.000Z",
  },
  {
    id: "usr-003",
    displayName: "Diego Fonseca",
    email: "diego.fonseca@k-lab.ai",
    role: "employee",
    status: "active",
    createdAt: "2026-05-12T09:30:00.000Z",
    updatedAt: "2026-05-12T09:30:00.000Z",
    lastLoginAt: "2026-08-05T16:25:00.000Z",
  },
  {
    id: "usr-004",
    displayName: "Aisha Rahman",
    email: "aisha.rahman@k-lab.ai",
    role: "employee",
    status: "active",
    createdAt: "2026-06-02T10:00:00.000Z",
    updatedAt: "2026-06-02T10:00:00.000Z",
    lastLoginAt: "2026-07-30T08:10:00.000Z",
  },
  {
    id: "usr-005",
    displayName: "Tomás Herrera",
    email: "tomas.herrera@k-lab.ai",
    role: "employee",
    status: "invited",
    createdAt: "2026-07-25T12:00:00.000Z",
    updatedAt: "2026-07-25T12:00:00.000Z",
  },
  {
    id: "usr-006",
    displayName: "Priya Natarajan",
    email: "priya.natarajan@k-lab.ai",
    role: "employee",
    status: "disabled",
    createdAt: "2026-05-18T09:00:00.000Z",
    updatedAt: "2026-07-12T15:30:00.000Z",
    lastLoginAt: "2026-07-11T10:05:00.000Z",
  },
];
