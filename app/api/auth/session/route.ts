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

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let token: string | undefined;
  let email: string | undefined;

  if (contentType.includes("application/json")) {
    try {
      const body = (await request.json()) as { token?: string; email?: string };
      token = body.token?.trim();
      email = body.email?.trim();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  }

  if (isPlatformDeployment()) {
    if (!token) {
      return NextResponse.json({ error: "Token required in platform mode" }, { status: 400 });
    }
    try {
      const decoded = await verifyFirebaseIdToken(token);
      // The verified token beats any posted email.
      email = decoded.email ?? email;
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
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
