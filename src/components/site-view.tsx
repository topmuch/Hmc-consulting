import { SiteHeader } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Values } from "@/components/sections/values";
import { Services } from "@/components/sections/services";
import { Experience } from "@/components/sections/experience";
import { Expertise } from "@/components/sections/expertise";
import { Clients } from "@/components/sections/clients";
import { Contact } from "@/components/sections/contact";
import { SiteFooter } from "@/components/sections/footer";
import { BackToTop } from "@/components/sections/back-to-top";

export function SiteView({ onGoDashboard }: { onGoDashboard: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader onGoDashboard={onGoDashboard} />
      <main className="flex-1">
        <Hero />
        <About />
        <Values />
        <Services />
        <Experience />
        <Expertise />
        <Clients />
        <Contact />
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
