"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./section-heading";
import { CLIENTS } from "@/lib/site-data";

export function Clients() {
  return (
    <section className="py-20 sm:py-24 bg-secondary/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Ils nous ont fait confiance"
          title={
            <>
              Des partenaires de <span className="italic text-accent">renom</span>
            </>
          }
          description="Hôtels, groupes hôteliers et promoteurs immobiliers nous confient leurs actifs les plus stratégiques, du Luxe à l'économique."
          align="center"
          className="mx-auto"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {CLIENTS.map((client) => (
            <div
              key={client.name}
              className="group flex flex-col items-center justify-center gap-4 bg-background rounded-2xl border border-border p-8 hover:border-accent/40 hover:shadow-md transition-all aspect-[5/3]"
            >
              <div className="h-16 flex items-center justify-center">
                <img
                  src={client.logo}
                  alt={`Logo ${client.name}`}
                  className="max-h-16 w-auto object-contain opacity-70 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all"
                />
              </div>
              <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground text-center">
                {client.name}
              </span>
            </div>
          ))}

          {/* Placeholder cards to suggest more clients */}
          {[
            "Hôtels & Resorts",
            "Groupes hôteliers",
            "Promoteurs immobiliers",
            "Investisseurs",
          ].map((label) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-2 bg-background/50 rounded-2xl border border-dashed border-border p-8 aspect-[5/3]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent font-serif text-lg">
                +
              </div>
              <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground text-center">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        <p className="mt-10 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          Discrétion et confidentialité sont au cœur de nos engagements. De nombreuses
          références sont disponibles sur demande.
        </p>
      </div>
    </section>
  );
}
