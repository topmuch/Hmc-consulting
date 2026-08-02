"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { FEATURED_FORMATIONS, type FormationDomain } from "@/lib/formations-data";
import { useTranslation } from "@/lib/i18n";

function FormationCard({ domain }: { domain: FormationDomain }) {
  const Icon = domain.icon;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:border-accent/30 transition-all duration-300">
      {/* Decorative gradient */}
      <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-accent/5 blur-2xl group-hover:bg-accent/10 transition-colors" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${domain.color} border border-border`}>
            <Icon className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-lg font-semibold text-foreground leading-snug">
              {domain.name}
            </h3>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {domain.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-accent">
            {domain.courses.length} formation{domain.courses.length > 1 ? "s" : ""}
          </span>
          <Link
            href={`/?page=formations&domain=${domain.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors group/link"
          >
            Découvrir
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Formations() {
  const { t } = useTranslation();

  return (
    <section className="py-20 sm:py-28 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("formations.eyebrow")}
          title={
            <>
              {t("formations.title1")} <span className="italic text-accent">{t("formations.title2")}</span>
            </>
          }
          description={t("formations.description")}
          align="center"
          className="mx-auto"
        />

        {/* Featured formations grid */}
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_FORMATIONS.map((domain) => (
            <FormationCard key={domain.id} domain={domain} />
          ))}
        </div>

        {/* Link to full formations page */}
        <div className="mt-10 text-center">
          <Link
            href="/?page=formations"
            className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/90 transition-colors group"
          >
            {t("formations.viewAll")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
