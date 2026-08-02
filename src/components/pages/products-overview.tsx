"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/products-data";
import { PageBanner } from "./page-banner";
import { PageLayout } from "./page-layout";
import { PAGES } from "@/lib/site-data";
import { productsJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { ProductCard } from "@/components/ui/product-card";

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
              { name: "Produits", url: "https://hmc-consulting.pro/produits" },
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
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} animated />
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
