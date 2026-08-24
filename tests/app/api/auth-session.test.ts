/**
 * @jest-environment node
 */
const mockVerifyFirebaseIdToken = jest.fn();

jest.mock("@/lib/firebase-admin", () => ({
  verifyFirebaseIdToken: (token: string) => mockVerifyFirebaseIdToken(token),
}));

import { POST, DELETE } from "@/app/api/auth/session/route";
import { SESSION_EMAIL_COOKIE } from "@/lib/auth/session-email-cookie";
import { PRESENCE_COOKIE_NAME } from "@/lib/auth/presence-cookie";

function post(body?: unknown) {
  return POST(
    new Request("http://localhost/api/auth/session", {
      method: "POST",
      ...(body !== undefined
        ? {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        : {}),
    }),
  );
}

describe("POST /api/auth/session", () => {
  beforeEach(() => {
    mockVerifyFirebaseIdToken.mockReset();
  });

  it("rejects a bare request with no token", async () => {
    const response = await post();

    expect(response.status).toBe(401);
    expect(mockVerifyFirebaseIdToken).not.toHaveBeenCalled();
  });

  it("rejects a client-supplied email — sessions come only from verified tokens", async () => {
    const response = await post({ email: "admin@k-lab.ai" });

    expect(response.status).toBe(401);
    expect(mockVerifyFirebaseIdToken).not.toHaveBeenCalled();
  });

  it("rejects a token that fails verification", async () => {
    mockVerifyFirebaseIdToken.mockRejectedValue(new Error("bad token"));

    const response = await post({ token: "forged" });

    expect(response.status).toBe(401);
  });

  it("rejects a valid token from the password provider (shared-pool account)", async () => {
    mockVerifyFirebaseIdToken.mockResolvedValue({
      email: "someone@k-lab.ai",
      firebase: { sign_in_provider: "password" },
    });

    const response = await post({ token: "password-provider-token" });

    expect(response.status).toBe(401);
  });

  it("mints the session for a verified microsoft.com token", async () => {
    mockVerifyFirebaseIdToken.mockResolvedValue({
      email: "nelson.reina@k-lab.ai",
      firebase: { sign_in_provider: "microsoft.com" },
    });

    const response = await post({ token: "good-token" });

    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(PRESENCE_COOKIE_NAME);
    // App-level encodeURIComponent, then Next's cookie serializer escapes the %.
    expect(setCookie).toContain(`${SESSION_EMAIL_COOKIE}=nelson.reina%2540k-lab.ai`);
  });

  it("derives the email from verified claims, ignoring any posted email", async () => {
    mockVerifyFirebaseIdToken.mockResolvedValue({
      email: "real.user@k-lab.ai",
      firebase: { sign_in_provider: "microsoft.com" },
    });

    const response = await post({ token: "good-token", email: "admin@k-lab.ai" });

    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(`${SESSION_EMAIL_COOKIE}=real.user%2540k-lab.ai`);
    expect(setCookie).not.toContain("admin%2540k-lab.ai");
  });
});

describe("DELETE /api/auth/session", () => {
  it("clears both session cookies", async () => {
    const response = await DELETE();

    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(PRESENCE_COOKIE_NAME);
    expect(setCookie).toContain(SESSION_EMAIL_COOKIE);
  });
});
