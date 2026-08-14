import type { AuthGatewayPort } from "@/contexts/user-management/auth/domain/auth-gateway.port";
import { AuthSignInError } from "@/contexts/user-management/auth/domain/auth-sign-in-error";

export class SignInWithMicrosoftService {
  constructor(
    private readonly gateway: AuthGatewayPort,
    private readonly setPresenceSession: (idToken?: string) => Promise<void>
  ) {}

  async signInWithPresenceSession(): Promise<void> {
    await this.gateway.signInWithMicrosoft();
    try {
      const idToken = await this.gateway.getIdToken();
      await this.setPresenceSession(idToken ?? undefined);
    } catch {
      await this.gateway.signOut();
      throw new AuthSignInError("sessionFailed");
    }
  }
}
