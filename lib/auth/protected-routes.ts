/**
 * The brand portal is public-first: brand guidelines, logos, imagery, and fonts
 * are open to everyone. Only the employee area (sales resources, settings) and
 * the admin area require a session.
 */
const PROTECTED_PATH_PREFIXES = ["/sales", "/admin", "/settings"] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
