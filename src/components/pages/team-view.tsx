"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, ChevronRight, ArrowRight, Mail, Phone } from "lucide-react";
import { PageLayout } from "@/components/pages/page-layout";
import { TEAM_MEMBERS, type TeamMember } from "@/lib/team-data";

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-navy text-white shadow-lg">
      {/* Photo */}
      <div className="relative h-72 overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-serif text-xl font-semibold">{member.name}</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-sky-light/90">
          {member.role}
        </p>
        <span className="mt-2 inline-block rounded-full bg-accent/20 border border-accent/30 px-3 py-0.5 text-[11px] font-medium text-accent">
          {member.speciality}
        </span>
      </div>

      {/* Hover bio overlay */}
      <div className="absolute inset-0 bg-navy/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-accent/40 mb-4">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-top"
            sizes="80px"
          />
        </div>
        <h3 className="font-serif text-lg font-semibold">{member.name}</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-sky-light/90">
          {member.role}
        </p>
        <span className="mt-2 inline-block rounded-full bg-accent/20 border border-accent/30 px-3 py-0.5 text-[11px] font-medium text-accent">
          {member.speciality}
        </span>
        <p className="mt-4 text-sm leading-relaxed text-white/75">{member.bio}</p>
      </div>
    </div>
  );
}

export function TeamView({
  onGoDashboard,
}: {
  onGoDashboard?: () => void;
}) {
  const [members, setMembers] = useState<TeamMember[]>(TEAM_MEMBERS);

  // Fetch team members from API
  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch("/api/team", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.teamMembers && data.teamMembers.length > 0) {
            setMembers(data.teamMembers);
          }
        }
      } catch {
        // Fallback to static data
      }
    }
    fetchTeam();
  }, []);

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
            <span className="text-foreground font-medium">Équipe</span>
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
                Notre <span className="italic text-accent">équipe</span>
              </h1>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed text-pretty">
                Découvrez les consultants et experts qui font la force d&apos;HMC. Notre force réside dans la diversité et la complémentarité de nos talents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team grid ── */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {members.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
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
