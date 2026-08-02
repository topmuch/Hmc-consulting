"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, ChevronRight, Quote, ArrowRight, Mail, Phone, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/pages/page-layout";
import { TESTIMONIALS } from "@/lib/testimonials-data";

type TestimonialData = {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  image: string;
  project: string;
};

export function CaseStudiesView({
  onGoDashboard,
}: {
  onGoDashboard?: () => void;
}) {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>(TESTIMONIALS);
  const [filter, setFilter] = useState<string>("all");

  // Fetch testimonials from API
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/testimonials", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.testimonials && data.testimonials.length > 0) {
            setTestimonials(data.testimonials);
          }
        }
      } catch {
        // Fallback to static data
      }
    }
    fetchTestimonials();
  }, []);

  // Extract unique project types for filter
  const projectTypes = Array.from(new Set(testimonials.map((t) => t.project)));

  const filtered =
    filter === "all"
      ? testimonials
      : testimonials.filter((t) => t.project === filter);

  return (
    <PageLayout onGoDashboard={onGoDashboard}>
      {/* ── Banner ── */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 bg-secondary/50 border-b border-border overflow-hidden">
        {/* Decorative accents */}
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent/5 blur-2xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Link href="/" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Home className="h-3.5 w-3.5" />
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">Études de cas</span>
          </nav>

          <div className="flex items-start gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-px w-8 bg-accent" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  HMC
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight text-balance">
                Études de <span className="italic text-accent">cas</span>
              </h1>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed text-pretty">
                Découvrez comment nous avons accompagné nos clients dans leurs projets de transformation, de structuration et de croissance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter ── */}
      <section className="py-6 bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === "all"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Tous
            </button>
            {projectTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === type
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case Studies Grid ── */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Aucune étude de cas trouvée pour ce filtre.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl bg-navy text-white shadow-lg"
                >
                  {/* Photo */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
                  </div>

                  {/* Content overlay */}
                  <div className="p-6">
                    <span className="inline-block rounded-full bg-accent/20 border border-accent/30 px-3 py-0.5 text-[11px] font-medium text-accent mb-3">
                      {testimonial.project}
                    </span>
                    <blockquote className="text-sm leading-relaxed text-white/80 line-clamp-4 mb-4">
                      &laquo;&nbsp;{testimonial.content}&nbsp;&raquo;
                    </blockquote>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-accent/40 shrink-0">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white text-sm">{testimonial.name}</p>
                        <p className="text-xs text-sky-light/80">
                          {testimonial.role} — {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 transition-colors cursor-pointer">
                        Lire l&apos;étude
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 sm:py-24 bg-navy text-white relative overflow-hidden">
        {/* Decorative accents */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-sky/10 blur-2xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8 bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Travaillons ensemble
            </span>
            <span className="h-px w-8 bg-accent" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight max-w-2xl mx-auto text-balance">
            Vous avez un projet ? <span className="italic text-accent">Parlons-en.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Notre équipe est à votre disposition pour analyser vos besoins et vous proposer un accompagnement sur mesure.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/?page=contact"
              className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/90 transition-colors group"
            >
              Nous contacter
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="mailto:contact@hmc-consulting.pro"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Mail className="h-4 w-4" />
              contact@hmc-consulting.pro
            </a>
            <a
              href="tel:+221774551136"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Phone className="h-4 w-4" />
              +221 77 455 11 36
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
