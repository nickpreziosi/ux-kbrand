"use client";

import { NotFoundPage } from "@k-lab/components";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");
  const tCommon = useTranslations("common");

  return (
    <NotFoundPage
      homeHref="/"
      messages={{
        title: t("title"),
        message: t("message"),
        goBack: tCommon("goBack"),
        goHome: tCommon("goHome"),
      }}
    />
  );
}
