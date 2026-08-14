import { NextResponse } from "next/server";
import { PRESENCE_COOKIE_NAME } from "@/lib/auth/presence-cookie";
import { PLATFORM_PRESENCE_COOKIE } from "@/lib/platform-auth/constants";
import {
  clearChildSessionCookie,
  clearPlatformPresenceCookie,
  setChildSessionCookie,
} from "@/lib/platform-auth/cookie-options";
import { isPlatformDeployment } from "@/lib/platform-auth/deployment-profile";
import { verifyFirebaseIdToken } from "@/lib/firebase-admin";
import {
  clearSessionEmailCookie,
  setSessionEmailCookie,
} from "@/lib/auth/session-email-cookie";

/**
 * Microsoft (Entra ID) is the brand portal's only identity provider. Sessions
 * are minted exclusively from a *verified* Firebase ID token whose
 * sign_in_provider is microsoft.com — in both deployment profiles. A password
 * account from another fleet app in the shared core-dev pool can produce a
 * valid Firebase token, but it cannot open a Brand Center session.
 *
 * NOTE: if the shell handoff (/auth/callback custom-token flow) is adopted
 * later, its tokens carry sign_in_provider "custom" — revisit this pin then.
 */
const REQUIRED_SIGN_IN_PROVIDER = "microsoft.com";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let token: string | undefined;

  if (contentType.includes("application/json")) {
    try {
      const body = (await request.json()) as { token?: string };
      token = body.token?.trim();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  }

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 401 });
  }

  let email: string | undefined;
  try {
    const decoded = await verifyFirebaseIdToken(token);
    if (decoded.firebase?.sign_in_provider !== REQUIRED_SIGN_IN_PROVIDER) {
      return NextResponse.json({ error: "Unsupported sign-in provider" }, { status: 401 });
    }
    email = decoded.email;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  setChildSessionCookie(res, PRESENCE_COOKIE_NAME);
  if (email) {
    setSessionEmailCookie(res, email);
  } else {
    clearSessionEmailCookie(res);
  }
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearChildSessionCookie(res, PRESENCE_COOKIE_NAME);
  clearSessionEmailCookie(res);
  if (isPlatformDeployment()) {
    clearPlatformPresenceCookie(res, PLATFORM_PRESENCE_COOKIE);
  }
  return res;
}
