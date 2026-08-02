import {
  ShoppingCart,
  Shield,
  Search,
  Building,
  BarChart3,
  RefreshCw,
  MessageSquare,
  Calculator,
  CheckCircle,
  Gauge,
  Leaf,
  Monitor,
  Scale,
  Zap,
  Wallet,
  Receipt,
  FileCheck,
  Brain,
  Crown,
  Users,
  Megaphone,
  Handshake,
  FolderKanban,
  ShieldCheck,
  Heart,
  UserCog,
  Globe,
  TrendingUp,
  Package,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type FormationDomain = {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string; // tailwind color class for accent
  gradient: string; // tailwind gradient for card header
  image: string; // image URL for card header
  description: string;
  courses: FormationCourse[];
};

export type FormationCourse = {
  id: string;
  title: string;
  duration: string;
  level: "Débutant" | "Intermédiaire" | "Avancé" | "Tous niveaux";
  targetAudience: string;
};

export const FORMATION_DOMAINS: FormationDomain[] = [
  {
    id: "achats",
    name: "Achats et approvisionnement",
    icon: ShoppingCart,
    color: "bg-blue-500/10 text-blue-600",
    gradient: "from-blue-600 to-cyan-500",
    image: "/formations/achats.jpg",
    description:
      "Maîtrisez les stratégies d'achat, la gestion des fournisseurs et l'optimisation des processus d'approvisionnement pour maximiser la performance de votre chaîne d'approvisionnement.",
    courses: [
      { id: "achats-1", title: "Stratégie achats et négociation fournisseur", duration: "3 jours", level: "Avancé", targetAudience: "Acheteurs, Responsables achats" },
      { id: "achats-2", title: "Gestion des approvisionnements et des stocks", duration: "2 jours", level: "Intermédiaire", targetAudience: "Acheteurs, Logisticiens" },
      { id: "achats-3", title: "Achats publics et marchés", duration: "3 jours", level: "Avancé", targetAudience: "Acheteurs publics, Juristes" },
    ],
  },
  {
    id: "assurance",
    name: "Assurance",
    icon: Shield,
    color: "bg-emerald-500/10 text-emerald-600",
    gradient: "from-emerald-600 to-teal-500",
    image: "/formations/assurance.jpg",
    description:
      "Développez votre expertise dans le secteur de l'assurance, de la souscription à la gestion des sinistres, en passant par la réglementation et la conformité.",
    courses: [
      { id: "assurance-1", title: "Fondamentaux de l'assurance", duration: "2 jours", level: "Débutant", targetAudience: "Nouveaux entrants dans l'assurance" },
      { id: "assurance-2", title: "Gestion des sinistres et indemnisation", duration: "3 jours", level: "Intermédiaire", targetAudience: "Gestionnaires sinistres" },
      { id: "assurance-3", title: "Assurance-vie et produits financiers", duration: "2 jours", level: "Avancé", targetAudience: "Conseillers, Courtiers" },
    ],
  },
  {
    id: "audit",
    name: "Audit",
    icon: Search,
    color: "bg-violet-500/10 text-violet-600",
    gradient: "from-violet-600 to-purple-500",
    image: "/formations/audit.jpg",
    description:
      "Acquérez les méthodologies et outils d'audit pour évaluer les processus, identifier les risques et formuler des recommandations pertinentes.",
    courses: [
      { id: "audit-1", title: "Audit interne : méthodologie et pratique", duration: "3 jours", level: "Intermédiaire", targetAudience: "Auditeurs internes, Contrôleurs" },
      { id: "audit-2", title: "Audit financier et comptable", duration: "4 jours", level: "Avancé", targetAudience: "Auditeurs financiers, Experts-comptables" },
      { id: "audit-3", title: "Audit opérationnel et performance", duration: "3 jours", level: "Avancé", targetAudience: "Auditeurs, Managers" },
    ],
  },
  {
    id: "banque",
    name: "Banque",
    icon: Building,
    color: "bg-amber-500/10 text-amber-600",
    gradient: "from-amber-600 to-yellow-500",
    image: "/formations/banque.jpg",
    description:
      "Formez-vous aux métiers bancaires, à l'analyse financière, au crédit et à la conformité réglementaire dans un secteur en pleine mutation.",
    courses: [
      { id: "banque-1", title: "Analyse financière et risque de crédit", duration: "3 jours", level: "Intermédiaire", targetAudience: "Analystes crédit, Banquiers" },
      { id: "banque-2", title: "Conformité et réglementation bancaire", duration: "2 jours", level: "Avancé", targetAudience: "Responsables conformité" },
      { id: "banque-3", title: "Banque digitale et fintech", duration: "2 jours", level: "Tous niveaux", targetAudience: "Banquiers, Innovateurs" },
    ],
  },
  {
    id: "bi",
    name: "BI — Business Intelligence",
    icon: BarChart3,
    color: "bg-cyan-500/10 text-cyan-600",
    gradient: "from-cyan-600 to-sky-500",
    image: "/formations/bi.jpg",
    description:
      "Maîtrisez les outils et techniques de la Business Intelligence pour transformer vos données en décisions stratégiques éclairées.",
    courses: [
      { id: "bi-1", title: "Introduction à la Business Intelligence", duration: "2 jours", level: "Débutant", targetAudience: "Analystes, Décideurs" },
      { id: "bi-2", title: "Tableaux de bord et data visualisation", duration: "3 jours", level: "Intermédiaire", targetAudience: "Analystes BI, Managers" },
      { id: "bi-3", title: "Data warehousing et ETL", duration: "4 jours", level: "Avancé", targetAudience: "Ingénieurs data, Architectes BI" },
    ],
  },
  {
    id: "changement",
    name: "Changement",
    icon: RefreshCw,
    color: "bg-orange-500/10 text-orange-600",
    gradient: "from-orange-600 to-amber-500",
    image: "/formations/changement.jpg",
    description:
      "Apprenez à piloter et accompagner le changement au sein de votre organisation pour garantir l'adhésion et la réussite de vos transformations.",
    courses: [
      { id: "changement-1", title: "Conduite du changement : clés du succès", duration: "2 jours", level: "Tous niveaux", targetAudience: "Managers, Chefs de projet" },
      { id: "changement-2", title: "Résistance au changement : comprendre et agir", duration: "2 jours", level: "Intermédiaire", targetAudience: "DRH, Managers" },
      { id: "changement-3", title: "Transformation organisationnelle", duration: "3 jours", level: "Avancé", targetAudience: "Directeurs, Consultants" },
    ],
  },
  {
    id: "communication",
    name: "Communication",
    icon: MessageSquare,
    color: "bg-pink-500/10 text-pink-600",
    gradient: "from-pink-600 to-rose-500",
    image: "/formations/communication.jpg",
    description:
      "Développez vos compétences en communication interne et externe, en gestion de crise et en relations publiques pour renforcer l'image de votre entreprise.",
    courses: [
      { id: "comm-1", title: "Communication managériale efficace", duration: "2 jours", level: "Tous niveaux", targetAudience: "Managers, Cadres" },
      { id: "comm-2", title: "Communication de crise", duration: "2 jours", level: "Avancé", targetAudience: "Directeurs com, DRH" },
      { id: "comm-3", title: "Stratégie de communication digitale", duration: "3 jours", level: "Intermédiaire", targetAudience: "Responsables com, Community managers" },
    ],
  },
  {
    id: "comptabilite",
    name: "Comptabilité",
    icon: Calculator,
    color: "bg-slate-500/10 text-slate-600",
    gradient: "from-slate-600 to-gray-500",
    image: "/formations/comptabilite.jpg",
    description:
      "Perfectionnez-vous en comptabilité générale, analytique et en normes IFRS pour assurer la fiabilité et la transparence de vos états financiers.",
    courses: [
      { id: "compta-1", title: "Comptabilité générale : principes et pratique", duration: "3 jours", level: "Débutant", targetAudience: "Comptables, Assistants" },
      { id: "compta-2", title: "Normes IFRS et reporting financier", duration: "4 jours", level: "Avancé", targetAudience: "Experts-comptables, Contrôleurs" },
      { id: "compta-3", title: "Comptabilité analytique et coûts", duration: "3 jours", level: "Intermédiaire", targetAudience: "Contrôleurs de gestion, Comptables" },
    ],
  },
  {
    id: "conformite",
    name: "Conformité",
    icon: CheckCircle,
    color: "bg-teal-500/10 text-teal-600",
    gradient: "from-teal-600 to-emerald-500",
    image: "/formations/conformite.jpg",
    description:
      "Anticipez les exigences réglementaires et mettez en place des dispositifs de conformité robustes pour protéger votre organisation.",
    courses: [
      { id: "conf-1", title: "Conformité et réglementation : cadre général", duration: "2 jours", level: "Intermédiaire", targetAudience: "Responsables conformité, Juristes" },
      { id: "conf-2", title: "Lutte anti-blanchiment et KYC", duration: "3 jours", level: "Avancé", targetAudience: "Conformité bancaire, Auditeurs" },
      { id: "conf-3", title: "RGPD et protection des données", duration: "2 jours", level: "Tous niveaux", targetAudience: "DPO, Juristes, IT" },
    ],
  },
  {
    id: "controle-gestion",
    name: "Contrôle de gestion",
    icon: Gauge,
    color: "bg-indigo-500/10 text-indigo-600",
    gradient: "from-indigo-600 to-blue-500",
    image: "/formations/controle-gestion.jpg",
    description:
      "Maîtrisez les outils du contrôle de gestion — budgets, tableaux de bord, analyse des écarts — pour piloter la performance de votre organisation.",
    courses: [
      { id: "cdg-1", title: "Contrôle de gestion : fondamentaux", duration: "3 jours", level: "Intermédiaire", targetAudience: "Contrôleurs de gestion, Analystes" },
      { id: "cdg-2", title: "Budgets et prévisions : élaboration et suivi", duration: "2 jours", level: "Intermédiaire", targetAudience: "Contrôleurs, Managers" },
      { id: "cdg-3", title: "Pilotage de la performance et KPI", duration: "2 jours", level: "Avancé", targetAudience: "Directeurs financiers, Contrôleurs" },
    ],
  },
  {
    id: "developpement-durable",
    name: "Développement durable",
    icon: Leaf,
    color: "bg-green-500/10 text-green-600",
    gradient: "from-green-600 to-emerald-500",
    image: "/formations/developpement-durable.jpg",
    description:
      "Intégrez les principes du développement durable dans votre stratégie d'entreprise et répondez aux enjeux environnementaux et sociétaux actuels.",
    courses: [
      { id: "dd-1", title: "RSE et développement durable : enjeux stratégiques", duration: "2 jours", level: "Tous niveaux", targetAudience: "Dirigeants, DRH" },
      { id: "dd-2", title: "Bilan carbone et stratégie climat", duration: "3 jours", level: "Intermédiaire", targetAudience: "Responsables RSE, QHSE" },
      { id: "dd-3", title: "Économie circulaire et transition écologique", duration: "2 jours", level: "Tous niveaux", targetAudience: "Managers, Innovateurs" },
    ],
  },
  {
    id: "digital",
    name: "Digital",
    icon: Monitor,
    color: "bg-sky-500/10 text-sky-600",
    gradient: "from-sky-600 to-blue-500",
    image: "/formations/digital.jpg",
    description:
      "Accompagnez la transformation digitale de votre entreprise en maîtrisant les outils, méthodes et stratégies du numérique.",
    courses: [
      { id: "digital-1", title: "Transformation digitale : stratégie et mise en œuvre", duration: "3 jours", level: "Tous niveaux", targetAudience: "Dirigeants, Managers" },
      { id: "digital-2", title: "Marketing digital et réseaux sociaux", duration: "2 jours", level: "Intermédiaire", targetAudience: "Marketeurs, Communicants" },
      { id: "digital-3", title: "Cybersécurité et gouvernance des données", duration: "2 jours", level: "Avancé", targetAudience: "DSI, RSSI, DPO" },
    ],
  },
  {
    id: "droit",
    name: "Droit",
    icon: Scale,
    color: "bg-rose-500/10 text-rose-600",
    gradient: "from-rose-600 to-red-500",
    image: "/formations/droit.jpg",
    description:
      "Renforcez vos connaissances juridiques en droit des affaires, droit du travail et réglementation pour sécuriser vos opérations.",
    courses: [
      { id: "droit-1", title: "Droit des affaires et sociétés", duration: "3 jours", level: "Intermédiaire", targetAudience: "Juristes, Dirigeants" },
      { id: "droit-2", title: "Droit du travail et relations sociales", duration: "2 jours", level: "Tous niveaux", targetAudience: "DRH, Managers" },
      { id: "droit-3", title: "Droit OHADA et réglementation africaine", duration: "3 jours", level: "Avancé", targetAudience: "Juristes, Avocats" },
    ],
  },
  {
    id: "efficacite",
    name: "Efficacité professionnelle",
    icon: Zap,
    color: "bg-yellow-500/10 text-yellow-600",
    gradient: "from-yellow-600 to-amber-500",
    image: "/formations/efficacite.jpg",
    description:
      "Boostez votre productivité et celle de vos équipes grâce à des méthodes éprouvées de gestion du temps, d'organisation et de priorisation.",
    courses: [
      { id: "eff-1", title: "Gestion du temps et priorités", duration: "1 jour", level: "Tous niveaux", targetAudience: "Cadres, Collaborateurs" },
      { id: "eff-2", title: "Méthodes d'organisation et productivité", duration: "2 jours", level: "Tous niveaux", targetAudience: "Managers, Assistants" },
      { id: "eff-3", title: "Prise de parole en public", duration: "2 jours", level: "Intermédiaire", targetAudience: "Cadres, Dirigeants" },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    icon: Wallet,
    color: "bg-emerald-500/10 text-emerald-700",
    gradient: "from-emerald-600 to-green-500",
    image: "/formations/finance.jpg",
    description:
      "Développez votre expertise financière, de l'analyse financière à la gestion de trésorerie, en passant par les marchés et les investissements.",
    courses: [
      { id: "fin-1", title: "Analyse financière : lire et comprendre les comptes", duration: "3 jours", level: "Intermédiaire", targetAudience: "Analystes, Managers" },
      { id: "fin-2", title: "Gestion de trésorerie et financement", duration: "2 jours", level: "Avancé", targetAudience: "Trésoriers, DAF" },
      { id: "fin-3", title: "Marchés financiers et investissement", duration: "3 jours", level: "Avancé", targetAudience: "Analystes, Gestionnaires" },
    ],
  },
  {
    id: "fiscalite",
    name: "Fiscalité",
    icon: Receipt,
    color: "bg-red-500/10 text-red-600",
    gradient: "from-red-600 to-rose-500",
    image: "/formations/fiscalite.jpg",
    description:
      "Maîtrisez l'environnement fiscal, optimisez la gestion fiscale de votre entreprise et assurez la conformité avec les réglementations en vigueur.",
    courses: [
      { id: "fisc-1", title: "Fiscalité de l'entreprise : principes et optimisation", duration: "3 jours", level: "Intermédiaire", targetAudience: "Fiscalistes, Comptables" },
      { id: "fisc-2", title: "Fiscalité internationale et transferts", duration: "2 jours", level: "Avancé", targetAudience: "Fiscalistes, Avocats" },
      { id: "fisc-3", title: "Gestion des contrôles fiscaux", duration: "2 jours", level: "Avancé", targetAudience: "DAF, Fiscalistes" },
    ],
  },
  {
    id: "gar",
    name: "GAR",
    icon: FileCheck,
    color: "bg-teal-500/10 text-teal-700",
    gradient: "from-teal-600 to-cyan-500",
    image: "/formations/gar.jpg",
    description:
      "Formez-vous à la Gestion Axée sur les Résultats (GAR) pour planifier, suivre et évaluer les performances de vos projets et programmes.",
    courses: [
      { id: "gar-1", title: "GAR : cadre logique et indicateurs", duration: "3 jours", level: "Intermédiaire", targetAudience: "Chefs de projet, Évaluateurs" },
      { id: "gar-2", title: "Suivi-évaluation et redevabilité", duration: "2 jours", level: "Avancé", targetAudience: "Évaluateurs, Bailleurs" },
      { id: "gar-3", title: "GAR dans les projets de développement", duration: "3 jours", level: "Tous niveaux", targetAudience: "ONG, Institutions" },
    ],
  },
  {
    id: "ia",
    name: "IA — Intelligence Artificielle",
    icon: Brain,
    color: "bg-purple-500/10 text-purple-600",
    gradient: "from-purple-600 to-violet-500",
    image: "/formations/ia.jpg",
    description:
      "Comprenez et exploitez le potentiel de l'intelligence artificielle pour transformer vos processus et créer de la valeur au sein de votre organisation.",
    courses: [
      { id: "ia-1", title: "Comprendre l'IA : enjeux et applications", duration: "2 jours", level: "Débutant", targetAudience: "Dirigeants, Managers" },
      { id: "ia-2", title: "IA et data science pour les managers", duration: "3 jours", level: "Intermédiaire", targetAudience: "Managers, Analystes" },
      { id: "ia-3", title: "IA générative et automatisation", duration: "2 jours", level: "Intermédiaire", targetAudience: "Innovateurs, IT" },
    ],
  },
  {
    id: "leadership",
    name: "Leadership",
    icon: Crown,
    color: "bg-amber-500/10 text-amber-700",
    gradient: "from-amber-600 to-orange-500",
    image: "/formations/leadership.jpg",
    description:
      "Développez votre leadership et votre capacité à inspirer, motiver et guider vos équipes vers l'excellence et la performance durable.",
    courses: [
      { id: "lead-1", title: "Leadership et management stratégique", duration: "3 jours", level: "Avancé", targetAudience: "Dirigeants, Directeurs" },
      { id: "lead-2", title: "Leadership situationnel et coaching", duration: "2 jours", level: "Intermédiaire", targetAudience: "Managers, Coaches" },
      { id: "lead-3", title: "Leadership féminin et diversité", duration: "2 jours", level: "Tous niveaux", targetAudience: "Cadres, Dirigeantes" },
    ],
  },
  {
    id: "management",
    name: "Management",
    icon: Users,
    color: "bg-blue-500/10 text-blue-700",
    gradient: "from-blue-600 to-indigo-500",
    image: "/formations/management.jpg",
    description:
      "Renforcez vos compétences managériales pour piloter vos équipes avec efficacité, de la planification stratégique à l'opérationnel.",
    courses: [
      { id: "mgmt-1", title: "Management efficace : les fondamentaux", duration: "3 jours", level: "Débutant", targetAudience: "Nouveaux managers" },
      { id: "mgmt-2", title: "Management de transition", duration: "2 jours", level: "Avancé", targetAudience: "Managers de transition" },
      { id: "mgmt-3", title: "Management interculturel en Afrique", duration: "2 jours", level: "Intermédiaire", targetAudience: "Expatriés, Managers" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: Megaphone,
    color: "bg-rose-500/10 text-rose-700",
    gradient: "from-rose-600 to-pink-500",
    image: "/formations/marketing.jpg",
    description:
      "Maîtrisez les stratégies marketing, du positionnement à l'exécution, en passant par l'étude de marché et le marketing digital.",
    courses: [
      { id: "mkt-1", title: "Stratégie marketing et positionnement", duration: "3 jours", level: "Intermédiaire", targetAudience: "Responsables marketing" },
      { id: "mkt-2", title: "Études de marché et insights consommateurs", duration: "2 jours", level: "Tous niveaux", targetAudience: "Marketeurs, Analystes" },
      { id: "mkt-3", title: "Marketing B2B et account-based marketing", duration: "2 jours", level: "Avancé", targetAudience: "Marketeurs B2B" },
    ],
  },
  {
    id: "negociation",
    name: "Négociation",
    icon: Handshake,
    color: "bg-indigo-500/10 text-indigo-700",
    gradient: "from-indigo-600 to-violet-500",
    image: "/formations/negociation.jpg",
    description:
      "Développez vos compétences en négociation pour conclure des accords gagnant-gagnant et défendre les intérêts de votre organisation.",
    courses: [
      { id: "neg-1", title: "Techniques de négociation avancées", duration: "2 jours", level: "Intermédiaire", targetAudience: "Commerciaux, Acheteurs" },
      { id: "neg-2", title: "Négociation internationale et interculturelle", duration: "3 jours", level: "Avancé", targetAudience: "Dirigeants, Négociateurs" },
      { id: "neg-3", title: "Négociation de contrats complexes", duration: "2 jours", level: "Avancé", targetAudience: "Juristes, Avocats" },
    ],
  },
  {
    id: "projet",
    name: "Projet",
    icon: FolderKanban,
    color: "bg-cyan-500/10 text-cyan-700",
    gradient: "from-cyan-600 to-teal-500",
    image: "/formations/projet.jpg",
    description:
      "Maîtrisez les méthodologies de gestion de projet, de la planification à la clôture, en passant par le pilotage et la gestion des risques.",
    courses: [
      { id: "proj-1", title: "Gestion de projet : méthodologie et outils", duration: "3 jours", level: "Débutant", targetAudience: "Chefs de projet juniors" },
      { id: "proj-2", title: "Pilotage de projet et gestion des risques", duration: "2 jours", level: "Intermédiaire", targetAudience: "Chefs de projet, PMO" },
      { id: "proj-3", title: "Agilité et méthodes itératives (Scrum, Kanban)", duration: "2 jours", level: "Tous niveaux", targetAudience: "Scrum Masters, Product Owners" },
    ],
  },
  {
    id: "qhse",
    name: "QHSE",
    icon: ShieldCheck,
    color: "bg-green-500/10 text-green-700",
    gradient: "from-green-600 to-lime-500",
    image: "/formations/qhse.jpg",
    description:
      "Mettez en place et pilotez des systèmes de management qualité, hygiène, sécurité et environnement conformes aux normes internationales.",
    courses: [
      { id: "qhse-1", title: "ISO 9001 : système de management qualité", duration: "3 jours", level: "Intermédiaire", targetAudience: "Responsables qualité" },
      { id: "qhse-2", title: "Sécurité au travail et normes ISO 45001", duration: "2 jours", level: "Tous niveaux", targetAudience: "Responsables HSE" },
      { id: "qhse-3", title: "Management environnemental ISO 14001", duration: "2 jours", level: "Intermédiaire", targetAudience: "Responsables environnement" },
    ],
  },
  {
    id: "relation-client",
    name: "Relation client",
    icon: Heart,
    color: "bg-pink-500/10 text-pink-700",
    gradient: "from-pink-600 to-fuchsia-500",
    image: "/formations/relation-client.jpg",
    description:
      "Optimisez la relation client de votre entreprise, de l'accueil à la fidélisation, en passant par la gestion des réclamations et le CRM.",
    courses: [
      { id: "rc-1", title: "Excellence en relation client", duration: "2 jours", level: "Tous niveaux", targetAudience: "Service client, Commerciaux" },
      { id: "rc-2", title: "CRM et fidélisation client", duration: "2 jours", level: "Intermédiaire", targetAudience: "Responsables CRM, Marketeurs" },
      { id: "rc-3", title: "Gestion des réclamations et médiation", duration: "1 jour", level: "Tous niveaux", targetAudience: "Service client, Managers" },
    ],
  },
  {
    id: "rh",
    name: "RH",
    icon: UserCog,
    color: "bg-violet-500/10 text-violet-700",
    gradient: "from-violet-600 to-purple-500",
    image: "/formations/rh.jpg",
    description:
      "Développez vos compétences en ressources humaines, du recrutement à la gestion des carrières, en passant par le droit du travail et la paie.",
    courses: [
      { id: "rh-1", title: "Gestion des RH : de la stratégie à l'opérationnel", duration: "3 jours", level: "Intermédiaire", targetAudience: "DRH, RRH" },
      { id: "rh-2", title: "Recrutement et intégration des talents", duration: "2 jours", level: "Tous niveaux", targetAudience: "Recruteurs, DRH" },
      { id: "rh-3", title: "Paie et administration du personnel", duration: "3 jours", level: "Intermédiaire", targetAudience: "Gestionnaires paie" },
    ],
  },
  {
    id: "rse",
    name: "RSE",
    icon: Globe,
    color: "bg-lime-500/10 text-lime-700",
    gradient: "from-lime-600 to-green-500",
    image: "/formations/rse.jpg",
    description:
      "Intégrez la Responsabilité Sociétale des Entreprises dans votre stratégie pour créer de la valeur durable et répondre aux attentes des parties prenantes.",
    courses: [
      { id: "rse-1", title: "Stratégie RSE et parties prenantes", duration: "2 jours", level: "Tous niveaux", targetAudience: "Dirigeants, Responsables RSE" },
      { id: "rse-2", title: "Reporting extra-financier et normes ESG", duration: "2 jours", level: "Avancé", targetAudience: "DAF, Responsables RSE" },
      { id: "rse-3", title: "Impact investing et finance durable", duration: "2 jours", level: "Avancé", targetAudience: "Investisseurs, Banquiers" },
    ],
  },
  {
    id: "vente",
    name: "Vente",
    icon: TrendingUp,
    color: "bg-orange-500/10 text-orange-700",
    gradient: "from-orange-600 to-red-500",
    image: "/formations/vente.jpg",
    description:
      "Boostez vos performances commerciales grâce à des techniques de vente éprouvées, du prospection à la conclusion de la vente.",
    courses: [
      { id: "vente-1", title: "Techniques de vente et closing", duration: "2 jours", level: "Intermédiaire", targetAudience: "Commerciaux, Représentants" },
      { id: "vente-2", title: "Prospection et développement commercial", duration: "2 jours", level: "Tous niveaux", targetAudience: "Commerciaux, Business developers" },
      { id: "vente-3", title: "Vente consultative et B2B", duration: "3 jours", level: "Avancé", targetAudience: "Commerciaux B2B, Ingénieurs d'affaires" },
    ],
  },
  {
    id: "soft-skills",
    name: "Soft skills",
    icon: Sparkles,
    color: "bg-fuchsia-500/10 text-fuchsia-600",
    gradient: "from-fuchsia-600 to-pink-500",
    image: "/formations/soft-skills.jpg",
    description:
      "Développez vos compétences comportementales — intelligence émotionnelle, communication, créativité — pour exceller dans votre environnement professionnel.",
    courses: [
      { id: "soft-1", title: "Intelligence émotionnelle au travail", duration: "2 jours", level: "Tous niveaux", targetAudience: "Cadres, Managers" },
      { id: "soft-2", title: "Travail en équipe et collaboration", duration: "1 jour", level: "Tous niveaux", targetAudience: "Collaborateurs, Managers" },
      { id: "soft-3", title: "Créativité et pensée latérale", duration: "2 jours", level: "Tous niveaux", targetAudience: "Innovateurs, Cadres" },
    ],
  },
  {
    id: "supply-chain",
    name: "Supply chain",
    icon: Package,
    color: "bg-sky-500/10 text-sky-700",
    gradient: "from-sky-600 to-cyan-500",
    image: "/formations/supply-chain.jpg",
    description:
      "Maîtrisez la gestion de la chaîne logistique, de la planification à la livraison, en optimisant flux, coûts et délais.",
    courses: [
      { id: "sc-1", title: "Supply chain management : fondamentaux", duration: "3 jours", level: "Intermédiaire", targetAudience: "Logisticiens, Supply chain managers" },
      { id: "sc-2", title: "Logistique et distribution en Afrique", duration: "2 jours", level: "Tous niveaux", targetAudience: "Logisticiens, Opérationnels" },
      { id: "sc-3", title: "Prévision de la demande et S&OP", duration: "2 jours", level: "Avancé", targetAudience: "Planificateurs, Supply chain managers" },
    ],
  },
];

/** The 6 featured domains shown on the home page */
export const FEATURED_FORMATIONS = FORMATION_DOMAINS.slice(0, 6);
