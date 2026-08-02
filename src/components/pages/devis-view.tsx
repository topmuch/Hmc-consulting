"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Home,
  ChevronRight,
  Layers,
  Settings2,
  Sparkles,
  Package,
  GraduationCap,
} from "lucide-react";
import { PageLayout } from "@/components/pages/page-layout";
import { SERVICES } from "@/lib/site-data";
import { PRODUCTS } from "@/lib/products-data";
import { FEATURED_FORMATIONS } from "@/lib/formations-data";
import { QuoteGenerator } from "@/components/sections/quote-generator";
import { ServiceCard } from "@/components/ui/service-card";
import { ProductCard } from "@/components/ui/product-card";
import { useTranslation } from "@/lib/i18n";

const SERVICE_ICONS = [Layers, Settings2, Sparkles];

export function DevisView({
  onGoDashboard,
}: {
  onGoDashboard?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <PageLayout onGoDashboard={onGoDashboard}>
      {/* ── Banner ── */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-accent/10" />
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-accent/8 blur-2xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
            <Link href="/" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Home className="h-3.5 w-3.5" />
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">Devis</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-accent" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  {t("devis.eyebrow")}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight text-balance">
                {t("devis.title1")} <span className="italic text-accent">{t("devis.title2")}</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed text-pretty">
                {t("devis.description")}
              </p>
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent font-bold text-base">
                    {SERVICES.length}
                  </span>
                  <span className="font-medium text-foreground">Services</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent font-bold text-base">
                    {PRODUCTS.length}
                  </span>
                  <span className="font-medium text-foreground">Produits</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent font-bold text-base">
                    {FEATURED_FORMATIONS.length}
                  </span>
                  <span className="font-medium text-foreground">Formations</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services section ── */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-8 bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Services
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
            Nos <span className="italic text-accent">services</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl">
            Un cabinet de conseil et de management dédié aux entreprises, du diagnostic stratégique à la mise en œuvre opérationnelle.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} />
            ))}
          </div>

          <div className="mt-8 text-center">
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
      <section className="py-16 sm:py-20 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-8 bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Produits
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
            Solutions <span className="italic text-accent">digitales innovantes</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl">
            Découvrez notre gamme de solutions basées sur la technologie QR code, conçues pour la traçabilité, la logistique et l'expérience client.
          </p>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center">
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

      {/* ── Formations section ── */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-8 bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Formations
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
            Nos domaines de <span className="italic text-accent">formation</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl">
            Développez les compétences de vos équipes grâce à nos formations sur mesure, dispensées par des experts et adaptées aux réalités du marché africain.
          </p>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_FORMATIONS.map((domain) => (
              <FormationDevisCard key={domain.id} domain={domain} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/?page=formations"
              className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/90 transition-colors group"
            >
              Voir toutes les formations
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quote Generator ── */}
      <QuoteGenerator />
    </PageLayout>
  );
}

/* ── Formation card for Devis page ── */
function FormationDevisCard({ domain }: { domain: any }) {
  const Icon = domain.icon;

  return (
    <Link
      href={`/?page=formations&domain=${domain.id}`}
      className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:border-transparent transition-all duration-300"
    >
      {/* Image / gradient header */}
      <div className={`relative h-44 bg-gradient-to-br ${domain.gradient} overflow-hidden`}>
        <Image
          src={domain.image}
          alt={domain.name}
          fill
          className="object-cover mix-blend-overlay opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white">
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <span className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-medium text-white">
          {domain.courses.length} formation{domain.courses.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-serif text-xl font-semibold text-foreground">
          {domain.name}
        </h3>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
          {domain.description}
        </p>
        <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-accent">
          Découvrir
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
