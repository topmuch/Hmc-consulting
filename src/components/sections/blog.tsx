"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";

/* ── Sample blog data ── */
const SAMPLE_POSTS = [
  {
    id: "1",
    slug: "transformation-digitale-afrique",
    title: "La transformation digitale en Afrique : opportunités et défis pour les entreprises",
    excerpt:
      "L'Afrique connaît une révolution numérique sans précédent. Comment les entreprises peuvent-elles tirer parti de cette dynamique pour accélérer leur croissance et renforcer leur compétitivité ?",
    date: "2025-02-15",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    category: "Transformation",
  },
  {
    id: "2",
    slug: "management-transition-pme",
    title: "Management de transition : un levier stratégique pour les PME africaines",
    excerpt:
      "Le management de transition s'impose comme une solution agile pour les entreprises en période de changement. Découvrez comment cette approche peut sécuriser vos transitions organisationnelles.",
    date: "2025-01-28",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
    category: "Management",
  },
  {
    id: "3",
    slug: "structuration-financiere-projets",
    title: "Structuration financière : clés de succès pour vos projets d'investissement",
    excerpt:
      "La structuration financière est un art qui demande rigueur et vision stratégique. Nos experts partagent les bonnes pratiques pour mobiliser les ressources et sécuriser vos investissements.",
    date: "2025-01-10",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    category: "Finance",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function Blog() {
  return (
    <section className="py-20 sm:py-28 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Blog & Actualités"
          title={
            <>
              Nos dernières <span className="italic text-accent">publications</span>
            </>
          }
          description="Analyses, conseils et retours d'expérience pour accompagner le développement de votre entreprise et anticiper les évolutions des marchés."
          align="center"
          className="mx-auto"
        />

        {/* Blog cards grid */}
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_POSTS.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:border-transparent transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-medium text-white">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                {/* Date & read time */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="mt-3 font-serif text-lg font-semibold text-foreground leading-snug line-clamp-2">
                  {post.title}
                </h3>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                  {post.excerpt}
                </p>

                <Link
                  href="/?page=blog"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  Lire la suite
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Link to full blog page */}
        <div className="mt-10 text-center">
          <Link
            href="/?page=blog"
            className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/90 transition-colors group"
          >
            Voir tous les articles
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
