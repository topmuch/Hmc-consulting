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
  BookOpen,
  Heart,
  LayoutGrid,
  Compass,
  Award,
  MessageSquare,
  ArrowRight,
  Package,
  Newspaper,
  GraduationCap,
  FileText,
  type LucideIcon,
} from "lucide-react";

export const COMPANY = {
  name: "HMC",
  fullName: "Horizon Management Consulting",
  tagline: "Votre partenaire en conseil et management des entreprises",
  email: "contact@hmc-consulting.pro",
  phone: "+221 77 455 11 36",
  partner: "Cheikh Lam",
  partnerRole: "Partner",
  yearsExperience: 30,
  countriesCount: 20,
};

export type PageMeta = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  shortDescription: string;
  longDescription: string;
};

export const PAGES: PageMeta[] = [
  {
    id: "histoire",
    label: "À propos",
    href: "/histoire",
    icon: BookOpen,
    shortDescription: "Près de 30 ans d'expertise au service de l'excellence managériale.",
    longDescription:
      "Découvrez notre parcours, notre mission et les valeurs qui guident notre cabinet depuis ses débuts.",
  },
  {
    id: "valeurs",
    label: "Valeurs",
    href: "/valeurs",
    icon: Heart,
    shortDescription: "Intégrité, innovation, engagement et responsabilité.",
    longDescription:
      "Les quatre piliers fondamentaux qui guident chacune de nos interventions et structurent la confiance de nos clients.",
  },
  {
    id: "services",
    label: "Services",
    href: "/services",
    icon: LayoutGrid,
    shortDescription: "Conseil stratégique, management opérationnel et transformation.",
    longDescription:
      "Une offre intégrée, globale et innovante pour répondre aux exigences des marchés et sécuriser votre activité.",
  },
  {
    id: "experience",
    label: "Expérience",
    href: "/experience",
    icon: Compass,
    shortDescription: "Près de 20 pays couverts en Afrique et Océan Indien.",
    longDescription:
      "Une présence significative dans près de 20 pays, du Maroc à l'Afrique du Sud, en passant par l'Océan Indien.",
  },
  {
    id: "produits",
    label: "Produits",
    href: "/produits",
    icon: Package,
    shortDescription: "QRbags, QRtags, QRtrans, VerifScan, MyRest — nos solutions QR code.",
    longDescription:
      "Découvrez notre gamme de solutions digitales basées sur la technologie QR code, conçues pour la traçabilité, la logistique et l'expérience client.",
  },
  {
    id: "expertise",
    label: "Expertise",
    href: "/expertise",
    icon: Award,
    shortDescription: "Conseil & audit, management et finance & structuration.",
    longDescription:
      "Trois domaines d'expertise couvrant l'ensemble de la chaîne de valeur de l'entreprise, du diagnostic à la mise en œuvre.",
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    icon: MessageSquare,
    shortDescription: "Parlons de votre projet et de vos enjeux stratégiques.",
    longDescription:
      "Une question, un projet de développement ou de structuration ? Notre équipe vous répond avec confidentialité.",
  },
  {
    id: "blog",
    label: "Blog",
    href: "/blog",
    icon: Newspaper,
    shortDescription: "Analyses, conseils et retours d'expérience pour votre entreprise.",
    longDescription:
      "Analyses, conseils et retours d'expérience pour accompagner le développement de votre entreprise et anticiper les évolutions des marchés.",
  },
  {
    id: "equipe",
    label: "Équipe",
    href: "/equipe",
    icon: Users,
    shortDescription: "Notre équipe de consultants experts.",
    longDescription:
      "Découvrez les consultants et experts qui font la force d'HMC.",
  },
  {
    id: "devis",
    label: "Devis",
    href: "/devis",
    icon: FileText,
    shortDescription: "Demandez un devis personnalisé pour nos services, produits et formations.",
    longDescription:
      "Découvrez l'ensemble de nos services, produits et formations, et demandez un devis personnalisé adapté à vos besoins.",
  },
  {
    id: "formations",
    label: "Formations",
    href: "/formations",
    icon: GraduationCap,
    shortDescription: "30+ domaines de formation pour développer vos compétences.",
    longDescription:
      "Développez les compétences de vos équipes grâce à nos formations sur mesure, dispensées par des experts et adaptées aux réalités du marché africain.",
  },
];

export type NavLink = {
  href?: string;
  label: string;
  id?: string;
  children?: { href: string; label: string; id: string }[];
};

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Accueil", id: "accueil" },
  {
    label: "À propos",
    id: "histoire",
    href: "/?page=histoire",
    children: [
      { href: "/?page=valeurs", label: "Valeurs", id: "valeurs" },
      { href: "/?page=experience", label: "Expérience", id: "experience" },
      { href: "/?page=expertise", label: "Expertise", id: "expertise" },
    ],
  },
  { href: "/?page=produits", label: "Produits", id: "produits" },
  { href: "/?page=services", label: "Services", id: "services" },
  { href: "/?page=formations", label: "Formations", id: "formations" },
  { href: "/?page=blog", label: "Blog", id: "blog" },
  { href: "/?page=devis", label: "Devis", id: "devis" },
  { href: "/?page=contact", label: "Contact", id: "contact" },
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
