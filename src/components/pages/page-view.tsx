"use client";

import { PageLayout } from "./page-layout";
import { PageBanner } from "./page-banner";
import { About } from "@/components/sections/about";
import { Values } from "@/components/sections/values";
import { Services } from "@/components/sections/services";
import { Experience } from "@/components/sections/experience";
import { Expertise } from "@/components/sections/expertise";
import { Contact } from "@/components/sections/contact";
import { PAGES, type PageMeta } from "@/lib/site-data";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const PAGE_LABELS: Record<string, string> = {
  histoire: "À propos",
  valeurs: "Valeurs",
  services: "Services",
  experience: "Expérience",
  expertise: "Expertise",
  contact: "Contact",
};

function PageJsonLd({ pageId }: { pageId: string }) {
  const label = PAGE_LABELS[pageId] || pageId;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          breadcrumbJsonLd([
            { name: "Accueil", url: "https://hmc-consulting.pro" },
            { name: label, url: `https://hmc-consulting.pro/${pageId}` },
          ])
        ),
      }}
    />
  );
}

function PageContent({ pageId }: { pageId: string }) {
  switch (pageId) {
    case "histoire":
      return <About />;
    case "valeurs":
      return <Values />;
    case "services":
      return <Services />;
    case "experience":
      return <Experience />;
    case "expertise":
      return <Expertise />;
    case "contact":
      return <Contact />;
    default:
      return null;
  }
}

export function PageView({
  pageId,
  onGoDashboard,
}: {
  pageId: string;
  onGoDashboard?: () => void;
}) {
  const page: PageMeta | undefined = PAGES.find((p) => p.id === pageId);

  if (!page) {
    return (
      <PageLayout onGoDashboard={onGoDashboard}>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-serif text-3xl font-semibold text-foreground">Page introuvable</h1>
          <p className="mt-3 text-muted-foreground">La page demandée n'existe pas.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageJsonLd pageId={pageId} />
      <PageLayout onGoDashboard={onGoDashboard}>
        <PageBanner page={page} />
        <PageContent pageId={pageId} />
      </PageLayout>
    </>
  );
}
