/**
 * Sign-in failures the login UI knows how to present. Infrastructure maps
 * provider-specific errors (Firebase codes, popup failures, Entra rejections)
 * onto these codes; the view translates them (auth.login.errors.*).
 */
export type AuthSignInErrorCode =
  | "popupBlocked"
  | "popupClosed"
  | "tenantRejected"
  | "accountCollision"
  | "network"
  | "tooManyRequests"
  | "sessionFailed"
  | "signInFailed";

export class AuthSignInError extends Error {
  constructor(
    public readonly code: AuthSignInErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = "AuthSignInError";
  }
}
