"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { SERVICES, SUPPORT_ITEMS } from "@/lib/site-data";

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Nos Services"
          title={
            <>
              Une offre <span className="italic text-accent">intégrée, globale</span> et
              innovante
            </>
          }
          description="Notre offre de services permet à nos clients de répondre efficacement aux exigences des pratiques de l'évolution du métier de l'hôtellerie, et de sécuriser leur activité tout en garantissant leur rentabilité."
        />

        {/* Three pillars */}
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="group relative overflow-hidden rounded-2xl bg-charcoal p-7 text-white shadow-lg"
            >
              {/* Decorative gradient */}
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-accent/20 blur-3xl group-hover:bg-accent/30 transition-colors" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-gold-light border border-white/10">
                    <service.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <span className="font-serif text-5xl font-semibold text-white/10">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-semibold">{service.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gold-light/90">
                  {service.subtitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/75">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support matrix */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-16 rounded-2xl border border-border bg-secondary/30 p-6 sm:p-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-foreground">
                Support ponctuel sur vos projets
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Notre rôle est également d&apos;être un support ponctuel sur l&apos;ensemble de
                vos projets ou changements majeurs.
              </p>
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              Accompagnement de proximité
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SUPPORT_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group rounded-xl bg-background border border-border p-4 hover:border-accent/40 hover:shadow-md transition-all"
              >
                <ArrowUpRight className="h-4 w-4 text-accent mb-2 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                <h4 className="font-medium text-sm text-foreground">{item.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
