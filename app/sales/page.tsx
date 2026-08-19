import { Suspense } from "react";
import { SalesResourcesView } from "@/ui/brand-assets/views/SalesResourcesView";

export default function SalesPage() {
  return (
    <Suspense>
      <SalesResourcesView />
    </Suspense>
  );
}
