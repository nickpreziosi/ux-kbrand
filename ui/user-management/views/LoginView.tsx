"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, LoginPage } from "@k-lab/components";
import { useTranslations } from "next-intl";
import { getAppAuthConfig } from "@/lib/auth/app-auth-config";
import { signInWithMicrosoftService } from "@/contexts/user-management/auth/application/user-management-auth-client-services";
import { AuthSignInError } from "@/contexts/user-management/auth/domain/auth-sign-in-error";
import { useAuth } from "@/ui/user-management/auth/auth-provider";
import { safeInternalPath } from "@/lib/auth/safe-redirect";

/** The four-square Microsoft mark (per Microsoft's sign-in branding guidelines). */
function MicrosoftMark() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 21 21" className="shrink-0">
      <rect x="0" y="0" width="10" height="10" fill="#f25022" />
      <rect x="11" y="0" width="10" height="10" fill="#7fba00" />
      <rect x="0" y="11" width="10" height="10" fill="#00a4ef" />
      <rect x="11" y="11" width="10" height="10" fill="#ffb900" />
    </svg>
  );
}

export function LoginView({ redirectTo = "/" }: { redirectTo?: string }) {
  const router = useRouter();
  const t = useTranslations("auth.login");
  const { user, loading } = useAuth();
  const nextPath = safeInternalPath(redirectTo);
  const config = React.useMemo(() => getAppAuthConfig(), []);

  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace(nextPath);
    }
  }, [loading, user, router, nextPath]);

  const onSignIn = async () => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      await signInWithMicrosoftService.signInWithPresenceSession();
      router.replace(nextPath);
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

  return (
    <LoginPage config={config} formPlacement="right">
      <LoginPage.FormPanel title={t("title")} subtitle={t("subtitle")}>
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            icon={<MicrosoftMark />}
            iconPosition="start"
            loading={isSigningIn}
            onClick={onSignIn}
          >
            {isSigningIn ? t("signingIn") : t("signInWithMicrosoft")}
          </Button>
          <LoginPage.Error message={authError} />
        </div>
      </LoginPage.FormPanel>
    </LoginPage>
  );
}
