"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { SiteView } from "@/components/site-view";
import { Dashboard } from "@/components/dashboard/dashboard";

export function ViewSwitcher() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get("view");

  const isDashboard = view === "dashboard";

  const goDashboard = useCallback(() => {
    router.push("/?view=dashboard", { scroll: false });
  }, [router]);

  const goSite = useCallback(() => {
    router.push("/", { scroll: false });
  }, [router]);

  if (isDashboard) {
    return <Dashboard />;
  }

  return <SiteView onGoDashboard={goDashboard} />;
}
