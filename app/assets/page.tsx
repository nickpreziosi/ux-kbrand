import { Suspense } from "react";
import { AssetLibraryView } from "@/ui/brand-assets/views/AssetLibraryView";

export default function AssetsPage() {
  return (
    <Suspense>
      <AssetLibraryView />
    </Suspense>
  );
}