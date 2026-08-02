"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { SERVICES, SUPPORT_ITEMS } from "@/lib/site-data";
import { servicesJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { ServiceCard } from "@/components/ui/service-card";

export function Services() {
  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Accueil", url: "https://hmc-consulting.pro" },
              { name: "Services", url: "https://hmc-consulting.pro/services" },
            ])
          ),
        }}
      />
      <section id="services" className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title={
            <>
              Une offre <span className="italic text-accent">intégrée, globale</span> et
              innovante
            </>
          }
          description="Notre offre de services permet à nos clients de répondre efficacement aux exigences des marchés, de sécuriser leur activité et de garantir leur rentabilité, de la PME au grand groupe."
        />

        {/* Three pillars */}
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} animated />
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
                Notre rôle est également d&apos;être un support ponctuel sur l&apos;ensemble
                de vos projets ou changements majeurs.
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
    </>
  );
}
