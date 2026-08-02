"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/sections/section-heading";
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

export function Team() {
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
        // Fallback to static data is already set as default
      }
    }
    fetchTeam();
  }, []);

  if (members.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Notre équipe"
          title={
            <>
              Des experts <span className="italic text-accent">engagés</span> à vos côtés
            </>
          }
          description="Notre force réside dans la diversité et la complémentarité de nos consultants, tous unis par la passion de l'excellence managériale."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
