"use client";

import { PageLayout } from "@/components/pages/page-layout";
import { PageBanner } from "@/components/pages/page-banner";
import { Team } from "@/components/sections/team";
import { PAGES } from "@/lib/site-data";

const TEAM_PAGE = PAGES.find((p) => p.id === "equipe")!;

export function TeamView({
  onGoDashboard,
}: {
  onGoDashboard?: () => void;
}) {
  return (
    <PageLayout onGoDashboard={onGoDashboard}>
      <PageBanner page={TEAM_PAGE} />
      <Team />
    </PageLayout>
  );
}
