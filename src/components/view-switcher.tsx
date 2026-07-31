"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { SiteView } from "@/components/site-view";
import { Dashboard } from "@/components/dashboard/dashboard";
import { SettingsPage } from "@/components/settings/settings-page";

export function ViewSwitcher() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get("view");

  const goDashboard = useCallback(() => {
    router.push("/?view=dashboard", { scroll: false });
  }, [router]);

  const goSettings = useCallback(() => {
    router.push("/?view=settings", { scroll: false });
  }, [router]);

  const goSite = useCallback(() => {
    router.push("/", { scroll: false });
  }, [router]);

  if (view === "dashboard") {
    return <Dashboard onGoSettings={goSettings} />;
  }

  if (view === "settings") {
    return <SettingsPage />;
  }

  return <SiteView onGoDashboard={goDashboard} />;
}
