"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { PRODUCTS } from "@/lib/products-data";
import { PageBanner } from "./page-banner";
import { PageLayout } from "./page-layout";
import { PAGES } from "@/lib/site-data";
import { productsJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

export function ProductsOverview({ onGoDashboard }: { onGoDashboard?: () => void }) {
  const page = PAGES.find((p) => p.id === "produits")!;

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Accueil", url: "https://hmc-consulting.pro" },
              { name: "Produits", url: "https://hmc-consulting.pro/?page=produits" },
            ])
          ),
        }}
      />
      <PageLayout onGoDashboard={onGoDashboard}>
      <PageBanner page={page} />

      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Products grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
              >
                <Link
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
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="mt-16 rounded-2xl bg-secondary/40 border border-border p-8 sm:p-10 text-center"
          >
            <h3 className="font-serif text-2xl font-semibold text-foreground">
              Une solution sur-mesure pour votre activité&nbsp;?
            </h3>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Nos équipes vous accompagnent pour adapter nos solutions à vos besoins spécifiques,
              de la conception au déploiement.
            </p>
            <Link
              href="/?page=contact"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/90 transition-colors group"
            >
              Demander une démo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
    </>
  );
}
