/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GUEST_COOKIE_NAME, GUEST_COOKIE_VALUE } from "@/lib/auth/guest-cookie";
import { PRESENCE_COOKIE_NAME } from "@/lib/auth/presence-cookie";
import { middleware } from "@/middleware";

function request(path: string, cookies: Record<string, string> = {}) {
  const headers = new Headers();
  const cookie = Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
  if (cookie) headers.set("cookie", cookie);
  return middleware(new NextRequest(`http://localhost:3000${path}`, { headers }));
}

function location(response: Response): string {
  const url = new URL(response.headers.get("location") ?? "", "http://localhost:3000");
  const next = url.searchParams.get("next");
  return next ? `${url.pathname}?next=${next}` : url.pathname;
}

describe("middleware landing gate", () => {
  it("redirects / to /login when there is no guest or presence cookie", () => {
    const response = request("/");

    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.status).toBeLessThan(400);
    expect(location(response).startsWith("/login")).toBe(true);
    expect(location(response)).not.toContain("next=/sales");
  });

  it("allows / when the guest cookie is set", () => {
    const response = request("/", { [GUEST_COOKIE_NAME]: GUEST_COOKIE_VALUE });

    expect(response.status).toBeLessThan(300);
  });

  it("allows / when the presence cookie is set", () => {
    const response = request("/", { [PRESENCE_COOKIE_NAME]: "1" });

    expect(response.status).toBeLessThan(300);
  });

  it("always allows /login", () => {
    const response = request("/login");

    expect(response.status).toBeLessThan(300);
  });

  it("allows branding paths without cookies", () => {
    expect(request("/branding").status).toBeLessThan(300);
    expect(request("/branding/logo").status).toBeLessThan(300);
  });

  it("redirects /sales to login with next when there is no presence cookie", () => {
    const response = request("/sales");

    expect(location(response)).toBe("/login?next=/sales");
  });

  it("does not unlock /sales, /admin, or /settings with only a guest cookie", () => {
    const cookies = { [GUEST_COOKIE_NAME]: GUEST_COOKIE_VALUE };

    expect(location(request("/sales", cookies))).toBe("/login?next=/sales");
    expect(location(request("/admin/users", cookies))).toBe("/login?next=/admin/users");
    expect(location(request("/settings", cookies))).toBe("/login?next=/settings");
  });
});
