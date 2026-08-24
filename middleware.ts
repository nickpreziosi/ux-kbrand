import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GUEST_COOKIE_NAME, GUEST_COOKIE_VALUE } from "@/lib/auth/guest-cookie";
import { PRESENCE_COOKIE_NAME } from "@/lib/auth/presence-cookie";
import { isAuthApiPath, isPublicPath } from "@/lib/auth/public-routes";
import { isProtectedPath } from "@/lib/auth/protected-routes";
import { PLATFORM_PRESENCE_COOKIE } from "@/lib/platform-auth/constants";
import { isPlatformDeployment } from "@/lib/platform-auth/deployment-profile";
import { shellLoginUrl } from "@/lib/platform-auth/safe-return-to";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/scripts/") ||
    pathname.startsWith("/favicon.ico") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|pdf|css|txt|zip)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (isAuthApiPath(pathname) || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // API routes (mock HTTP backend, gated downloads) enforce the session
  // themselves (401 JSON beats a login-page HTML response for a fetch).
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const hasChildSession = request.cookies.get(PRESENCE_COOKIE_NAME)?.value === "1";
  const hasPlatformPresence =
    request.cookies.get(PLATFORM_PRESENCE_COOKIE)?.value === "1";
  const hasGuest =
    request.cookies.get(GUEST_COOKIE_NAME)?.value === GUEST_COOKIE_VALUE;
  const hasLandingSession = isPlatformDeployment()
    ? hasPlatformPresence || hasGuest
    : hasChildSession || hasGuest;

  // Landing prompt: `/` requires Guest or Microsoft before the public portal.
  if (pathname === "/" && !hasLandingSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Public-first portal: everything except the employee/admin area is open.
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (isPlatformDeployment()) {
    if (!hasPlatformPresence) {
      return NextResponse.redirect(shellLoginUrl());
    }

    return NextResponse.next();
  }

  if (!hasChildSession) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
