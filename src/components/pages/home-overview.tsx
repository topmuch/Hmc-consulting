"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { SERVICES } from "@/lib/site-data";
import { PRODUCTS } from "@/lib/products-data";

export function HomeOverview() {
  return (
    <>
      {/* ── Services section ── */}
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

          {/* Three service pillars */}
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-2xl bg-navy p-7 text-white shadow-lg"
              >
                {/* Decorative gradient */}
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-sky/25 blur-3xl group-hover:bg-sky/35 transition-colors" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-sky-light border border-white/10">
                      <service.icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <span className="font-serif text-5xl font-semibold text-white/10">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-serif text-2xl font-semibold">{service.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-sky-light/90">
                    {service.subtitle}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-white/75">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Link to full services page */}
          <div className="mt-10 text-center">
            <Link
              href="/?page=services"
              className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/90 transition-colors group"
            >
              Voir tous nos services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Products section ── */}
      <section className="py-20 sm:py-28 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Nos produits"
            title={
              <>
                Solutions <span className="italic text-accent">digitales</span> innovantes
              </>
            }
            description="Découvrez notre gamme de solutions basées sur la technologie QR code, conçues pour la traçabilité, la logistique et l'expérience client."
            align="center"
            className="mx-auto"
          />

          {/* Products grid */}
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <Link
                key={product.id}
                href={`/?product=${product.id}`}
                className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:border-transparent transition-all duration-300"
              >
                {/* Image / gradient header */}
                <div className={`relative h-44 bg-gradient-to-br ${product.gradient} overflow-hidden`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover mix-blend-overlay opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white">
                    <product.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <span className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-medium text-white">
                    {product.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-accent">
                    {product.tagline}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Top benefits */}
                  <ul className="mt-4 space-y-1.5">
                    {product.benefits.slice(0, 2).map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" strokeWidth={2.5} />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-accent">
                    Voir le produit
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Link to full products page */}
          <div className="mt-10 text-center">
            <Link
              href="/?page=produits"
              className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/90 transition-colors group"
            >
              Voir tous nos produits
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
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
          </div>
        </div>
      </section>
    </>
  );
}
