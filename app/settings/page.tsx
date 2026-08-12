import { Settings } from "lucide-react";
import { PageHeader } from "@k-lab/components";
import { getTranslations } from "next-intl/server";

export default async function SettingsPage() {
  const t = await getTranslations("settings");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<Settings className="h-8 w-8" />}
      />
      <p className="text-sm text-muted-foreground">{t("placeholder")}</p>
    </div>
  );
}
