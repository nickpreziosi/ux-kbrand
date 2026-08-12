import { PortalUserDirectoryService } from "./services/portal-user-directory-service";
import { MockPortalUserRepository } from "../infrastructure/mock/mock-portal-user-repository";

/** Client-side wiring; a Firestore `users` repository replaces the mock later. */
const portalUserRepository = new MockPortalUserRepository();

export const portalUserDirectoryService = new PortalUserDirectoryService(portalUserRepository);
