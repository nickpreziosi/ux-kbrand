import { LoginView } from "@/ui/user-management/views/LoginView";
import { PageThemeSetter } from "@k-lab/components";
import { safeInternalPath } from "@/lib/auth/safe-redirect";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <>
      <PageThemeSetter theme="light" />
      <LoginView redirectTo={safeInternalPath(next)} />
    </>
  );
}
