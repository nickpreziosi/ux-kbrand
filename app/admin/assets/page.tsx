import { AdminAssetsView } from "@/ui/brand-assets/views/AdminAssetsView";
import { AdminGuard } from "@/ui/user-management/components/admin-guard";

export default function AdminAssetsPage() {
  return (
    <AdminGuard>
      <AdminAssetsView />
    </AdminGuard>
  );
}
