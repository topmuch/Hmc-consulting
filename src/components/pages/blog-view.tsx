"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Clock, Home, ChevronRight } from "lucide-react";
import { PageLayout } from "@/components/pages/page-layout";

/* ── Sample blog data (same as homepage + more) ── */
const ALL_POSTS = [
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
  {
    id: "4",
    slug: "conduite-changement-organisation",
    title: "Conduite du changement : pourquoi les projets échouent-ils si souvent ?",
    excerpt:
      "70 % des projets de changement organisationnel échouent. Analyse des causes profondes et recommandations pratiques pour piloter la transformation avec succès.",
    date: "2024-12-20",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    category: "Management",
  },
  {
    id: "5",
    slug: "gouvernance-entreprise-afrique",
    title: "Gouvernance d'entreprise en Afrique : vers de nouveaux standards",
    excerpt:
      "La bonne gouvernance est un facteur déterminant de la performance des entreprises africaines. Tour d'horizon des pratiques émergentes et des cadres réglementaires en évolution.",
    date: "2024-12-05",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    category: "Conseil",
  },
  {
    id: "6",
    slug: "intelligence-artificielle-conseil",
    title: "L'intelligence artificielle au service du conseil en management",
    excerpt:
      "L'IA transforme les pratiques du conseil. De l'analyse de données à la modélisation prédictive, découvrez comment les cabinets de conseil intègrent l'IA dans leurs méthodologies.",
    date: "2024-11-18",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    category: "Innovation",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogView({
  onGoDashboard,
}: {
  onGoDashboard?: () => void;
}) {
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
            <span className="text-foreground font-medium">Blog</span>
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
                Blog & <span className="italic text-accent">Actualités</span>
              </h1>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed text-pretty">
                Analyses, conseils et retours d'expérience pour accompagner le développement de votre entreprise et anticiper les évolutions des marchés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog grid ── */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_POSTS.map((post) => (
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
        </div>
      </section>
    </PageLayout>
  );
}
