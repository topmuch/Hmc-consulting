"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./section-heading";
import { VALUES } from "@/lib/site-data";

export function Values() {
  return (
    <section id="valeurs" className="py-20 sm:py-28 bg-secondary/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Nos Valeurs"
          title={
            <>
              Les piliers de <span className="italic text-accent">notre démarche</span>
            </>
          }
          description="Quatre principes fondamentaux guident chacune de nos interventions et structurent la relation de confiance que nous entretenons avec nos clients."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="group relative bg-background rounded-2xl p-6 border border-border hover:border-accent/40 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <value.icon className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 font-serif text-xl font-semibold text-foreground">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
              <span className="mt-5 block font-serif text-5xl font-semibold text-accent/10 group-hover:text-accent/20 transition-colors">
                0{i + 1}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
