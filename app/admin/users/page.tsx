import { AdminUsersView } from "@/ui/user-management/views/AdminUsersView";
import { AdminGuard } from "@/ui/user-management/components/admin-guard";

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <AdminUsersView />
    </AdminGuard>
  );
}
