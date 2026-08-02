import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TEAM_MEMBERS = [
  {
    name: "Cheikh Lam",
    role: "Partner & Fondateur",
    bio: "Plus de 30 ans d'expérience dans le conseil en management et la stratégie d'entreprise à travers l'Afrique et l'Océan Indien. Il dirige la vision et le développement d'HMC avec une conviction profonde : l'excellence managériale est le moteur de la performance durable.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    speciality: "Stratégie & Gouvernance",
    published: true,
  },
  {
    name: "Aïssatou Ba",
    role: "Directrice Conseil & Audit",
    bio: "Experte en audit opérationnel et financier, elle accompagne les entreprises dans leur diagnostic et la mise en place de stratégies de croissance durables. Sa rigueur et sa capacité d'analyse font d'elle une conseillère de confiance pour les dirigeants.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    speciality: "Audit & Diagnostic",
    published: true,
  },
  {
    name: "Moussa Diop",
    role: "Directeur Management Opérationnel",
    bio: "Spécialiste du management de transition et de la conduite du changement, il aide les organisations à structurer leurs équipes et à piloter leur performance. Son approche pragmatique garantit des résultats concrets et mesurables.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    speciality: "Management de Transition",
    published: true,
  },
  {
    name: "Fatou Sow",
    role: "Directrice Finance & Structuration",
    bio: "Forte d'une expérience de 15 ans en structuration financière, elle pilote les projets d'investissement et les levées de fonds pour les clients d'HMC. Sa connaissance des marchés financiers africains est un atout majeur.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    speciality: "Finance & Investissement",
    published: true,
  },
  {
    name: "Karim Benmoussa",
    role: "Consultant Senior Transformation Digitale",
    bio: "Expert en solutions digitales et innovation, il accompagne les entreprises dans leur transformation technologique et l'optimisation de leurs processus. Il bridge le gap entre la technologie et les enjeux métiers.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    speciality: "Transformation Digitale",
    published: true,
  },
  {
    name: "Amadou Ndiaye",
    role: "Consultant Senior Stratégie & Organisation",
    bio: "Consultant en stratégie d'entreprise avec une expertise dans l'accompagnement des PME et ETI africaines. Il aide les organisations à redéfinir leurs modèles de croissance et à optimiser leurs structures opérationnelles.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    speciality: "Stratégie & Organisation",
    published: true,
  },
  {
    name: "Marie Dupont",
    role: "Responsable Business Development",
    bio: "Passionnée par le développement commercial et la création de partenariats stratégiques, elle identifie les opportunités de croissance et développe le réseau de clients d'HMC en Afrique de l'Ouest et centrale.",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=face",
    speciality: "Business Development",
    published: true,
  },
  {
    name: "Ousmane Sylla",
    role: "Consultant Juridique & Conformité",
    bio: "Spécialiste du droit des affaires et de la conformité réglementaire en Afrique, il accompagne les entreprises dans la structuration juridique de leurs opérations et le respect des cadres réglementaires locaux et internationaux.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    speciality: "Juridique & Conformité",
    published: true,
  },
];

async function main() {
  console.log("Seeding team members...");
  
  // Check if team members already exist
  const count = await prisma.teamMember.count();
  if (count > 0) {
    console.log(`Team members already exist (${count} found). Skipping seed.`);
    return;
  }

  for (const m of TEAM_MEMBERS) {
    await prisma.teamMember.create({ data: m });
  }
  
  console.log(`Seeded ${TEAM_MEMBERS.length} team members.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
