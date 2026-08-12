import { ResetPasswordView } from "@/ui/user-management/views/ResetPasswordView";
import { PageThemeSetter } from "@k-lab/components";

export default function ResetPasswordPage() {
  return (
    <>
      <PageThemeSetter theme="light" />
      <ResetPasswordView />
    </>
  );
}
