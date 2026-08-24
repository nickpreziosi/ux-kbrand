import { PLATFORM_SESSION_MAX_AGE } from "@/lib/platform-auth/constants";
import {
  GUEST_COOKIE_MAX_AGE,
  GUEST_COOKIE_NAME,
  GUEST_COOKIE_VALUE,
  hasGuestCookie,
  setGuestCookie,
} from "@/lib/auth/guest-cookie";

describe("guest cookie", () => {
  beforeEach(() => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      configurable: true,
      value: "",
    });
  });

  it("uses KBrandGuest with value 1 and a ~5-day max-age", () => {
    expect(GUEST_COOKIE_NAME).toBe("KBrandGuest");
    expect(GUEST_COOKIE_VALUE).toBe("1");
    expect(GUEST_COOKIE_MAX_AGE).toBe(PLATFORM_SESSION_MAX_AGE);
    expect(GUEST_COOKIE_MAX_AGE).toBe(60 * 60 * 24 * 5);
  });

  it("hasGuestCookie is true only when the cookie value is 1", () => {
    expect(hasGuestCookie(undefined)).toBe(false);
    expect(hasGuestCookie("")).toBe(false);
    expect(hasGuestCookie("other=1")).toBe(false);
    expect(hasGuestCookie("KBrandGuest=0")).toBe(false);
    expect(hasGuestCookie("KBrandGuest=1")).toBe(true);
    expect(hasGuestCookie("theme=dark; KBrandGuest=1; foo=bar")).toBe(true);
  });

  it("setGuestCookie writes Path=/, SameSite=Lax, and the presence max-age", () => {
    const writes: string[] = [];
    Object.defineProperty(document, "cookie", {
      configurable: true,
      get: () => writes.at(-1) ?? "",
      set: (value: string) => {
        writes.push(value);
      },
    });

    setGuestCookie();

    expect(writes).toHaveLength(1);
    const written = writes[0];
    expect(written).toContain(`${GUEST_COOKIE_NAME}=${GUEST_COOKIE_VALUE}`);
    expect(written).toMatch(/Path=\//i);
    expect(written).toMatch(/SameSite=Lax/i);
    expect(written).toMatch(new RegExp(`Max-Age=${GUEST_COOKIE_MAX_AGE}`, "i"));
  });
});
