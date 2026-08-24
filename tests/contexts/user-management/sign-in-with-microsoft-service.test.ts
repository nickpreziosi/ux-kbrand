import { SignInWithMicrosoftService } from "@/contexts/user-management/auth/application/services/sign-in-with-microsoft-service";
import { AuthSignInError } from "@/contexts/user-management/auth/domain/auth-sign-in-error";
import type { AuthGatewayPort } from "@/contexts/user-management/auth/domain/auth-gateway.port";

function makeGateway(overrides: Partial<AuthGatewayPort> = {}): AuthGatewayPort {
  return {
    signInWithMicrosoft: jest.fn().mockResolvedValue(undefined),
    signOut: jest.fn().mockResolvedValue(undefined),
    subscribe: jest.fn().mockReturnValue(() => undefined),
    refreshSessionClaims: jest.fn().mockResolvedValue({ user: null, claims: null }),
    getIdToken: jest.fn().mockResolvedValue("id-token-123"),
    ...overrides,
  };
}

describe("SignInWithMicrosoftService", () => {
  it("signs in with Microsoft, then establishes the presence session with the ID token", async () => {
    const gateway = makeGateway();
    const setPresenceSession = jest.fn().mockResolvedValue(undefined);
    const service = new SignInWithMicrosoftService(gateway, setPresenceSession);

    await service.signInWithPresenceSession();

    expect(gateway.signInWithMicrosoft).toHaveBeenCalledTimes(1);
    expect(setPresenceSession).toHaveBeenCalledWith("id-token-123");
    expect(gateway.signOut).not.toHaveBeenCalled();
  });

  it("propagates gateway sign-in errors without touching the session", async () => {
    const gateway = makeGateway({
      signInWithMicrosoft: jest
        .fn()
        .mockRejectedValue(new AuthSignInError("popupBlocked")),
    });
    const setPresenceSession = jest.fn();
    const service = new SignInWithMicrosoftService(gateway, setPresenceSession);

    await expect(service.signInWithPresenceSession()).rejects.toMatchObject({
      code: "popupBlocked",
    });
    expect(setPresenceSession).not.toHaveBeenCalled();
    expect(gateway.signOut).not.toHaveBeenCalled();
  });

  it("rolls back with signOut when the session call fails", async () => {
    const gateway = makeGateway();
    const setPresenceSession = jest.fn().mockRejectedValue(new Error("session down"));
    const service = new SignInWithMicrosoftService(gateway, setPresenceSession);

    await expect(service.signInWithPresenceSession()).rejects.toMatchObject({
      code: "sessionFailed",
    });
    expect(gateway.signOut).toHaveBeenCalledTimes(1);
  });

  it("rolls back when the ID token cannot be read after sign-in", async () => {
    const gateway = makeGateway({
      getIdToken: jest.fn().mockRejectedValue(new Error("no token")),
    });
    const setPresenceSession = jest.fn();
    const service = new SignInWithMicrosoftService(gateway, setPresenceSession);

    await expect(service.signInWithPresenceSession()).rejects.toBeInstanceOf(
      AuthSignInError,
    );
    expect(setPresenceSession).not.toHaveBeenCalled();
    expect(gateway.signOut).toHaveBeenCalledTimes(1);
  });
});
