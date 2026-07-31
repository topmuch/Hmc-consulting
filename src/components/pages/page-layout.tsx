"use client";

import { SiteHeader } from "@/components/sections/header";
import { SiteFooter } from "@/components/sections/footer";
import { BackToTop } from "@/components/sections/back-to-top";

export function PageLayout({
  children,
  onGoDashboard,
}: {
  children: React.ReactNode;
  onGoDashboard?: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader onGoDashboard={onGoDashboard} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
