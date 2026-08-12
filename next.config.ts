import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Without these, Next dev answers /_next/static/chunks with 403 and the page
  // renders but never hydrates (dead buttons, no client data, no HMR).
  // Both entry points are supported: plain localhost and the subdomain-native
  // hosts used when running alongside the SSO shell.
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "kbrand.klab.localhost",
    "*.klab.localhost",
  ],
};

export default withNextIntl(nextConfig);
