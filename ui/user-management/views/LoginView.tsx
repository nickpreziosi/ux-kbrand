"use client";

import * as React from "react";
import { Button, LoginPage, cn } from "@k-lab/components";
import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { getAppAuthConfig } from "@/lib/auth/app-auth-config";
import { setGuestCookie } from "@/lib/auth/guest-cookie";
import { signInWithMicrosoftService } from "@/contexts/user-management/auth/application/user-management-auth-client-services";
import { AuthSignInError } from "@/contexts/user-management/auth/domain/auth-sign-in-error";
import { useAuth } from "@/ui/user-management/auth/auth-provider";
import { safeInternalPath } from "@/lib/auth/safe-redirect";

/** The four-square Microsoft mark (per Microsoft's sign-in branding guidelines). */
function MicrosoftMark({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 21 21"
      width={18}
      height={18}
      className={cn("shrink-0", className)}
      {...props}
    >
      <rect x="0" y="0" width="10" height="10" fill="#f25022" />
      <rect x="11" y="0" width="10" height="10" fill="#7fba00" />
      <rect x="0" y="11" width="10" height="10" fill="#00a4ef" />
      <rect x="11" y="11" width="10" height="10" fill="#ffb900" />
    </svg>
  );
}

export function LoginView({ redirectTo = "/" }: { redirectTo?: string }) {
  const t = useTranslations("auth.login");
  const { user, loading } = useAuth();
  const nextPath = safeInternalPath(redirectTo);
  const config = React.useMemo(() => getAppAuthConfig(), []);

  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (loading) return;
    if (user) {
      window.location.assign(nextPath);
    }
  }, [loading, user, nextPath]);

  const onSignIn = async () => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      await signInWithMicrosoftService.signInWithPresenceSession();
      window.location.assign(nextPath);
    } catch (err) {
      if (err instanceof AuthSignInError) {
        // A closed popup is the user changing their mind — reset quietly.
        if (err.code !== "popupClosed") {
          setAuthError(t(`errors.${err.code}`));
        }
      } else {
        setAuthError(t("errors.signInFailed"));
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const onGuestSignIn = () => {
    setGuestCookie();
    window.location.assign("/");
  };

  return (
    <LoginPage config={config} formPlacement="right">
      <LoginPage.FormPanel title={t("title")} subtitle={t("subtitle")}>
        <div className="flex flex-col gap-4">
          <div data-testid="login-actions" className="flex min-w-0 flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 w-full min-w-0"
              loading={isSigningIn}
              onClick={onSignIn}
            >
              {!isSigningIn ? <MicrosoftMark /> : null}
              {isSigningIn ? t("signingIn") : t("signInWithMicrosoft")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 w-full min-w-0"
              disabled={isSigningIn}
              onClick={onGuestSignIn}
            >
              <UserRound aria-hidden />
              {t("signInAsGuest")}
            </Button>
          </div>
          <LoginPage.Error message={authError} />
        </div>
      </LoginPage.FormPanel>
    </LoginPage>
  );
}
