"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import type { AuthPageMessages } from "@k-lab/components";

/**
 * Translated overrides for the @k-lab/components auth page default strings
 * (login / forgot-password / reset-password flows used by this app).
 */
export function useAuthPageMessages(): Partial<AuthPageMessages> {
  const t = useTranslations("auth.pages");

  return React.useMemo(
    () => ({
      title: t("title"),
      subtitle: t("subtitle"),
      emailLabel: t("emailLabel"),
      passwordLabel: t("passwordLabel"),
      confirmPasswordLabel: t("confirmPasswordLabel"),
      forgotPassword: t("forgotPassword"),
      rememberMe: t("rememberMe"),
      submit: t("submit"),
      submitting: t("submitting"),
      backToSignIn: t("backToSignIn"),
      checkEmailHeading: t("checkEmailHeading"),
      resetLinkSent: t("resetLinkSent"),
      resetLinkInstructions: t("resetLinkInstructions"),
      noEmailReceived: t("noEmailReceived"),
      tryAgain: t("tryAgain"),
      resetPasswordTitle: t("resetPasswordTitle"),
      resetPasswordSubtitle: t("resetPasswordSubtitle"),
      passwordMismatch: t("passwordMismatch"),
      passwordMinLength: t("passwordMinLength"),
      resetSuccessHeading: t("resetSuccessHeading"),
      resetSuccessMessage: t("resetSuccessMessage"),
    }),
    [t],
  );
}
