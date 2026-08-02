"use client";

import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";

const TESTIMONIALS = [
  {
    quote:
      "HMC nous a accompagnés dans la structuration de notre groupe avec une rigueur et une disponibilité remarquables. Leur compréhension des enjeux africains fait toute la différence.",
    author: "Aminata Diallo",
    role: "Directrice Générale",
    company: "Sahel Finance Group",
  },
  {
    quote:
      "Grâce à l'intervention d'HMC, nous avons pu restructurer notre organisation et améliorer significativement notre performance opérationnelle en moins de six mois.",
    author: "Jean-Pierre Kouassi",
    role: "Président",
    company: "Atlantique Industries SA",
  },
  {
    quote:
      "Le conseil stratégique d'HMC a été déterminant dans notre levée de fonds. Leur réseau et leur expertise nous ont ouvert des portes que nous ne pensions pas accessibles.",
    author: "Fatou Ndiaye",
    role: "Directrice Financière",
    company: "Teranga Capital",
  },
  {
    quote:
      "Une équipe à l'écoute, qui comprend les réalités du terrain et propose des solutions pragmatiques. HMC est devenu un partenaire de confiance pour nos projets de développement.",
    author: "Omar Benali",
    role: "Directeur des Opérations",
    company: "Maghreb Logistique",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Témoignages"
          title={
            <>
              Ils nous font <span className="italic text-accent">confiance</span>
            </>
          }
          description="Découvrez ce que nos clients disent de notre accompagnement et de notre engagement à leurs côtés."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((testimonial, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-navy p-7 text-white shadow-lg"
            >
              {/* Decorative gradient */}
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-sky/25 blur-3xl group-hover:bg-sky/35 transition-colors" />
              <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-sky/10 blur-2xl" />

              <div className="relative">
                <Quote className="h-8 w-8 text-accent/40 mb-4" strokeWidth={1.5} />
                <blockquote className="italic text-white/85 leading-relaxed text-base">
                  &laquo;&nbsp;{testimonial.quote}&nbsp;&raquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-serif font-semibold text-sm border border-accent/30">
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{testimonial.author}</p>
                    <p className="text-xs text-sky-light/80">
                      {testimonial.role} — {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
