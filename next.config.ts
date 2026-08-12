import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Dev pages are served cross-origin via the subdomain-native hosts (the server
  // binds 127.0.0.1) — without these, Next silently blocks /_next dev resources
  // and pages never hydrate (dead buttons, no HMR).
  allowedDevOrigins: ["kbrand.klab.localhost", "*.klab.localhost"],
};

export default withNextIntl(nextConfig);
