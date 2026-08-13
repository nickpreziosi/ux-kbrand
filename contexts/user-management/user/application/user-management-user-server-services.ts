import { PortalUserDirectoryService } from "./services/portal-user-directory-service";
import { MockPortalUserRepository } from "../infrastructure/mock/mock-portal-user-repository";

/**
 * Server-side wiring for the mock HTTP backend (app/api routes). One seeded
 * in-memory directory per server process, cached on globalThis so dev HMR
 * recompiles reuse the same store.
 */
const globalStore = globalThis as unknown as {
  __kbrandServerUserRepository?: MockPortalUserRepository;
};

export function getServerPortalUserRepository(): MockPortalUserRepository {
  globalStore.__kbrandServerUserRepository ??= new MockPortalUserRepository(0);
  return globalStore.__kbrandServerUserRepository;
}

export function getServerPortalUserDirectoryService(): PortalUserDirectoryService {
  return new PortalUserDirectoryService(getServerPortalUserRepository());
}
