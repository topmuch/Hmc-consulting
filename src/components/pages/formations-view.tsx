"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, ChevronRight, Clock, Users, Filter, Search } from "lucide-react";
import { PageLayout } from "@/components/pages/page-layout";
import { FORMATION_DOMAINS, type FormationDomain, type FormationCourse } from "@/lib/formations-data";
import { cn } from "@/lib/utils";

export function FormationsView({
  onGoDashboard,
}: {
  onGoDashboard?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const filtered = FORMATION_DOMAINS.filter((d) => {
    if (selectedDomain && d.id !== selectedDomain) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.courses.some((c) => c.title.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalCourses = FORMATION_DOMAINS.reduce(
    (sum, d) => sum + d.courses.length,
    0
  );

  return (
    <PageLayout onGoDashboard={onGoDashboard}>
      {/* ── Banner ── */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 bg-secondary/50 border-b border-border overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent/5 blur-2xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Link href="/" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Home className="h-3.5 w-3.5" />
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">Formations</span>
          </nav>

          <div className="flex items-start gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-px w-8 bg-accent" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  HMC Academy
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight text-balance">
                Nos <span className="italic text-accent">formations</span>
              </h1>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed text-pretty">
                Développez les compétences de vos équipes grâce à nos formations sur mesure, dispensées par des experts et adaptées aux réalités du marché africain.
              </p>
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold text-sm">
                    {FORMATION_DOMAINS.length}
                  </span>
                  Domaines
                </span>
                <span className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold text-sm">
                    {totalCourses}
                  </span>
                  Formations
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search & Filter ── */}
      <section className="py-6 bg-background border-b border-border sticky top-20 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un domaine ou une formation…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 pl-9 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring"
              />
            </div>

            {/* Domain filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDomain(null)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors border",
                  !selectedDomain
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-muted/50 text-muted-foreground border-border hover:bg-accent/10 hover:text-accent"
                )}
              >
                Tous
              </button>
              {FORMATION_DOMAINS.slice(0, 8).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDomain(selectedDomain === d.id ? null : d.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors border whitespace-nowrap",
                    selectedDomain === d.id
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-muted/50 text-muted-foreground border-border hover:bg-accent/10 hover:text-accent"
                  )}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Domains grid ── */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                Aucun domaine ne correspond à votre recherche.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {filtered.map((domain) => (
                <DomainSection key={domain.id} domain={domain} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-20 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-navy" />
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky/10 blur-3xl" />
            <div className="relative px-6 sm:px-12 py-12 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white text-balance">
                  Besoin d&apos;une formation <span className="italic text-sky-light">sur mesure</span> ?
                </h3>
                <p className="mt-2 text-white/75 max-w-xl">
                  Nos experts conçoivent des programmes adaptés à vos enjeux spécifiques. Contactez-nous pour un programme personnalisé.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-sky text-navy px-6 py-3 text-sm font-medium hover:bg-sky-light transition-colors group whitespace-nowrap"
              >
                Nous contacter
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

function DomainSection({ domain }: { domain: FormationDomain }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = domain.icon;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Domain header */}
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${domain.color} border border-border shrink-0`}>
            <Icon className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">
              {domain.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {domain.description}
            </p>
          </div>
        </div>

        {/* Courses list */}
        <div className="mt-6 space-y-3">
          {(expanded ? domain.courses : domain.courses.slice(0, 2)).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {domain.courses.length > 2 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 text-sm font-medium text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-1"
          >
            {expanded ? "Voir moins" : `Voir les ${domain.courses.length - 2} autres formations`}
            <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-90")} />
          </button>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: FormationCourse }) {
  const levelColors: Record<string, string> = {
    "Débutant": "bg-blue-500/10 text-blue-600 border-blue-500/30",
    "Intermédiaire": "bg-amber-500/10 text-amber-600 border-amber-500/30",
    "Avancé": "bg-red-500/10 text-red-600 border-red-500/30",
    "Tous niveaux": "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 hover:bg-accent/5 hover:border-accent/20 transition-colors">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-foreground">{course.title}</h4>
        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {course.targetAudience}
          </span>
        </p>
      </div>
      <span className={cn("shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap", levelColors[course.level] || "bg-muted text-muted-foreground border-border")}>
        {course.level}
      </span>
    </div>
  );
}
