"use client";

import * as React from "react";
import { ResetPasswordPage } from "@k-lab/components";
import { useTranslations } from "next-intl";
import { getAppAuthConfig } from "@/lib/auth/app-auth-config";

export function ResetPasswordView() {
  const t = useTranslations("auth");
  const config = React.useMemo(() => getAppAuthConfig(), []);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setPasswordError(t("resetPassword.passwordsDoNotMatch"));
      return;
    }
    if (password.length < 8) {
      setPasswordError(t("resetPassword.passwordTooShort"));
      return;
    }

    setPasswordError(null);
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <ResetPasswordPage config={config}>
      <ResetPasswordPage.FormPanel hideHeader={isSuccess}>
        {isSuccess ? (
          <ResetPasswordPage.SuccessPanel title={t("resetPassword.successTitle")}>
            <p>{t("resetPassword.successMessage")}</p>
            <ResetPasswordPage.BackToSignInButton />
          </ResetPasswordPage.SuccessPanel>
        ) : (
          <ResetPasswordPage.Form onSubmit={onSubmit}>
            <ResetPasswordPage.PasswordInput
              value={password}
              onChange={(value) => {
                setPassword(value);
                setPasswordError(null);
              }}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            <ResetPasswordPage.ConfirmPasswordInput
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                setPasswordError(null);
              }}
              disabled={isSubmitting}
            />
            <ResetPasswordPage.Error message={passwordError} />
            <ResetPasswordPage.SubmitButton loading={isSubmitting} />
            <div className="text-center">
              <ResetPasswordPage.BackToSignInLink />
            </div>
          </ResetPasswordPage.Form>
        )}
      </ResetPasswordPage.FormPanel>
    </ResetPasswordPage>
  );
}
