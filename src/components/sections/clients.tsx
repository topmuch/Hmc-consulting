"use client";

import { motion } from "framer-motion";
import { Building2, Users, Wallet, Landmark } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { SECTORS } from "@/lib/site-data";

const ICONS = [Building2, Users, Wallet, Landmark];

export function Clients() {
  return (
    <section className="py-20 sm:py-24 bg-secondary/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Ils nous font confiance"
          title={
            <>
              Des clients de <span className="italic text-accent">tous horizons</span>
            </>
          }
          description="Entreprises, groupes, investisseurs et institutions nous confient leurs projets les plus stratégiques, de la PME en croissance aux organisations les plus complexes."
          align="center"
          className="mx-auto"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {SECTORS.map((sector, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={sector.name}
                className="group flex flex-col items-start gap-4 bg-background rounded-2xl border border-border p-8 hover:border-accent/40 hover:shadow-md transition-all"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {sector.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {sector.description}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>

        <p className="mt-10 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          Discrétion et confidentialité sont au cœur de nos engagements. De nombreuses
          références sont disponibles sur demande.
        </p>
      </div>
    </section>
  );
}
