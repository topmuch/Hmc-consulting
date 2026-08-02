"use client";

import { SectionHeading } from "@/components/sections/section-heading";

const TEAM_MEMBERS = [
  {
    name: "Cheikh Lam",
    role: "Partner & Fondateur",
    bio: "Plus de 30 ans d'expérience dans le conseil en management et la stratégie d'entreprise à travers l'Afrique et l'Océan Indien. Il dirige la vision et le développement d'HMC.",
    gradient: "from-accent/60 to-sky/60",
  },
  {
    name: "Aïssatou Ba",
    role: "Directrice Conseil & Audit",
    bio: "Experte en audit opérationnel et financier, elle accompagne les entreprises dans leur diagnostic et la mise en place de stratégies de croissance durables.",
    gradient: "from-sky/60 to-accent/40",
  },
  {
    name: "Moussa Diop",
    role: "Directeur Management Opérationnel",
    bio: "Spécialiste du management de transition et de la conduite du changement, il aide les organisations à structurer leurs équipes et à piloter leur performance.",
    gradient: "from-accent/40 to-sky/50",
  },
  {
    name: "Fatou Sow",
    role: "Directrice Finance & Structuration",
    bio: "Forte d'une expérience de 15 ans en structuration financière, elle pilote les projets d'investissement et les levées de fonds pour les clients d'HMC.",
    gradient: "from-sky/50 to-accent/50",
  },
  {
    name: "Karim Benmoussa",
    role: "Consultant Senior Transformation Digitale",
    bio: "Expert en solutions digitales et innovation, il accompagne les entreprises dans leur transformation technologique et l'optimisation de leurs processus.",
    gradient: "from-accent/50 to-sky/40",
  },
];

export function Team() {
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

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-navy p-7 text-white shadow-lg"
            >
              {/* Decorative gradient */}
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-sky/25 blur-3xl group-hover:bg-sky/35 transition-colors" />

              <div className="relative flex flex-col items-center text-center">
                {/* Photo placeholder: gradient circle */}
                <div
                  className={`h-24 w-24 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-serif text-2xl font-semibold border-2 border-white/20 shadow-lg`}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold">{member.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-sky-light/90">
                  {member.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/75">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
