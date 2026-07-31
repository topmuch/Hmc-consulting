"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import type { PageMeta } from "@/lib/site-data";

export function PageBanner({ page }: { page: PageMeta }) {
  return (
    <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 bg-secondary/50 border-b border-border overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent/5 blur-2xl" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4"
        >
          <Link href="/" className="flex items-center gap-1 hover:text-accent transition-colors">
            <Home className="h-3.5 w-3.5" />
            Accueil
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{page.label}</span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-start gap-4"
        >
          <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent shrink-0">
            <page.icon className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                HMC
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight text-balance">
              {page.label}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed text-pretty">
              {page.longDescription}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
