import { SiteHeader } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { HomeOverview } from "@/components/pages/home-overview";
import { SiteFooter } from "@/components/sections/footer";
import { BackToTop } from "@/components/sections/back-to-top";
import {
  organizationJsonLd,
  webSiteJsonLd,
  localBusinessJsonLd,
} from "@/lib/jsonld";

export function SiteView({ onGoDashboard }: { onGoDashboard: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd()),
        }}
      />

      <SiteHeader onGoDashboard={onGoDashboard} />
      <main className="flex-1">
        <Hero />
        <About />
        <HomeOverview />
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
