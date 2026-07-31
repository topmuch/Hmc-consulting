import { Suspense } from "react";
import { ViewSwitcher } from "@/components/view-switcher";

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ViewSwitcher />
    </Suspense>
  );
}
