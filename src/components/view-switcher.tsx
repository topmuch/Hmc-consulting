"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { SiteView } from "@/components/site-view";
import { Dashboard } from "@/components/dashboard/dashboard";
import { SettingsPage } from "@/components/settings/settings-page";
import { PageView } from "@/components/pages/page-view";
import { ProductsOverview } from "@/components/pages/products-overview";
import { ProductDetail } from "@/components/pages/product-detail";
import { BlogView } from "@/components/pages/blog-view";
import { BlogDetailView } from "@/components/pages/blog-detail-view";
import { TeamView } from "@/components/pages/team-view";
import { CaseStudiesView } from "@/components/pages/case-studies-view";
import { getProductById } from "@/lib/products-data";
import { I18nProvider } from "@/lib/i18n";

export function ViewSwitcher() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get("view");
  const page = searchParams.get("page");
  const product = searchParams.get("product");
  const blog = searchParams.get("blog");

  const goDashboard = useCallback(() => {
    router.push("/?view=dashboard", { scroll: false });
  }, [router]);

  const goSettings = useCallback(() => {
    router.push("/?view=settings", { scroll: false });
  }, [router]);

  let content: React.ReactNode;

  if (view === "dashboard") {
    content = <Dashboard onGoSettings={goSettings} />;
  } else if (view === "settings") {
    content = <SettingsPage />;
  } else if (product) {
    const prod = getProductById(product);
    if (prod) {
      content = <ProductDetail product={prod} onGoDashboard={goDashboard} />;
    } else {
      content = <ProductsOverview onGoDashboard={goDashboard} />;
    }
  } else if (page === "produits") {
    content = <ProductsOverview onGoDashboard={goDashboard} />;
  } else if (page === "equipe") {
    content = <TeamView onGoDashboard={goDashboard} />;
  } else if (page === "etudes") {
    content = <CaseStudiesView onGoDashboard={goDashboard} />;
  } else if (blog) {
    content = <BlogDetailView postId={blog} onGoDashboard={goDashboard} />;
  } else if (page === "blog") {
    content = <BlogView onGoDashboard={goDashboard} />;
  } else if (page) {
    content = <PageView pageId={page} onGoDashboard={goDashboard} />;
  } else {
    content = <SiteView onGoDashboard={goDashboard} />;
  }

  return <I18nProvider>{content}</I18nProvider>;
}
