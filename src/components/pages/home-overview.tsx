"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PAGES } from "@/lib/site-data";
import { SectionHeading } from "@/components/sections/section-heading";

export function HomeOverview() {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Explorez HMC"
          title={
            <>
              Découvrez notre <span className="italic text-accent">univers</span>
            </>
          }
          description="Un cabinet de conseil et de management dédié aux entreprises, du diagnostic stratégique à la mise en œuvre opérationnelle."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PAGES.map((page, i) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <Link
                href={page.href}
                className="group relative flex flex-col h-full bg-card rounded-2xl border border-border p-6 hover:border-accent/40 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <page.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <span className="font-serif text-4xl font-semibold text-accent/10">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-5 font-serif text-xl font-semibold text-foreground">
                  {page.label}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                  {page.shortDescription}
                </p>

                <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-accent">
                  Découvrir
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA band */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-16 relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-navy" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky/10 blur-3xl" />
          <div className="relative px-6 sm:px-12 py-12 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white text-balance">
                Parlons de votre <span className="italic text-sky-light">projet</span>
              </h3>
              <p className="mt-2 text-white/75 max-w-xl">
                Une question, un projet de développement ou de structuration ? Notre équipe vous
                répond avec la confidentialité que méritent vos enjeux.
              </p>
            </div>
            <Link
              href="/?page=contact"
              className="inline-flex items-center gap-2 rounded-lg bg-sky text-navy px-6 py-3 text-sm font-medium hover:bg-sky-light transition-colors group whitespace-nowrap"
            >
              Nous contacter
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
