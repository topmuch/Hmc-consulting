"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Home, Target } from "lucide-react";
import type { Product } from "@/lib/products-data";
import { PRODUCTS } from "@/lib/products-data";
import { PageLayout } from "./page-layout";
import { PageBanner } from "./page-banner";
import { PAGES } from "@/lib/site-data";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export function ProductDetail({
  product,
  onGoDashboard,
}: {
  product: Product;
  onGoDashboard?: () => void;
}) {
  const produitsPage = PAGES.find((p) => p.id === "produits")!;
  const otherProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            category: product.category,
            url: `https://hmc-consulting.pro/produits/${product.id}`,
            brand: { "@type": "Brand", name: "HMC — Horizon Management Consulting" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Accueil", url: "https://hmc-consulting.pro" },
              { name: "Produits", url: "https://hmc-consulting.pro/produits" },
              { name: product.name, url: `https://hmc-consulting.pro/produits/${product.id}` },
            ])
          ),
        }}
      />
      <PageLayout onGoDashboard={onGoDashboard}>
      {/* Breadcrumb banner */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 bg-secondary/50 border-b border-border overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Link href="/" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Home className="h-3.5 w-3.5" />
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/?page=produits" className="hover:text-accent transition-colors">
              Nos Produits
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-4"
          >
            <div
              className={`hidden sm:flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${product.gradient} text-white shrink-0 shadow-lg`}
            >
              <product.icon className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent mb-2">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
                {product.name}
              </h1>
              <p className="mt-2 text-lg font-medium text-accent">{product.tagline}</p>
              <p className="mt-3 text-base text-muted-foreground max-w-2xl leading-relaxed">
                {product.description}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero image */}
      <section className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[21/9]"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Long description */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Présentation
              </span>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {product.longDescription}
            </p>

            {/* Target audience */}
            <div className="mt-8 flex items-start gap-4 rounded-xl border border-border bg-secondary/30 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Public cible
                </div>
                <div className="mt-1 text-sm text-foreground">{product.targetAudience}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 bg-secondary/40 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-8 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Fonctionnement
              </span>
              <span className="h-px w-8 bg-accent" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
              Comment ça marche&nbsp;?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {product.howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-card rounded-2xl border border-border p-6"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${product.gradient} text-white font-serif text-xl font-semibold shadow-md`}
                >
                  {step.step}
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                {i < product.howItWorks.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 h-5 w-5 text-accent/30 -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-8 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Fonctionnalités
              </span>
              <span className="h-px w-8 bg-accent" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
              Tout ce dont vous avez besoin
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {product.features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="group bg-card rounded-2xl border border-border p-6 hover:border-accent/40 hover:shadow-lg transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <feature.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 font-medium text-foreground">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 bg-navy text-white overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-sky/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-sky/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-sky-light" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-light">
                Bénéfices
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white">
              Pourquoi choisir {product.name}&nbsp;?
            </h2>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {product.benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-xl bg-white/[0.05] border border-white/10 p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky/20 text-sky-light shrink-0">
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <span className="text-sm text-white/90">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col sm:flex-row gap-3">
            <Link
              href="/?page=contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky text-navy px-6 py-3 text-sm font-medium hover:bg-sky-light transition-colors group"
            >
              Demander une démo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/?page=produits"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 text-white px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Tous les produits
            </Link>
          </div>
        </div>
      </section>

      {/* Other products */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-8">
            Découvrez nos autres solutions
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {otherProducts.map((p) => (
              <Link
                key={p.id}
                href={`/?product=${p.id}`}
                className="group flex items-center gap-4 bg-card rounded-2xl border border-border p-5 hover:border-accent/40 hover:shadow-lg transition-all"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${p.gradient} text-white shrink-0`}
                >
                  <p.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <div className="font-serif text-base font-semibold text-foreground">{p.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{p.tagline}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-accent ml-auto shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
    </>
  );
}
