import { FirebaseError } from "firebase/app";
import {
  AuthSignInError,
  type AuthSignInErrorCode,
} from "@/contexts/user-management/auth/domain/auth-sign-in-error";

/**
 * Maps Firebase Auth / Microsoft OAuth errors to the domain sign-in error
 * codes the login UI localizes (infra-specific).
 */
export function mapFirebaseAuthErrorToSignInError(err: unknown): AuthSignInError {
  if (err instanceof AuthSignInError) return err;

  if (err instanceof FirebaseError) {
    const code = firebaseCodeToSignInCode(err.code);
    return new AuthSignInError(code, err.message);
  }

  return new AuthSignInError("signInFailed", err instanceof Error ? err.message : undefined);
}

function firebaseCodeToSignInCode(code: string): AuthSignInErrorCode {
  switch (code) {
    case "auth/popup-blocked":
      return "popupBlocked";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
    case "auth/user-cancelled":
      return "popupClosed";
    // The email already has a password account in the shared core-dev pool.
    // No in-app linking flow — IT pre-links Microsoft via the backfill script.
    case "auth/account-exists-with-different-credential":
      return "accountCollision";
    // Entra rejected the sign-in (wrong tenant, unassigned user) or the
    // provider/domain isn't configured for this Firebase project.
    case "auth/invalid-credential":
    case "auth/operation-not-allowed":
    case "auth/unauthorized-domain":
    case "auth/user-disabled":
      return "tenantRejected";
    case "auth/too-many-requests":
      return "tooManyRequests";
    case "auth/network-request-failed":
      return "network";
    default:
      return "signInFailed";
  }
}
