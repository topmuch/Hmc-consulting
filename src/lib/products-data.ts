import {
  Briefcase,
  Tag,
  Building2,
  Package,
  ShieldCheck,
  UtensilsCrossed,
  QrCode,
  Bell,
  MapPin,
  MessageSquare,
  Globe,
  BarChart3,
  Users,
  Zap,
  Lock,
  History,
  Smartphone,
  RefreshCw,
  FileText,
  Languages,
  CreditCard,
  PackageCheck,
  Truck,
  ScanLine,
  Leaf,
  AlertCircle,
  Share2,
  type LucideIcon,
} from "lucide-react";

export type ProductFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type ProductStep = {
  step: number;
  title: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  icon: LucideIcon;
  category: string;
  targetAudience: string;
  image: string;
  gradient: string;
  accentHex: string;
  features: ProductFeature[];
  howItWorks: ProductStep[];
  benefits: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: "qrbags",
    name: "QRbags",
    tagline: "Ne perdez plus jamais vos bagages",
    description:
      "Solution de traçabilité de bagages pour les voyageurs. Chaque bagage est équipé d'un QR code unique.",
    longDescription:
      "QRbags est une solution innovante de traçabilité de bagages conçue pour les voyageurs. En fixant une étiquette QR code unique sur votre bagage, vous créez un lien direct et sécurisé entre vous et celui qui trouverait votre bagage en cas de perte. Le trouveur scanne le QR code et vous êtes immédiatement notifié avec la géolocalisation, sans que vos coordonnées personnelles ne soient divulguées.",
    icon: Briefcase,
    category: "Voyage & Mobilité",
    targetAudience: "Voyageurs particuliers, familles, professionnels en déplacement",
    image: "/product-qrbags.jpg",
    gradient: "from-blue-600 to-cyan-500",
    accentHex: "#2563eb",
    features: [
      {
        title: "Étiquette QR résistante",
        description: "Étiquette waterproof et durable à fixer sur tout type de bagage.",
        icon: QrCode,
      },
      {
        title: "Notification instantanée",
        description: "Alerte immédiate dès qu'un tiers scanne le QR code de votre bagage.",
        icon: Bell,
      },
      {
        title: "Géolocalisation du scan",
        description: "Localisation précise du lieu où votre bagage a été scanné.",
        icon: MapPin,
      },
      {
        title: "Messagerie anonyme",
        description: "Communication sécurisée et anonyme avec le trouveur, sans partager vos coordonnées.",
        icon: MessageSquare,
      },
      {
        title: "Support multilingue",
        description: "Interface traduite automatiquement pour les voyageurs internationaux.",
        icon: Globe,
      },
      {
        title: "Assistance au retour",
        description: "Accompagnement logistique pour organiser la restitution du bagage.",
        icon: PackageCheck,
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: "Fixez l'étiquette",
        description: "Collez l'étiquette QRbags sur votre bagage et activez-la via l'application.",
      },
      {
        step: 2,
        title: "Voyagez sereinement",
        description: "Votre bagage est désormais protégé et traçable en cas de perte.",
      },
      {
        step: 3,
        title: "Le trouveur scanne",
        description: "En cas de perte, la personne qui trouve votre bagage scanne le QR code.",
      },
      {
        step: 4,
        title: "Vous êtes notifié",
        description: "Recevez instantanément la localisation et communiquez avec le trouveur.",
      },
    ],
    benefits: [
      "Récupérez vos bagages 10x plus vite",
      "Vos données personnelles restent confidentielles",
      "Fonctionne dans le monde entier",
      "Aucune application requise pour le trouveur",
    ],
  },
  {
    id: "qrtags",
    name: "QRtags",
    tagline: "Retrouvez vos objets du quotidien",
    description:
      "Solution de traçabilité des objets trouvés. Collez un QR tag sur vos objets personnels.",
    longDescription:
      "QRtags est une solution de traçabilité pour vos objets du quotidien. Clés, portefeuille, téléphone, sac, vélo — collez un QR tag sur tous vos objets de valeur. Si l'un d'eux est perdu, la personne qui le trouve peut scanner le QR code pour vous notifier immédiatement, sans accéder à vos informations personnelles. Simple, discret et efficace.",
    icon: Tag,
    category: "Objets personnels",
    targetAudience: "Particuliers, étudiants, citadins",
    image: "/product-qrtags.jpg",
    gradient: "from-emerald-600 to-teal-500",
    accentHex: "#059669",
    features: [
      {
        title: "Tags adhésifs universels",
        description: "Tags QR discrets et résistants à coller sur tous vos objets.",
        icon: QrCode,
      },
      {
        title: "Notification instantanée",
        description: "Alerte immédiate dès qu'un de vos objets est scanné par un tiers.",
        icon: Bell,
      },
      {
        title: "Géolocalisation",
        description: "Localisation du scan pour savoir où votre objet a été trouvé.",
        icon: MapPin,
      },
      {
        title: "Messagerie sécurisée",
        description: "Chat anonyme pour organiser la restitution en toute confidentialité.",
        icon: MessageSquare,
      },
      {
        title: "Multi-objets",
        description: "Gérez tous vos objets depuis une seule application.",
        icon: Smartphone,
      },
      {
        title: "Confidentialité configurable",
        description: "Choisissez quelles informations partager et avec qui.",
        icon: Lock,
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: "Collez vos tags",
        description: "Fixez un QR tag sur chaque objet que vous souhaitez protéger.",
      },
      {
        step: 2,
        title: "Activez vos objets",
        description: "Enregistrez chaque tag dans l'application avec une description de l'objet.",
      },
      {
        step: 3,
        title: "Le trouveur scanne",
        description: "Si l'objet est perdu, le trouveur scanne le QR code avec son téléphone.",
      },
      {
        step: 4,
        title: "Vous récupérez votre objet",
        description: "Recevez la notification, la position, et organisez la restitution.",
      },
    ],
    benefits: [
      "Discrétion totale sur vos objets",
      "Protection de votre identité",
      "Aucune app à installer pour le trouveur",
      "Pack de tags multiples abordable",
    ],
  },
  {
    id: "qrtags-entreprise",
    name: "QRtags pour Entreprise",
    tagline: "La gestion des objets trouvés pour les professionnels",
    description:
      "Solution dédiée aux professionnels pour la gestion centralisée des objets trouvés.",
    longDescription:
      "QRtags pour Entreprise est une solution complète dédiée aux structures qui gèrent des objets trouvés : hôtels, aéroports, gares, centres commerciaux, entreprises. Centralisez, tracez et restituez les objets trouvés avec un tableau de bord professionnel, des comptes multiples pour le personnel, et des statistiques détaillées sur les objets traités.",
    icon: Building2,
    category: "Solutions professionnelles",
    targetAudience: "Hôtels, aéroports, gares, centres commerciaux, entreprises",
    image: "/product-qrtags-entreprise.jpg",
    gradient: "from-indigo-600 to-blue-500",
    accentHex: "#4f46e5",
    features: [
      {
        title: "Tableau de bord centralisé",
        description: "Gérez tous les objets trouvés depuis une interface unique et intuitive.",
        icon: BarChart3,
      },
      {
        title: "Comptes multiples",
        description: "Créez des comptes pour chaque membre du personnel avec rôles et permissions.",
        icon: Users,
      },
      {
        title: "Étiquettes personnalisées",
        description: "Tags QR personnalisables avec le logo et les couleurs de votre entreprise.",
        icon: QrCode,
      },
      {
        title: "Statistiques & rapports",
        description: "Suivez les volumes d'objets trouvés, les taux de restitution et les délais.",
        icon: BarChart3,
      },
      {
        title: "API d'intégration",
        description: "Intégrez QRtags à vos systèmes existants via notre API REST.",
        icon: Zap,
      },
      {
        title: "Gestion des restitutions",
        description: "Suivez le processus complet de restitution avec traçabilité.",
        icon: PackageCheck,
      },
      {
        title: "Support prioritaire",
        description: "Assistance dédiée et temps de réponse garantis pour les professionnels.",
        icon: Bell,
      },
      {
        title: "Conformité RGPD",
        description: "Gestion des données conforme aux réglementations en vigueur.",
        icon: ShieldCheck,
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: "Déployez les étiquettes",
        description: "Étiquetez chaque objet trouvé avec un QR tag personnalisé à votre marque.",
      },
      {
        step: 2,
        title: "Enregistrez en masse",
        description: "Le personnel enregistre les objets dans le tableau de bord centralisé.",
      },
      {
        step: 3,
        title: "Notifiez le propriétaire",
        description: "Si l'objet est identifié, le propriétaire est notifié automatiquement.",
      },
      {
        step: 4,
        title: "Restituez & tracez",
        description: "Organisez la restitution et conservez l'historique complet pour vos statistiques.",
      },
    ],
    benefits: [
      "Réduction du temps de gestion des objets trouvés",
      "Amélioration de la satisfaction client",
      "Traçabilité complète et conformité",
      "Marque blanche disponible",
    ],
  },
  {
    id: "qrtrans",
    name: "QRtrans",
    tagline: "Suivez vos colis en temps réel via WhatsApp",
    description:
      "Solution de traçabilité d'envoi de colis via QR code et notifications WhatsApp.",
    longDescription:
      "QRtrans révolutionne l'envoi de colis. Générez une étiquette QR code pour chaque colis, suivez son parcours en temps réel et recevez toutes les notifications directement sur WhatsApp — sans application à installer. Le destinataire est informé à chaque étape : envoi, transit, arrivée, livraison. Simple, rapide et universel.",
    icon: Package,
    category: "Logistique & Livraison",
    targetAudience: "E-commerçants, livreurs, particuliers, PME",
    image: "/product-qrtrans.jpg",
    gradient: "from-orange-500 to-amber-500",
    accentHex: "#ea580c",
    features: [
      {
        title: "Étiquette QR instantanée",
        description: "Générez et imprimez une étiquette QR code pour chaque colis en quelques secondes.",
        icon: QrCode,
      },
      {
        title: "Notifications WhatsApp",
        description: "Alertes WhatsApp à chaque étape : envoi, transit, livraison, pour l'expéditeur et le destinataire.",
        icon: MessageSquare,
      },
      {
        title: "Suivi temps réel",
        description: "Position et statut du colis mis à jour en temps réel sur la carte.",
        icon: MapPin,
      },
      {
        title: "Confirmation de livraison",
        description: "Signature numérique et preuve de livraison via scan du QR code.",
        icon: PackageCheck,
      },
      {
        title: "Historique complet",
        description: "Accédez à l'historique de tous vos envois et leurs statuts.",
        icon: History,
      },
      {
        title: "Partage de suivi",
        description: "Partagez le lien de suivi avec le destinataire — aucune app requise.",
        icon: Share2,
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: "Créez l'envoi",
        description: "Saisissez les informations du colis et du destinataire dans l'application.",
      },
      {
        step: 2,
        title: "Imprimez le QR code",
        description: "Générez et fixez l'étiquette QR code sur le colis.",
      },
      {
        step: 3,
        title: "Notifications WhatsApp",
        description: "Le destinataire reçoit un message WhatsApp avec le lien de suivi en temps réel.",
      },
      {
        step: 4,
        title: "Livraison confirmée",
        description: "Le livreur scanne le QR code à la livraison, preuve envoyée automatiquement.",
      },
    ],
    benefits: [
      "Aucune application à installer pour le destinataire",
      "Réduction des appels de suivi client de 80%",
      "Transparence totale sur la chaîne logistique",
      "Intégration WhatsApp native et instantanée",
    ],
  },
  {
    id: "verifscan",
    name: "VerifScan",
    tagline: "La transparence alimentaire par le scan",
    description:
      "Solution de traçabilité des produits agroalimentaires via un scan QR code pour les entrepreneurs.",
    longDescription:
      "VerifScan permet aux entrepreneurs du secteur agroalimentaire de tracer leurs produits du producteur au consommateur. Chaque lot de production reçoit un QR code unique. Le consommateur scanne et accède à toutes les informations : origine, date de production, transformation, certifications. Construisez la confiance et la transparence avec vos clients tout en assurant la conformité aux normes de sécurité alimentaire.",
    icon: ShieldCheck,
    category: "Agroalimentaire",
    targetAudience: "Producteurs, transformateurs, coopératives, marques agroalimentaires",
    image: "/product-verifscan.jpg",
    gradient: "from-green-600 to-emerald-500",
    accentHex: "#16a34a",
    features: [
      {
        title: "QR code par lot",
        description: "Générez un QR code unique pour chaque lot de production.",
        icon: QrCode,
      },
      {
        title: "Traçabilité complète",
        description: "Suivez l'origine, la date de production, les étapes de transformation et le circuit de distribution.",
        icon: History,
      },
      {
        title: "Alertes de péremption",
        description: "Notifications automatiques pour les produits proches de la date de péremption.",
        icon: AlertCircle,
      },
      {
        title: "Rappel de produit",
        description: "Système de rappel rapide : identifiez et notifiez les consommateurs en cas de problème.",
        icon: Bell,
      },
      {
        title: "Transparence consommateur",
        description: "Le consommateur scanne et accède aux informations produit, certifications et allergènes.",
        icon: ScanLine,
      },
      {
        title: "Conformité alimentaire",
        description: "Respect des normes de sécurité alimentaire et des exigences réglementaires.",
        icon: ShieldCheck,
      },
      {
        title: "Tableau de bord des lots",
        description: "Gérez et supervisez tous vos lots de production depuis une interface centralisée.",
        icon: BarChart3,
      },
      {
        title: "Analytics de consommation",
        description: "Statistiques sur les scans : géographie, fréquence, comportements consommateurs.",
        icon: BarChart3,
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: "Créez le lot",
        description: "Enregistrez un nouveau lot de production avec toutes ses informations (origine, date, transformation).",
      },
      {
        step: 2,
        title: "Générez le QR code",
        description: "Imprimez le QR code VerifScan sur l'emballage de chaque produit du lot.",
      },
      {
        step: 3,
        title: "Le consommateur scanne",
        description: "Le client scanne le QR code et accède à la fiche complète de transparence du produit.",
      },
      {
        step: 4,
        title: "Suivez & analysez",
        description: "Consultez les analytics de scans et gérez les alertes depuis votre tableau de bord.",
      },
    ],
    benefits: [
      "Renforcez la confiance de vos consommateurs",
      "Conformité aux normes de traçabilité alimentaire",
      "Réaction rapide en cas de rappel de produit",
      "Valorisez l'origine et la qualité de vos produits",
    ],
  },
  {
    id: "myrest",
    name: "MyRest",
    tagline: "Votre menu digital, scannable en un geste",
    description:
      "Solution qui permet aux clients de restaurants de scanner un QR code pour accéder au menu digital.",
    longDescription:
      "MyRest transforme l'expérience restaurant. Les clients scannent un QR code sur leur table et accèdent instantanément au menu digital : photos des plats, descriptions détaillées, informations allergènes, support multilingue. Les restaurateurs mettent à jour leur menu en temps réel — prix, plats du jour, promotions — sans réimpression. Option de commande et paiement en ligne directement depuis le menu digital.",
    icon: UtensilsCrossed,
    category: "Restauration",
    targetAudience: "Restaurants, cafés, hôtels, traiteurs",
    image: "/product-myrest.jpg",
    gradient: "from-rose-500 to-red-500",
    accentHex: "#e11d48",
    features: [
      {
        title: "Menu digital scannable",
        description: "Les clients accèdent au menu en scannant un QR code sur la table — aucune app à installer.",
        icon: QrCode,
      },
      {
        title: "Photos & descriptions",
        description: "Mettez en valeur vos plats avec photos haute qualité et descriptions détaillées.",
        icon: FileText,
      },
      {
        title: "Informations allergènes",
        description: "Affichez automatiquement les allergènes et informations nutritionnelles de chaque plat.",
        icon: AlertCircle,
      },
      {
        title: "Support multilingue",
        description: "Menu traduit automatiquement pour la clientèle internationale.",
        icon: Languages,
      },
      {
        title: "Mise à jour instantanée",
        description: "Modifiez prix, plats du jour et promotions en temps réel, sans réimpression.",
        icon: RefreshCw,
      },
      {
        title: "Commande en ligne",
        description: "Permettez aux clients de commander directement depuis le menu digital.",
        icon: Smartphone,
      },
      {
        title: "Paiement intégré",
        description: "Paiement sécurisé directement depuis le menu, sans attendre l'addition.",
        icon: CreditCard,
      },
      {
        title: "Tableau de bord",
        description: "Gérez votre menu, vos catégories et vos plats depuis une interface simple.",
        icon: BarChart3,
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: "Créez votre menu",
        description: "Ajoutez vos plats, photos, descriptions et prix dans le tableau de bord MyRest.",
      },
      {
        step: 2,
        title: "Imprimez le QR code",
        description: "Placez le QR code sur les tables de votre restaurant.",
      },
      {
        step: 3,
        title: "Le client scanne",
        description: "Le client scanne le QR code et accède au menu digital sur son smartphone.",
      },
      {
        step: 4,
        title: "Commande & paiement",
        description: "Le client commande et paie directement depuis le menu digital, si activé.",
      },
    ],
    benefits: [
      "Réduction des coûts d'impression de menus",
      "Expérience client moderne et sans contact",
      "Mise à jour des prix en temps réel",
      "Augmentation du panier moyen grâce aux photos",
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
