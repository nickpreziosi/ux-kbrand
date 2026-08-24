import { FirebaseError } from "firebase/app";
import { mapFirebaseAuthErrorToSignInError } from "@/contexts/user-management/auth/infrastructure/map-firebase-auth-error";
import { AuthSignInError } from "@/contexts/user-management/auth/domain/auth-sign-in-error";

describe("mapFirebaseAuthErrorToSignInError", () => {
  it.each([
    ["auth/popup-blocked", "popupBlocked"],
    ["auth/popup-closed-by-user", "popupClosed"],
    ["auth/cancelled-popup-request", "popupClosed"],
    ["auth/account-exists-with-different-credential", "accountCollision"],
    ["auth/invalid-credential", "tenantRejected"],
    ["auth/operation-not-allowed", "tenantRejected"],
    ["auth/user-disabled", "tenantRejected"],
    ["auth/too-many-requests", "tooManyRequests"],
    ["auth/network-request-failed", "network"],
    ["auth/some-unknown-code", "signInFailed"],
  ])("maps %s to %s", (firebaseCode, expected) => {
    const mapped = mapFirebaseAuthErrorToSignInError(
      new FirebaseError(firebaseCode, "boom"),
    );
    expect(mapped).toBeInstanceOf(AuthSignInError);
    expect(mapped.code).toBe(expected);
  });

  it("passes AuthSignInError through unchanged", () => {
    const original = new AuthSignInError("sessionFailed");
    expect(mapFirebaseAuthErrorToSignInError(original)).toBe(original);
  });

  it("wraps non-Firebase errors as signInFailed", () => {
    expect(mapFirebaseAuthErrorToSignInError(new Error("weird")).code).toBe("signInFailed");
  });
});
