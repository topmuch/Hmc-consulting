"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { SiteView } from "@/components/site-view";
import { Dashboard } from "@/components/dashboard/dashboard";
import { SettingsPage } from "@/components/settings/settings-page";
import { PageView } from "@/components/pages/page-view";
import { ProductsOverview } from "@/components/pages/products-overview";
import { ProductDetail } from "@/components/pages/product-detail";
import { getProductById } from "@/lib/products-data";

export function ViewSwitcher() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get("view");
  const page = searchParams.get("page");
  const product = searchParams.get("product");

  const goDashboard = useCallback(() => {
    router.push("/?view=dashboard", { scroll: false });
  }, [router]);

  const goSettings = useCallback(() => {
    router.push("/?view=settings", { scroll: false });
  }, [router]);

  if (view === "dashboard") {
    return <Dashboard onGoSettings={goSettings} />;
  }

  if (view === "settings") {
    return <SettingsPage />;
  }

  // Individual product detail page
  if (product) {
    const prod = getProductById(product);
    if (prod) {
      return <ProductDetail product={prod} onGoDashboard={goDashboard} />;
    }
    // Fallback to products overview
    return <ProductsOverview onGoDashboard={goDashboard} />;
  }

  // Products overview page
  if (page === "produits") {
    return <ProductsOverview onGoDashboard={goDashboard} />;
  }

  // A dedicated content page (histoire, valeurs, services, etc.)
  if (page) {
    return <PageView pageId={page} onGoDashboard={goDashboard} />;
  }

  // Default: homepage
  return <SiteView onGoDashboard={goDashboard} />;
}
