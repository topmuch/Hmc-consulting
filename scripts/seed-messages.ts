// Seed sample contact messages for the dashboard demo
import { db } from "@/lib/db";

type SampleMsg = {
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: string;
  message: string;
  daysAgo: number;
  hour: number;
};

const SAMPLES: SampleMsg[] = [
  {
    name: "Aminata Sow",
    email: "a.sow@baobab-group.com",
    company: "Groupe Baobab",
    phone: "+221 77 123 45 67",
    subject: "Demande d'audit opérationnel",
    message:
      "Bonjour, nous gérons un groupe de 4 sociétés et souhaitons un audit opérationnel complet de nos processus. Pouvez-vous nous proposer un plan d'intervention ?",
    daysAgo: 0,
    hour: 9,
  },
  {
    name: "Karim Benali",
    email: "k.benali@technosys.ma",
    company: "TechnoSys Maroc",
    phone: "+212 661 22 33 44",
    subject: "Stratégie de croissance",
    message:
      "Notre entreprise de services informatiques souhaite doubler de taille en 3 ans. Nous cherchons un accompagnement stratégique pour structurer cette croissance.",
    daysAgo: 1,
    hour: 14,
  },
  {
    name: "Fatou Diallo",
    email: "fatou.diallo@invest-ci.com",
    company: "Invest CI",
    phone: "+225 07 88 99 00",
    subject: "Recherche de financements",
    message:
      "Nous sommes à la recherche de financements pour un projet d'expansion régionale. Pouvez-vous nous accompagner dans la mobilisation de capitaux ?",
    daysAgo: 2,
    hour: 11,
  },
  {
    name: "Moussa Traoré",
    email: "m.traore@agriplus.ml",
    company: "AgriPlus",
    phone: "+223 76 45 67 89",
    subject: "Transformation digitale",
    message:
      "Notre entreprise agroalimentaire souhaite digitaliser sa chaîne de production. Nous avons besoin d'un accompagnement pour le changement de système d'information.",
    daysAgo: 3,
    hour: 16,
  },
  {
    name: "Aïcha Bello",
    email: "aicha@bello-holding.ne",
    company: "Bello Holding",
    phone: "+227 90 11 22 33",
    subject: "Management de transition",
    message:
      "Notre Directeur Général part en retraite dans 6 mois. Nous recherchons un manager de transition pour assurer la continuité et préparer la succession.",
    daysAgo: 4,
    hour: 10,
  },
  {
    name: "David Okonkwo",
    email: "d.okonkwo@fintrade.ng",
    company: "FinTrade Nigeria",
    phone: "+234 803 123 4567",
    subject: "Business Planning",
    message:
      "Nous préparons notre business plan pour les 5 prochaines années. Nous souhaitons un accompagnement pour la modélisation financière.",
    daysAgo: 5,
    hour: 13,
  },
  {
    name: "Mariam Koné",
    email: "m.kone@saheldev.ml",
    company: "Sahel Développement",
    phone: "+223 65 78 90 12",
    subject: "Structuration juridique",
    message:
      "Nous restructurons notre groupe et avons besoin d'aide pour la structuration juridique et financière de nos filiales.",
    daysAgo: 7,
    hour: 15,
  },
  {
    name: "Olivier Kabore",
    email: "o.kabore@translog.bf",
    company: "TransLog Burkina",
    phone: "+226 70 12 34 56",
    subject: "Audit financier",
    message:
      "Suite à une croissance rapide, nous souhaitons un audit financier complet pour sécuriser nos prochaines étapes de développement.",
    daysAgo: 8,
    hour: 8,
  },
  {
    name: "Rama Ndiaye",
    email: "rama@ndiaye-consult.sn",
    company: "Ndiaye Consulting",
    phone: "+221 78 234 56 78",
    subject: "Repositionnement stratégique",
    message:
      "Notre cabinet de conseil souhaite se repositionner sur le marché. Nous avons besoin d'aide pour redéfinir notre offre et notre identité.",
    daysAgo: 10,
    hour: 17,
  },
  {
    name: "Jean-Paul Essomba",
    email: "jp.essomba@camtrade.cm",
    company: "CamTrade",
    phone: "+237 6 99 88 77 66",
    subject: "Levée de fonds",
    message:
      "Nous préparons une levée de fonds Series A. Pouvez-vous nous accompagner dans le montage du dossier et la négociation avec les investisseurs ?",
    daysAgo: 12,
    hour: 12,
  },
  {
    name: "Grace Mensah",
    email: "grace@mensah-ltd.gh",
    company: "Mensah Ltd",
    phone: "+233 24 555 6666",
    subject: "Contrôle interne",
    message:
      "Nous souhaitons mettre en place un système de contrôle interne robuste. Avez-vous des formations à nous proposer ?",
    daysAgo: 14,
    hour: 9,
  },
  {
    name: "Ibrahim Touré",
    email: "ibrahim.toure@malibatci.ml",
    company: "Mali Bat CI",
    phone: "+223 76 11 22 33",
    subject: "Création d'entreprise",
    message:
      "Je projette de créer une entreprise de BTP et souhaite être accompagné dès la phase de création et de structuration.",
    daysAgo: 16,
    hour: 14,
  },
  {
    name: "Sandra Eba",
    email: "sandra@gaboninvest.ga",
    company: "Gabon Invest",
    phone: "+241 06 55 44 33",
    subject: "Recherche de partenaires",
    message:
      "Nous cherchons des partenaires techniques et financiers pour un projet d'infrastructure au Gabon.",
    daysAgo: 18,
    hour: 11,
  },
  {
    name: "Cheikh Fall",
    email: "c.fall@dakartrans.sn",
    company: "Dakar Transport",
    phone: "+221 77 345 67 89",
    subject: "Stratégie d'investissement",
    message:
      "Nous disposons d'un budget d'investissement et souhaitons une analyse et une structuration de nos projets d'acquisition.",
    daysAgo: 20,
    hour: 16,
  },
  {
    name: "Nadège Adjovi",
    email: "nadege@benintrade.bj",
    company: "Benin Trade",
    phone: "+229 96 11 22 33",
    subject: "Conduite du changement",
    message:
      "Nous fusionnons deux entités et avons besoin d'aide pour la conduite du changement et la cohésion d'équipe.",
    daysAgo: 22,
    hour: 10,
  },
  {
    name: "Yao Kouassi",
    email: "yao@ci-logistic.ci",
    company: "CI Logistic",
    phone: "+225 07 77 88 99",
    subject: "Pilotage de la performance",
    message:
      "Nous souhaitons mettre en place un système de pilotage de la performance avec indicateurs et tableaux de bord.",
    daysAgo: 25,
    hour: 13,
  },
  {
    name: "Awa Cissé",
    email: "awa@guinee-mines.gn",
    company: "Guinée Mines",
    phone: "+224 622 33 44 55",
    subject: "Audit opérationnel",
    message:
      "Notre activité minière nécessite un audit opérationnel pour identifier les gisements d'efficacité.",
    daysAgo: 28,
    hour: 8,
  },
  {
    name: "Pascal Nguema",
    email: "pascal@equatrade.gq",
    company: "EquaTrade",
    phone: "+240 222 333 444",
    subject: "Externalisation financière",
    message:
      "Nous souhaitons externaliser notre fonction financière. Quelles sont vos modalités d'intervention ?",
    daysAgo: 31,
    hour: 15,
  },
  {
    name: "Larbi El Mansouri",
    email: "larbi@atlanticgrp.ma",
    company: "Atlantic Group",
    phone: "+212 600 11 22 33",
    subject: "Stratégie de croissance",
    message:
      "Notre groupe diversifié souhaite élaborer une stratégie de croissance sur 5 ans à l'échelle régionale.",
    daysAgo: 35,
    hour: 12,
  },
  {
    name: "Bintou Camara",
    email: "bintou@niger-agri.ne",
    company: "Niger Agri",
    phone: "+227 90 22 33 44",
    subject: "Business Planning",
    message:
      "Nous élaborons notre plan d'affaires annuel et souhaitons un accompagnement methodologique.",
    daysAgo: 40,
    hour: 9,
  },
  {
    name: "Samuel Andjambe",
    email: "samuel@tchad-energy.td",
    company: "Tchad Energy",
    phone: "+235 66 11 22 33",
    subject: "Négociation de contrats",
    message:
      "Nous négocions un contrat stratégique avec un partenaire international et souhaitons votre appui.",
    daysAgo: 45,
    hour: 14,
  },
  {
    name: "Esi Owusu",
    email: "esi@owusu-capital.gh",
    company: "Owusu Capital",
    phone: "+233 20 333 4444",
    subject: "Mobilisation de capitaux",
    message:
      "Fonds d'investissement en recherche de conseillers pour la mobilisation de capitaux auprès d'investisseurs institutionnels.",
    daysAgo: 50,
    hour: 11,
  },
  {
    name: "Tahiry Razafy",
    email: "tahiry@madagascar-mg.mg",
    company: "Madagascar MG",
    phone: "+261 32 11 22 33",
    subject: "Transformation digitale",
    message:
      "Notre PME souhaite digitaliser sa relation client. Nous cherchons un accompagnement global.",
    daysAgo: 55,
    hour: 16,
  },
  {
    name: "Joao Almeida",
    email: "joao@angola-invest.ao",
    company: "Angola Invest",
    phone: "+244 923 44 55 66",
    subject: "Structuration de projet",
    message:
      "Projet d'acquisition d'actifs en Angola. Nous cherchons un conseil pour la structuration du montage.",
    daysAgo: 58,
    hour: 10,
  },
  {
    name: "Aminata Bâ",
    email: "aminata@maurice-trade.mu",
    company: "Maurice Trade",
    phone: "+230 5 555 6666",
    subject: "Repositionnement stratégique",
    message:
      "Notre entreprise de commerce souhaite se repositionner vers les services. Besoin d'un accompagnement stratégique.",
    daysAgo: 2,
    hour: 17,
  },
  {
    name: "Omar Sylla",
    email: "omar@syllog.sn",
    company: "SyllLog",
    phone: "+221 76 888 99 00",
    subject: "Audit organisationnel",
    message:
      "Notre structure traverse une phase de croissance qui nécessite un diagnostic organisationnel.",
    daysAgo: 1,
    hour: 8,
  },
];

async function main() {
  console.log(`Seeding ${SAMPLES.length} sample messages...`);
  await db.contactMessage.deleteMany({});

  for (const s of SAMPLES) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - s.daysAgo);
    createdAt.setHours(s.hour, Math.floor(Math.random() * 60), 0, 0);

    await db.contactMessage.create({
      data: {
        name: s.name,
        email: s.email,
        company: s.company,
        phone: s.phone,
        subject: s.subject,
        message: s.message,
        createdAt,
      },
    });
  }

  const count = await db.contactMessage.count();
  console.log(`Done. Total messages in DB: ${count}`);
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
