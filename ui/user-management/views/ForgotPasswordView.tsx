"use client";

import * as React from "react";
import { ForgotPasswordPage } from "@k-lab/components";
import { useTranslations } from "next-intl";
import { getAppAuthConfig } from "@/lib/auth/app-auth-config";

export function ForgotPasswordView() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const config = React.useMemo(() => getAppAuthConfig(), []);
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <ForgotPasswordPage config={config}>
      <ForgotPasswordPage.FormPanel hideHeader={isSuccess}>
        {isSuccess ? (
          <ForgotPasswordPage.SuccessPanel>
            <ForgotPasswordPage.CheckEmailMessage email={email} />
            <ForgotPasswordPage.BackToSignInButton />
            <p className="text-center text-sm text-muted-foreground">
              {t("forgotPassword.didntReceiveEmail")}{" "}
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="font-medium text-accent-brand hover:underline"
              >
                {tCommon("tryAgain")}
              </button>
            </p>
          </ForgotPasswordPage.SuccessPanel>
        ) : (
          <ForgotPasswordPage.Form onSubmit={onSubmit}>
            <ForgotPasswordPage.EmailInput
              value={email}
              onChange={setEmail}
              disabled={isSubmitting}
            />
            <ForgotPasswordPage.SubmitButton loading={isSubmitting} />
            <div className="text-center">
              <ForgotPasswordPage.BackToSignInLink />
            </div>
          </ForgotPasswordPage.Form>
        )}
      </ForgotPasswordPage.FormPanel>
    </ForgotPasswordPage>
  );
}
