"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PAGES } from "@/lib/site-data";
import { SectionHeading } from "@/components/sections/section-heading";

// Only show these pages on the homepage overview section
const HOME_OVERVIEW_IDS = ["services", "produits"];

const CARD_STYLES: Record<string, { gradient: string; iconBg: string; glow: string }> = {
  services: {
    gradient: "from-[#003070] via-[#003a82] to-[#0050a0]",
    iconBg: "bg-white/15",
    glow: "bg-sky-400/20",
  },
  produits: {
    gradient: "from-[#003070] via-[#1a5276] to-[#2e86c1]",
    iconBg: "bg-white/15",
    glow: "bg-sky-300/20",
  },
};

export function HomeOverview() {
  const overviewPages = PAGES.filter((p) => HOME_OVERVIEW_IDS.includes(p.id));

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

        {/* Two large feature cards */}
        <div className="mt-14 grid md:grid-cols-2 gap-6 lg:gap-8">
          {overviewPages.map((page, i) => {
            const style = CARD_STYLES[page.id] ?? CARD_STYLES.services;
            return (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Link
                  href={page.href}
                  className="group relative flex flex-col justify-between min-h-[320px] sm:min-h-[380px] rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl"
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`} />

                  {/* Decorative glow circles */}
                  <div className={`pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full ${style.glow} blur-3xl`} />
                  <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full p-8 sm:p-10">
                    {/* Icon */}
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${style.iconBg} backdrop-blur-sm`}>
                      <page.icon className="h-8 w-8 text-white" strokeWidth={1.4} />
                    </div>

                    {/* Title */}
                    <h3 className="mt-6 font-serif text-2xl sm:text-3xl font-semibold text-white">
                      {page.label}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-white/75 leading-relaxed text-sm sm:text-base max-w-md">
                      {page.longDescription}
                    </p>

                    {/* CTA */}
                    <div className="mt-auto pt-8 flex items-center gap-2 text-sm font-medium text-sky-200 group-hover:text-white transition-colors">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 backdrop-blur-sm px-5 py-2.5 group-hover:bg-white/20 transition-colors">
                        Découvrir
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>

                  {/* Hover accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-300 via-sky-200 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                </Link>
              </motion.div>
            );
          })}
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
