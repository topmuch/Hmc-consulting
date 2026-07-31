import {
  ShieldCheck,
  Lightbulb,
  Handshake,
  Scale,
  Layers,
  Globe2,
  Sparkles,
  LineChart,
  Building2,
  Wallet,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Users,
  Settings2,
  type LucideIcon,
} from "lucide-react";

export const COMPANY = {
  name: "HMC",
  fullName: "Horizon Management Consulting",
  tagline: "Votre partenaire en conseil et management des entreprises",
  email: "contact@hmc-consulting.com",
  phone: "+221 77 455 11 36",
  partner: "Cheikh Lam",
  partnerRole: "Partner",
  yearsExperience: 30,
  countriesCount: 20,
};

export const NAV_LINKS = [
  { href: "#histoire", label: "Notre Histoire" },
  { href: "#valeurs", label: "Nos Valeurs" },
  { href: "#services", label: "Nos Services" },
  { href: "#experience", label: "Notre Expérience" },
  { href: "#expertise", label: "Notre Expertise" },
  { href: "#contact", label: "Contact" },
];

export type Value = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const VALUES: Value[] = [
  {
    icon: ShieldCheck,
    title: "Intégrité",
    description:
      "Une conduite éthique et transparente guide chacune de nos interventions, garantissant la confiance de nos clients et la pérennité de nos engagements.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Nous mobilisons des solutions nouvelles et des approches renouvelées pour transformer les défis des entreprises en opportunités tangibles et durables.",
  },
  {
    icon: Handshake,
    title: "Engagement",
    description:
      "Au côté de nos clients à chaque étape de leur développement, nous portons leurs projets comme les nôtres, du premier diagnostic à la mise en œuvre.",
  },
  {
    icon: Scale,
    title: "Responsabilité",
    description:
      "Nous assumerons pleinement la sécurité de vos décisions et de vos choix stratégiques, dans le respect des hommes, des organisations et des territoires.",
  },
];

export type Service = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
};

export const SERVICES: Service[] = [
  {
    icon: Layers,
    title: "Conseil Stratégique",
    subtitle: "Vision & décision",
    description:
      "Une connaissance profonde des secteurs d'activité nous permet d'adapter nos interventions à chaque typologie d'entreprise et à chaque phase de maturité, de la PMe au grand groupe.",
  },
  {
    icon: Settings2,
    title: "Management Opérationnel",
    subtitle: "Pilotage & performance",
    description:
      "Une offre complète couvrant le management de transition, l'organisation et le pilotage de la performance, pour sécuriser l'activité et garantir la rentabilité de nos clients.",
  },
  {
    icon: Sparkles,
    title: "Transformation",
    subtitle: "Solutions innovantes",
    description:
      "L'application de solutions digitales et de méthodes éprouvées à notre expertise nous permet de proposer des accompagnements modernes, mesurables et adaptés aux évolutions des marchés.",
  },
];

export type Expertise = {
  icon: LucideIcon;
  title: string;
  items: string[];
};

export const EXPERTISE: Expertise[] = [
  {
    icon: LineChart,
    title: "Conseil & Audit",
    items: [
      "Audit opérationnel et financier",
      "Diagnostic organisationnel",
      "Contrôle interne et conformité",
      "Stratégie de croissance",
      "Études de marché et faisabilité",
    ],
  },
  {
    icon: Users,
    title: "Management & Organisation",
    items: [
      "Management de transition",
      "Externalisation de fonctions",
      "Pilotage de la performance",
      "Conduite du changement",
      "Structuration des équipes",
    ],
  },
  {
    icon: Wallet,
    title: "Finance & Structuration",
    items: [
      "Structuration de projets d'investissement",
      "Mobilisation de ressources financières",
      "Business Planning et modélisation",
      "Accompagnement à la levée de fonds",
      "Négociation et montages contractuels",
    ],
  },
];

export type SupportItem = {
  title: string;
  description: string;
};

export const SUPPORT_ITEMS: SupportItem[] = [
  {
    title: "Business Planning",
    description: "Construction de modèles économiques et plans d'affaires robustes.",
  },
  {
    title: "Création & Développement",
    description: "Accompagnement à la création d'entreprise et au développement d'activités.",
  },
  {
    title: "Structuration",
    description: "Structuration juridique, financière et opérationnelle des organisations.",
  },
  {
    title: "Mobilisation de financements",
    description: "Assistance à la mobilisation de capitaux et au financement de projets.",
  },
  {
    title: "Transformation digitale",
    description: "Accompagnement à la digitalisation et au changement de système d'information.",
  },
  {
    title: "Repositionnement stratégique",
    description: "Stratégie et mise en œuvre de repositionnement d'activité ou de marque.",
  },
  {
    title: "Négociation de contrats",
    description: "Négociation de contrats stratégiques et appels d'offres.",
  },
  {
    title: "Recherche de partenaires",
    description: "Recherche de partenaires techniques, commerciaux ou financiers.",
  },
];

export const COUNTRIES: string[] = [
  "Maroc",
  "Sénégal",
  "Côte d'Ivoire",
  "Ghana",
  "Bénin",
  "Togo",
  "Niger",
  "Nigéria",
  "Cameroun",
  "Guinée Conakry",
  "Guinée Équatoriale",
  "Gabon",
  "Afrique du Sud",
  "Île Maurice",
  "Ouganda",
  "Tchad",
  "Tunisie",
  "Angola",
];

export const SECTORS = [
  {
    name: "Entreprises & PME",
    description: "Développement et structuration d'entreprises de toutes tailles.",
  },
  {
    name: "Groupes & Holdings",
    description: "Accompagnement stratégique de groupes en croissance.",
  },
  {
    name: "Investisseurs",
    description: "Analyse, structuration et sécurisation d'investissements.",
  },
  {
    name: "Institutions",
    description: "Conseil auprès d'institutions et d'organisations publiques.",
  },
];

export const CONTACT_ICONS = {
  MapPin,
  Phone,
  Mail,
};
