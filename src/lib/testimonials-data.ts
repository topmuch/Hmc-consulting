export type Testimonial = {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  image: string;
  project: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Aminata Diallo",
    company: "Sahel Finance Group",
    role: "Directrice Générale",
    content:
      "HMC nous a accompagnés dans la structuration de notre groupe avec une rigueur et une disponibilité remarquables. Leur compréhension des enjeux africains fait toute la différence. En douze mois, nous avons rationalisé nos processus et amélioré notre rentabilité de 35%.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    project: "Audit organisationnel & structuration",
  },
  {
    id: "2",
    name: "Jean-Pierre Kouassi",
    company: "Atlantique Industries SA",
    role: "Président",
    content:
      "Grâce à l'intervention d'HMC, nous avons pu restructurer notre organisation et améliorer significativement notre performance opérationnelle en moins de six mois. Leur méthode est pragmatique et leurs recommandations sont toujours applicables.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    project: "Transformation digitale & réorganisation",
  },
  {
    id: "3",
    name: "Fatou Ndiaye",
    company: "Teranga Capital",
    role: "Directrice Financière",
    content:
      "Le conseil stratégique d'HMC a été déterminant dans notre levée de fonds. Leur réseau et leur expertise nous ont ouvert des portes que nous ne pensions pas accessibles. Ils ont su structurer notre dossier de manière convaincante pour les investisseurs internationaux.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    project: "Conseil stratégique & levée de fonds",
  },
  {
    id: "4",
    name: "Omar Benali",
    company: "Maghreb Logistique",
    role: "Directeur des Opérations",
    content:
      "Une équipe à l'écoute, qui comprend les réalités du terrain et propose des solutions pragmatiques. HMC est devenu un partenaire de confiance pour nos projets de développement. Leur accompagnement dans la mise en place de notre système de gestion a été exemplaire.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    project: "Optimisation logistique & gestion opérationnelle",
  },
  {
    id: "5",
    name: "Aïcha Touré",
    company: "Coris Bank International",
    role: "Directrice Audit & Conformité",
    content:
      "L'audit de conformité mené par HMC a révélé des failles que nous n'avions pas identifiées. Leur approche méthodique et leur connaissance du cadre réglementaire ouest-africain nous ont permis de renforcer significativement nos contrôles internes.",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200&fit=crop&crop=face",
    project: "Audit de conformité & contrôle interne",
  },
  {
    id: "6",
    name: "Moussa Keïta",
    company: "Coton Sénégal SA",
    role: "Directeur Général Adjoint",
    content:
      "HMC a su nous proposer une stratégie de diversification ambitieuse mais réaliste, adaptée aux spécificités du marché agricole sénégalais. Leur expertise sectorielle et leur capacité à fédérer les équipes autour du projet ont été des atouts majeurs.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    project: "Stratégie de diversification & plan d'affaires",
  },
];
