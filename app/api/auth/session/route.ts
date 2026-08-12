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

  if (isPlatformDeployment()) {
    if (!token) {
      return NextResponse.json({ error: "Token required in platform mode" }, { status: 400 });
    }
    try {
      await verifyFirebaseIdToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  const res = NextResponse.json({ ok: true });
  setChildSessionCookie(res, PRESENCE_COOKIE_NAME);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearChildSessionCookie(res, PRESENCE_COOKIE_NAME);
  if (isPlatformDeployment()) {
    clearPlatformPresenceCookie(res, PLATFORM_PRESENCE_COOKIE);
  }
  return res;
}
