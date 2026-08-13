import { PortalUserDirectoryService } from "./services/portal-user-directory-service";
import { HttpPortalUserRepository } from "../infrastructure/http/http-portal-user-repository";
import { MockPortalUserRepository } from "../infrastructure/mock/mock-portal-user-repository";
import type { PortalUserRepository } from "../domain/repositories/portalUserRepository.interface";

/**
 * Client-side wiring. Default is the mock HTTP backend (app/api/users);
 * NEXT_PUBLIC_USE_MOCK_BRAND_API=true opts back into the in-browser mock.
 * A Firestore `users` repository replaces both later.
 */
const useClientMock = process.env.NEXT_PUBLIC_USE_MOCK_BRAND_API === "true";

const portalUserRepository: PortalUserRepository = useClientMock
  ? new MockPortalUserRepository()
  : new HttpPortalUserRepository();

export const portalUserDirectoryService = new PortalUserDirectoryService(portalUserRepository);
