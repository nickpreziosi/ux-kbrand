import { CHILD_SESSION_COOKIE, PLATFORM_SESSION_MAX_AGE } from "@/lib/platform-auth/constants";

/** httpOnly child session cookie (host-scoped on child origin). */
export const PRESENCE_COOKIE_NAME = CHILD_SESSION_COOKIE;

export const PRESENCE_COOKIE_MAX_AGE = PLATFORM_SESSION_MAX_AGE;
