"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "@k-lab/components";
import { useTranslations } from "next-intl";
import { getAppAuthConfig } from "@/lib/auth/app-auth-config";
import { signInWithEmailPasswordService } from "@/contexts/user-management/auth/application/user-management-auth-client-services";
import { useAuth } from "@/ui/user-management/auth/auth-provider";
import { safeInternalPath } from "@/lib/auth/safe-redirect";

export function LoginView({ redirectTo = "/" }: { redirectTo?: string }) {
  const router = useRouter();
  const t = useTranslations("auth");
  const { user, loading } = useAuth();
  const nextPath = safeInternalPath(redirectTo);
  const config = React.useMemo(() => getAppAuthConfig(), []);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace(nextPath);
    }
  }, [loading, user, router, nextPath]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;

    setAuthError(null);
    setIsSubmitting(true);
    try {
      await signInWithEmailPasswordService.signInWithPresenceSession(email, password);
      router.replace(nextPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("login.signInFailed");
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginPage config={config} formPlacement="right">
      <LoginPage.FormPanel>
        <LoginPage.Form onSubmit={onSubmit}>
          <LoginPage.EmailInput value={email} onChange={setEmail} disabled={isSubmitting} />
          <LoginPage.PasswordField>
            <LoginPage.PasswordInput
              value={password}
              onChange={setPassword}
              disabled={isSubmitting}
            />
            <LoginPage.ForgotPasswordLink />
          </LoginPage.PasswordField>
          <LoginPage.RememberMe
            checked={rememberMe}
            onCheckedChange={setRememberMe}
            disabled={isSubmitting}
          />
          <LoginPage.Error message={authError} />
          <LoginPage.SubmitButton loading={isSubmitting} />
        </LoginPage.Form>
      </LoginPage.FormPanel>
    </LoginPage>
  );
}
