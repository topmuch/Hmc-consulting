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
  type LucideIcon,
} from "lucide-react";

export const COMPANY = {
  name: "HMC",
  fullName: "Hospitality Management Consulting",
  tagline: "Partenaire de votre développement stratégique",
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
      "Une conduite éthique et transparente guide chacune de nos interventions, garantissant la confiance de nos partenaires et la pérennité de nos engagements.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Nous mobilisons des solutions digitales et des approches renouvelées pour transformer les défis du secteur hôtelier en opportunités tangibles.",
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
      "Nous assumerons pleinement la sécurité de vos décisions et de vos choix stratégiques, dans le respect des hommes, des actifs et des territoires.",
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
    title: "Intégrée",
    subtitle: "Au secteur hôtelier",
    description:
      "Une connaissance profonde du secteur hôtelier, du segment du Luxe à l'économique, nous permet d'adapter nos interventions à chaque typologie d'actif et à chaque phase de maturité.",
  },
  {
    icon: Briefcase,
    title: "Globale",
    subtitle: "Stratégie, Gestion & Accompagnement",
    description:
      "Une offre complète couvrant la stratégie, la gestion hôtelière et l'Asset Management, pour sécuriser l'activité et garantir la rentabilité de nos clients.",
  },
  {
    icon: Sparkles,
    title: "Innovante",
    subtitle: "Solutions digitales",
    description:
      "L'application de solutions digitales à notre expertise nous permet de proposer des accompagnements modernes, mesurables et adaptés aux évolutions du métier de l'hôtellerie.",
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
    title: "Consulting",
    items: [
      "Audit opérationnel et financier",
      "Formation en Contrôle Interne",
      "Externalisation de Services Financiers",
      "Yield et Revenue Management",
      "Support système d'information",
    ],
  },
  {
    icon: Building2,
    title: "Gestion Hôtelière",
    items: [
      "Gestion hôtelière",
      "Externalisation de Services Financiers",
      "Stratégie d'investissement",
      "Gestion et sécurisation d'actifs",
    ],
  },
  {
    icon: Wallet,
    title: "Asset Management",
    items: [
      "Structuration de projets d'acquisition, de cession ou de rénovation",
      "Stratégie de mobilisation de ressources financières",
      "Business Planning, modélisation",
      "Négociation de contrats de gestion",
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
    title: "Construction & Rénovation",
    description: "Accompagnement sur les phases de construction et de rénovation d'actifs.",
  },
  {
    title: "Structuration",
    description: "Structuration juridique, financière et opérationnelle des projets.",
  },
  {
    title: "Mobilisation de capitaux",
    description: "Assistance à la mobilisation de capitaux permanents.",
  },
  {
    title: "Changement de SI",
    description: "Accompagnement au changement de système d'information.",
  },
  {
    title: "Rebranding",
    description: "Stratégie et mise en œuvre de repositionnement de marque.",
  },
  {
    title: "Négociation de contrats",
    description: "Négociation de contrats de gestion et appels d'offres.",
  },
  {
    title: "Recherche de partenaires",
    description: "Recherche de partenaires techniques ou financiers.",
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

export const CLIENTS = [
  { name: "Sofitel", logo: "/client-sofitel.png" },
  { name: "Hôtel Sindone", logo: "/client-sindone.png" },
];

export const CONTACT_ICONS = {
  MapPin,
  Phone,
  Mail,
};
