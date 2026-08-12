import { ForgotPasswordView } from "@/ui/user-management/views/ForgotPasswordView";
import { PageThemeSetter } from "@k-lab/components";

export default function ForgotPasswordPage() {
  return (
    <>
      <PageThemeSetter theme="light" />
      <ForgotPasswordView />
    </>
  );
}
