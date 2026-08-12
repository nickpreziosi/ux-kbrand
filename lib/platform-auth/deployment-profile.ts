export type DeploymentProfile = "platform" | "isolated";

/**
 * The brand portal is standalone-first (public site at brand.k-lab.ai), so the
 * default profile is "isolated" — the opposite of the suite apps.
 */
export function getDeploymentProfile(): DeploymentProfile {
  return process.env.NEXT_PUBLIC_DEPLOYMENT_PROFILE === "platform" ? "platform" : "isolated";
}

export function isPlatformDeployment(): boolean {
  return getDeploymentProfile() === "platform";
}

export function getShellOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SHELL_ORIGIN?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "development") {
    return "http://app.klab.localhost:3000";
  }
  return "https://app.k-lab.ai";
}

export function getChildOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_ORIGIN?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "development") {
    return "http://kbrand.klab.localhost:3005";
  }
  return "https://brand.k-lab.ai";
}
