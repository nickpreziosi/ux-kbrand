/** Shared across shell + child apps (keep in sync). */

export const PLATFORM_PRESENCE_COOKIE = "KLabPlatformPresence";

export const PLATFORM_TOKEN_COOKIE = "KLabPlatformToken";

/** Post-login destination (set before redirecting to shell login; keeps login URL clean). */
export const PLATFORM_RETURN_TO_COOKIE = "KLabReturnTo";

/** Set on child logout so shell clears its session (not a return destination). */
export const PLATFORM_LOGOUT_PENDING_COOKIE = "KLabLogoutPending";

/** Seconds. Short-lived: only needs to survive the login round-trip. */
export const PLATFORM_RETURN_TO_MAX_AGE = 60 * 5;

/** Seconds. Short-lived: child logout → shell login handoff. */
export const PLATFORM_LOGOUT_PENDING_MAX_AGE = 60;

/** Child httpOnly session after JWT exchange. */
export const CHILD_SESSION_COOKIE = "KBrandPresence";

/** Seconds. Refreshed on each successful session POST. */
export const PLATFORM_SESSION_MAX_AGE = 60 * 60 * 24 * 5;

export const HANDOFF_CODE_TTL_MS = 60_000;
