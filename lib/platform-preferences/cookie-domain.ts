/**
 * Parent domain for cross-subdomain preference cookies.
 * Matches k-lab-components: host-only on localhost / 127.0.0.1.
 */
export function getPlatformPreferenceCookieDomain(
  hostname = typeof window !== "undefined" ? window.location.hostname : "",
): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_COOKIE_DOMAIN?.trim();
  if (fromEnv) {
    // Still prefer host-only when running on bare localhost (env may point at .klab.localhost)
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return null;
    }
    return fromEnv;
  }

  if (!hostname || hostname === "localhost" || hostname === "127.0.0.1") {
    return null;
  }
  if (hostname.endsWith(".klab.localhost") || hostname === "klab.localhost") {
    return ".klab.localhost";
  }
  if (hostname.endsWith(".k-lab.ai") || hostname === "k-lab.ai") {
    return ".k-lab.ai";
  }
  return null;
}
