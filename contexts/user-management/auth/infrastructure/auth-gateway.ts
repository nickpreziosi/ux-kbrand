import { isPlatformDeployment } from "@/lib/platform-auth/deployment-profile";
import type { AuthGatewayPort } from "@/contexts/user-management/auth/domain/auth-gateway.port";
import { firebaseAuthGateway } from "@/contexts/user-management/auth/infrastructure/firebase-auth-gateway";
import { platformAuthGateway } from "@/contexts/user-management/auth/infrastructure/platform-auth-gateway";

export const authGateway: AuthGatewayPort = isPlatformDeployment()
  ? platformAuthGateway
  : firebaseAuthGateway;
