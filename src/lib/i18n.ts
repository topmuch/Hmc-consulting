"use client";

import { useSyncExternalStore, useCallback } from "react";
import React from "react";

// ─── Types ─────────────────────────────────────────────────────

export type Locale = "fr" | "en";

// ─── Nested translations structure ─────────────────────────────

type NavTranslations = {
  home: string;
  about: string;
  services: string;
  products: string;
  blog: string;
  contact: string;
  team: string;
  login: string;
  values: string;
  experience: string;
  expertise: string;
  formations: string;
  devis: string;
};

type HeroTranslations = {
  eyebrow: string;
  title1: string;
  title2: string;
  description: string;
  cta1: string;
  cta2: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  location: string;
};

type ServicesTranslations = {
  title: string;
  description: string;
  link: string;
  strategicTitle: string;
  strategicSubtitle: string;
  strategicDescription: string;
  operationalTitle: string;
  operationalSubtitle: string;
  operationalDescription: string;
  transformationTitle: string;
  transformationSubtitle: string;
  transformationDescription: string;
};

type ProductsTranslations = {
  title: string;
  description: string;
  link: string;
};

type AboutTranslations = {
  title: string;
  description: string;
  sectionTitle: string;
  sectionDescription: string;
};

type ContactTranslations = {
  title: string;
  titleAccent: string;
  description: string;
  nameLabel: string;
  emailLabel: string;
  companyLabel: string;
  phoneLabel: string;
  productLabel: string;
  subjectLabel: string;
  messageLabel: string;
  attachmentLabel: string;
  attachmentHint: string;
  submitButton: string;
  sendingButton: string;
  successTitle: string;
  successDescription: string;
  sendAnother: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  companyPlaceholder: string;
  phonePlaceholder: string;
  subjectPlaceholder: string;
  messagePlaceholder: string;
  noProductOption: string;
  consentText: string;
  interlocutorLabel: string;
  emailCardLabel: string;
  locationSubtitle: string;
};

type BlogTranslations = {
  title: string;
  link: string;
  readMore: string;
  eyebrow: string;
  titleAccent: string;
  description: string;
  emptyState: string;
  noArticles: string;
};

type FooterTranslations = {
  navigation: string;
  about: string;
  contact: string;
  home: string;
  ourValues: string;
  ourExperience: string;
  ourExpertise: string;
  rights: string;
  tagline: string;
  location: string;
};

type CommonTranslations = {
  seeMore: string;
  learnMore: string;
  send: string;
  back: string;
  next: string;
  previous: string;
  loadMore: string;
  loading: string;
  submit: string;
  cancel: string;
  save: string;
  close: string;
  search: string;
  required: string;
  optional: string;
  or: string;
  and: string;
};

type AppointmentTranslations = {
  eyebrow: string;
  title1: string;
  title2: string;
  description: string;
  availabilityLabel: string;
  availabilityValue: string;
  durationLabel: string;
  durationValue: string;
  confirmationLabel: string;
  confirmationValue: string;
  freeText: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  companyLabel: string;
  dateLabel: string;
  timeLabel: string;
  subjectLabel: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  companyPlaceholder: string;
  subjectPlaceholder: string;
  submitButton: string;
  submittingButton: string;
  successTitle: string;
  successDescription: string;
  bookAnother: string;
  consentText: string;
  toastTitle: string;
  toastDescription: string;
  errorLead: string;
};

type QuoteTranslations = {
  eyebrow: string;
  title1: string;
  title2: string;
  description: string;
  step1Title: string;
  step1Description: string;
  step2Title: string;
  step2Description: string;
  step3Title: string;
  step3Description: string;
  step4Title: string;
  step4Description: string;
  step5Title: string;
  step5Description: string;
  successTitle: string;
  successDescription: string;
  newRequest: string;
  submit: string;
  next: string;
  previous: string;
  sending: string;
  productsLabel: string;
  needLabel: string;
  infoLabel: string;
  summaryLabel: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  descriptionHint: string;
  timelineLabel: string;
  budgetLabel: string;
  selectOption: string;
  fullNameLabel: string;
  emailLabel: string;
  companyLabel: string;
  phoneLabel: string;
  selectedProducts: string;
  selectedProduct: string;
  consentText: string;
  reviewProducts: string;
  reviewDescription: string;
  reviewTimeline: string;
  reviewBudget: string;
  reviewName: string;
  reviewEmail: string;
  reviewCompany: string;
  reviewPhone: string;
};

type NewsletterTranslations = {
  title: string;
  titleAccent: string;
  description: string;
  placeholder: string;
  submitButton: string;
  loadingButton: string;
  successMessage: string;
  eyebrow: string;
  errorEmpty: string;
  errorInvalid: string;
  errorDuplicate: string;
  errorConnection: string;
};

type TeamTranslations = {
  title: string;
  description: string;
};

type TestimonialsTranslations = {
  title: string;
  titleAccent: string;
  description: string;
  eyebrow: string;
  previous: string;
  next: string;
};

type HomeTranslations = {
  exploreEyebrow: string;
  exploreTitle1: string;
  exploreTitle2: string;
  exploreDescription: string;
  servicesLink: string;
  productsEyebrow: string;
  productsTitle1: string;
  productsTitle2: string;
  productsDescription: string;
  productsLink: string;
  ctaTitle1: string;
  ctaTitle2: string;
  ctaDescription: string;
  ctaLink: string;
};

type HeaderTranslations = {
  contact: string;
  login: string;
  contactUs: string;
  openMenu: string;
  closeMenu: string;
  openSubMenu: string;
};

type LanguageTranslations = {
  french: string;
  english: string;
};

type FormationsTranslations = {
  eyebrow: string;
  title1: string;
  title2: string;
  description: string;
  viewAll: string;
  courses: string;
  course: string;
  discover: string;
  bannerTitle1: string;
  bannerTitle2: string;
  bannerDescription: string;
  domains: string;
  trainings: string;
  searchPlaceholder: string;
  noResults: string;
  seeMore: string;
  seeLess: string;
  ctaTitle1: string;
  ctaTitle2: string;
  ctaDescription: string;
  ctaLink: string;
};

type DevisTranslations = {
  eyebrow: string;
  title1: string;
  title2: string;
  description: string;
};

type TranslationSet = {
  nav: NavTranslations;
  hero: HeroTranslations;
  services: ServicesTranslations;
  products: ProductsTranslations;
  about: AboutTranslations;
  contact: ContactTranslations;
  blog: BlogTranslations;
  footer: FooterTranslations;
  common: CommonTranslations;
  appointment: AppointmentTranslations;
  quote: QuoteTranslations;
  newsletter: NewsletterTranslations;
  team: TeamTranslations;
  testimonials: TestimonialsTranslations;
  home: HomeTranslations;
  header: HeaderTranslations;
  language: LanguageTranslations;
  formations: FormationsTranslations;
  devis: DevisTranslations;
};

// ─── French translations ───────────────────────────────────────

const fr: TranslationSet = {
  nav: {
    home: "Accueil",
    about: "À propos",
    services: "Services",
    products: "Produits",
    blog: "Blog",
    contact: "Contact",
    team: "Équipe",
    login: "Connexion",
    values: "Valeurs",
    experience: "Expérience",
    expertise: "Expertise",
    formations: "Formations",
    devis: "Devis",
  },

  hero: {
    eyebrow: "Conseil & Management des entreprises",
    title1: "Votre partenaire en",
    title2: "conseil et management",
    description:
      "HMC est un cabinet de conseil et de management dédié aux entreprises. Nous accompagnons les organisations dans leur développement, sécurisons leur activité tout en maîtrisant leurs risques, de la stratégie à la mise en œuvre opérationnelle.",
    cta1: "Découvrir nos services",
    cta2: "Nous contacter",
    stat1Value: "ans d'expérience",
    stat1Label: "",
    stat2Value: "pays couverts",
    stat2Label: "",
    stat3Value: "PMe → Groupes",
    stat3Label: "toutes tailles",
    location: "Afrique & Océan Indien",
  },

  services: {
    title: "Nos services",
    description:
      "Un cabinet de conseil et de management dédié aux entreprises, du diagnostic stratégique à la mise en œuvre opérationnelle.",
    link: "Voir tous nos services",
    strategicTitle: "Conseil Stratégique",
    strategicSubtitle: "Vision & décision",
    strategicDescription:
      "Une connaissance profonde des secteurs d'activité nous permet d'adapter nos interventions à chaque typologie d'entreprise et à chaque phase de maturité, de la PMe au grand groupe.",
    operationalTitle: "Management Opérationnel",
    operationalSubtitle: "Pilotage & performance",
    operationalDescription:
      "Une offre complète couvrant le management de transition, l'organisation et le pilotage de la performance, pour sécuriser l'activité et garantir la rentabilité de nos clients.",
    transformationTitle: "Transformation",
    transformationSubtitle: "Solutions innovantes",
    transformationDescription:
      "L'application de solutions digitales et de méthodes éprouvées à notre expertise nous permet de proposer des accompagnements modernes, mesurables et adaptés aux évolutions des marchés.",
  },

  products: {
    title: "Nos produits",
    description:
      "Découvrez notre gamme de solutions basées sur la technologie QR code, conçues pour la traçabilité, la logistique et l'expérience client.",
    link: "Voir tous nos produits",
  },

  about: {
    title: "À propos",
    description:
      "Près de 30 ans d'expertise au service de l'excellence managériale.",
    sectionTitle: "À propos",
    sectionDescription:
      "Découvrez notre parcours, notre mission et les valeurs qui guident notre cabinet depuis ses débuts.",
  },

  contact: {
    title: "Parlons de votre",
    titleAccent: "projet",
    description:
      "Une question, un projet de développement, de structuration ou de transformation ? Notre équipe vous répond avec la confidentialité et l'attention que méritent vos enjeux.",
    nameLabel: "Nom complet *",
    emailLabel: "E-mail *",
    companyLabel: "Société",
    phoneLabel: "Téléphone",
    productLabel: "Produit intéressé (optionnel)",
    subjectLabel: "Sujet *",
    messageLabel: "Message *",
    attachmentLabel: "Pièce jointe (optionnel)",
    attachmentHint: "Ajoutez un document pour illustrer votre demande",
    submitButton: "Envoyer le message",
    sendingButton: "Envoi en cours…",
    successTitle: "Message envoyé",
    successDescription:
      "Merci pour votre confiance. Notre équipe revient vers vous dans les plus brefs délais.",
    sendAnother: "Envoyer un autre message",
    namePlaceholder: "Votre nom",
    emailPlaceholder: "vous@exemple.com",
    companyPlaceholder: "Votre entreprise",
    phonePlaceholder: "+221 ...",
    subjectPlaceholder: "Objet de votre demande",
    messagePlaceholder: "Décrivez votre projet ou votre demande…",
    noProductOption: "— Aucun produit spécifique —",
    consentText: "En envoyant ce formulaire, vous acceptez d'être recontacté par HMC.",
    interlocutorLabel: "Interlocuteur",
    emailCardLabel: "E-mail",
    locationSubtitle: "Afrique & Océan Indien",
  },

  blog: {
    title: "Blog",
    link: "Voir tous les articles",
    readMore: "Lire la suite",
    eyebrow: "Blog & Actualités",
    titleAccent: "publications",
    description:
      "Analyses, conseils et retours d'expérience pour accompagner le développement de votre entreprise et anticiper les évolutions des marchés.",
    emptyState: "Aucun article publié pour le moment. Revenez bientôt !",
    noArticles: "Aucun article",
  },

  footer: {
    navigation: "Navigation",
    about: "À propos",
    contact: "Contact",
    home: "Accueil",
    ourValues: "Nos valeurs",
    ourExperience: "Notre expérience",
    ourExpertise: "Notre expertise",
    rights: "Tous droits réservés.",
    tagline: "Conseil et management des entreprises.",
    location: "Afrique & Océan Indien",
  },

  common: {
    seeMore: "Voir plus",
    learnMore: "En savoir plus",
    send: "Envoyer",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    loadMore: "Charger plus",
    loading: "Chargement…",
    submit: "Soumettre",
    cancel: "Annuler",
    save: "Enregistrer",
    close: "Fermer",
    search: "Rechercher",
    required: "Obligatoire",
    optional: "Optionnel",
    or: "ou",
    and: "et",
  },

  appointment: {
    eyebrow: "Rendez-vous",
    title1: "Prenez",
    title2: "rendez-vous",
    description:
      "Réservez un créneau avec notre équipe. Que ce soit pour un audit, une consultation stratégique ou un accompagnement opérationnel, nous sommes à votre écoute.",
    availabilityLabel: "Disponibilité",
    availabilityValue: "Lun. — Ven. 9h–18h",
    durationLabel: "Durée estimée",
    durationValue: "45 min — 1h",
    confirmationLabel: "Confirmation",
    confirmationValue: "Par e-mail sous 24h",
    freeText: "Gratuit & sans engagement",
    nameLabel: "Nom complet *",
    emailLabel: "E-mail *",
    phoneLabel: "Téléphone",
    companyLabel: "Société",
    dateLabel: "Date souhaitée *",
    timeLabel: "Heure souhaitée",
    subjectLabel: "Sujet / Message",
    namePlaceholder: "Votre nom",
    emailPlaceholder: "vous@exemple.com",
    phonePlaceholder: "+221 ...",
    companyPlaceholder: "Votre entreprise",
    subjectPlaceholder: "Décrivez brièvement l'objet de votre rendez-vous…",
    submitButton: "Réserver le rendez-vous",
    submittingButton: "Réservation en cours…",
    successTitle: "Rendez-vous réservé",
    successDescription:
      "Merci pour votre demande. Notre équipe vous contactera dans les plus brefs délais pour confirmer le créneau.",
    bookAnother: "Prendre un autre rendez-vous",
    consentText: "En envoyant ce formulaire, vous acceptez d'être recontacté par HMC.",
    toastTitle: "Rendez-vous réservé",
    toastDescription: "Votre demande de rendez-vous a été enregistrée avec succès.",
    errorLead: "Impossible de créer ou retrouver le lead.",
  },

  quote: {
    eyebrow: "Générateur de devis",
    title1: "Demandez votre",
    title2: "devis personnalisé",
    description:
      "Décrivez votre projet en quelques étapes et recevez une proposition adaptée à vos besoins.",
    step1Title: "Sélectionnez un produit",
    step1Description: "Choisissez le produit qui correspond à votre besoin.",
    step2Title: "Décrivez votre besoin",
    step2Description: "Expliquez votre projet et ce que vous attendez de notre solution.",
    step3Title: "Vos informations",
    step3Description: "Renseignez vos coordonnées pour que nous puissions vous contacter.",
    step4Title: "Délai et budget",
    step4Description: "Aidez-nous à calibrer notre proposition en indiquant vos contraintes.",
    step5Title: "Résumé de votre demande",
    step5Description: "Vérifiez les informations avant de soumettre votre demande de devis.",
    successTitle: "Demande envoyée",
    successDescription:
      "Merci pour votre confiance. Notre équipe étudie votre demande et vous contactera dans les plus brefs délais avec une proposition personnalisée.",
    newRequest: "Nouvelle demande de devis",
    submit: "Envoyer la demande",
    next: "Suivant",
    previous: "Précédent",
    sending: "Envoi en cours…",
    productsLabel: "Produits",
    needLabel: "Besoin",
    infoLabel: "Info",
    summaryLabel: "Résumé",
    descriptionLabel: "Description de votre projet *",
    descriptionPlaceholder: "Décrivez votre projet, vos objectifs, le contexte de votre entreprise…",
    descriptionHint:
      "Minimum 10 caractères. Plus votre description est précise, plus notre devis sera adapté.",
    timelineLabel: "Délai souhaité *",
    budgetLabel: "Budget estimé *",
    selectOption: "— Sélectionnez —",
    fullNameLabel: "Nom complet *",
    emailLabel: "E-mail *",
    companyLabel: "Société",
    phoneLabel: "Téléphone",
    selectedProducts: "produits sélectionnés",
    selectedProduct: "produit sélectionné",
    consentText: "En soumettant ce formulaire, vous acceptez d'être recontacté par HMC.",
    reviewProducts: "Produits",
    reviewDescription: "Description",
    reviewTimeline: "Délai",
    reviewBudget: "Budget estimé",
    reviewName: "Nom",
    reviewEmail: "E-mail",
    reviewCompany: "Société",
    reviewPhone: "Téléphone",
  },

  newsletter: {
    title: "Restez",
    titleAccent: "informé",
    description:
      "Recevez nos analyses, nos conseils et nos actualités directement dans votre boîte mail. Une fois par mois, sans spam.",
    placeholder: "votre@email.com",
    submitButton: "S'inscrire",
    loadingButton: "Inscription...",
    successMessage: "Merci ! Vous êtes inscrit(e) à notre newsletter.",
    eyebrow: "Newsletter",
    errorEmpty: "Veuillez entrer votre adresse e-mail.",
    errorInvalid: "Veuillez entrer une adresse e-mail valide.",
    errorDuplicate: "Cette adresse e-mail est déjà inscrite.",
    errorConnection: "Erreur de connexion. Réessayez ultérieurement.",
  },

  team: {
    title: "Notre équipe",
    description: "Découvrez les consultants et experts qui font la force d'HMC.",
  },

  testimonials: {
    title: "Ils nous font",
    titleAccent: "confiance",
    description:
      "Découvrez ce que nos clients disent de notre accompagnement et de notre engagement à leurs côtés.",
    eyebrow: "Témoignages",
    previous: "Témoignage précédent",
    next: "Témoignage suivant",
  },

  home: {
    exploreEyebrow: "Explorez HMC",
    exploreTitle1: "Découvrez notre",
    exploreTitle2: "univers",
    exploreDescription:
      "Un cabinet de conseil et de management dédié aux entreprises, du diagnostic stratégique à la mise en œuvre opérationnelle.",
    servicesLink: "Voir tous nos services",
    productsEyebrow: "Nos produits",
    productsTitle1: "Solutions",
    productsTitle2: "digitales innovantes",
    productsDescription:
      "Découvrez notre gamme de solutions basées sur la technologie QR code, conçues pour la traçabilité, la logistique et l'expérience client.",
    productsLink: "Voir tous nos produits",
    ctaTitle1: "Parlons de votre",
    ctaTitle2: "projet",
    ctaDescription:
      "Une question, un projet de développement ou de structuration ? Notre équipe vous répond avec la confidentialité que méritent vos enjeux.",
    ctaLink: "Nous contacter",
  },

  header: {
    contact: "Nous contacter",
    login: "Connexion",
    contactUs: "Nous contacter",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    openSubMenu: "Ouvrir le sous-menu",
  },

  language: {
    french: "Français",
    english: "English",
  },

  formations: {
    eyebrow: "Formations",
    title1: "Nos domaines de",
    title2: "formation",
    description: "Développez les compétences de vos équipes grâce à nos formations sur mesure, dispensées par des experts et adaptées aux réalités du marché africain.",
    viewAll: "Voir toutes les formations",
    courses: "formations",
    course: "formation",
    discover: "Découvrir",
    bannerTitle1: "Nos",
    bannerTitle2: "formations",
    bannerDescription: "Développez les compétences de vos équipes grâce à nos formations sur mesure, dispensées par des experts et adaptées aux réalités du marché africain.",
    domains: "Domaines",
    trainings: "Formations",
    searchPlaceholder: "Rechercher un domaine ou une formation…",
    noResults: "Aucun domaine ne correspond à votre recherche.",
    seeMore: "Voir les autres formations",
    seeLess: "Voir moins",
    ctaTitle1: "Besoin d'une formation",
    ctaTitle2: "sur mesure",
    ctaDescription: "Nos experts conçoivent des programmes adaptés à vos enjeux spécifiques. Contactez-nous pour un programme personnalisé.",
    ctaLink: "Nous contacter",
  },

  devis: {
    eyebrow: "Devis",
    title1: "Demandez votre",
    title2: "devis personnalisé",
    description:
      "Découvrez l'ensemble de nos services, produits et formations, et demandez un devis personnalisé adapté à vos besoins.",
  },
};

const en: TranslationSet = {
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    products: "Products",
    blog: "Blog",
    contact: "Contact",
    team: "Team",
    login: "Login",
    values: "Values",
    experience: "Experience",
    expertise: "Expertise",
    formations: "Training",
    devis: "Quote",
  },

  hero: {
    eyebrow: "Business Consulting & Management",
    title1: "Your partner in",
    title2: "consulting and management",
    description:
      "HMC is a consulting and management firm dedicated to businesses. We support organizations in their development, secure their operations while managing their risks, from strategy to operational implementation.",
    cta1: "Discover our services",
    cta2: "Contact us",
    stat1Value: "years of experience",
    stat1Label: "",
    stat2Value: "countries covered",
    stat2Label: "",
    stat3Value: "SME → Groups",
    stat3Label: "all sizes",
    location: "Africa & Indian Ocean",
  },

  services: {
    title: "Our services",
    description:
      "A consulting and management firm dedicated to businesses, from strategic diagnosis to operational implementation.",
    link: "View all our services",
    strategicTitle: "Strategic Consulting",
    strategicSubtitle: "Vision & decision",
    strategicDescription:
      "A deep knowledge of business sectors allows us to adapt our interventions to each type of company and each phase of maturity, from SMEs to large corporations.",
    operationalTitle: "Operational Management",
    operationalSubtitle: "Pilotage & performance",
    operationalDescription:
      "A comprehensive offering covering transition management, organization and performance management, to secure operations and guarantee our clients' profitability.",
    transformationTitle: "Transformation",
    transformationSubtitle: "Innovative solutions",
    transformationDescription:
      "The application of digital solutions and proven methods to our expertise allows us to offer modern, measurable support adapted to market developments.",
  },

  products: {
    title: "Our products",
    description:
      "Discover our range of QR code technology-based solutions, designed for traceability, logistics and customer experience.",
    link: "View all our products",
  },

  about: {
    title: "About",
    description: "Nearly 30 years of expertise serving managerial excellence.",
    sectionTitle: "About",
    sectionDescription:
      "Discover our journey, our mission and the values that have guided our firm since its beginnings.",
  },

  contact: {
    title: "Let's talk about your",
    titleAccent: "project",
    description:
      "A question, a development, structuring or transformation project? Our team responds with the confidentiality and attention your challenges deserve.",
    nameLabel: "Full name *",
    emailLabel: "E-mail *",
    companyLabel: "Company",
    phoneLabel: "Phone",
    productLabel: "Product of interest (optional)",
    subjectLabel: "Subject *",
    messageLabel: "Message *",
    attachmentLabel: "Attachment (optional)",
    attachmentHint: "Add a document to illustrate your request",
    submitButton: "Send message",
    sendingButton: "Sending…",
    successTitle: "Message sent",
    successDescription:
      "Thank you for your trust. Our team will get back to you as soon as possible.",
    sendAnother: "Send another message",
    namePlaceholder: "Your name",
    emailPlaceholder: "you@example.com",
    companyPlaceholder: "Your company",
    phonePlaceholder: "+221 ...",
    subjectPlaceholder: "Subject of your request",
    messagePlaceholder: "Describe your project or your request…",
    noProductOption: "— No specific product —",
    consentText: "By submitting this form, you agree to be contacted by HMC.",
    interlocutorLabel: "Contact person",
    emailCardLabel: "E-mail",
    locationSubtitle: "Africa & Indian Ocean",
  },

  blog: {
    title: "Blog",
    link: "View all articles",
    readMore: "Read more",
    eyebrow: "Blog & News",
    titleAccent: "publications",
    description:
      "Analyses, advice and feedback to support your business development and anticipate market changes.",
    emptyState: "No articles published yet. Come back soon!",
    noArticles: "No articles",
  },

  footer: {
    navigation: "Navigation",
    about: "About",
    contact: "Contact",
    home: "Home",
    ourValues: "Our values",
    ourExperience: "Our experience",
    ourExpertise: "Our expertise",
    rights: "All rights reserved.",
    tagline: "Business consulting and management.",
    location: "Africa & Indian Ocean",
  },

  common: {
    seeMore: "See more",
    learnMore: "Learn more",
    send: "Send",
    back: "Back",
    next: "Next",
    previous: "Previous",
    loadMore: "Load more",
    loading: "Loading…",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    search: "Search",
    required: "Required",
    optional: "Optional",
    or: "or",
    and: "and",
  },

  appointment: {
    eyebrow: "Appointment",
    title1: "Book an",
    title2: "appointment",
    description:
      "Book a time slot with our team. Whether for an audit, a strategic consultation or operational support, we are here to help.",
    availabilityLabel: "Availability",
    availabilityValue: "Mon — Fri 9am–6pm",
    durationLabel: "Estimated duration",
    durationValue: "45 min — 1h",
    confirmationLabel: "Confirmation",
    confirmationValue: "By e-mail within 24h",
    freeText: "Free & no commitment",
    nameLabel: "Full name *",
    emailLabel: "E-mail *",
    phoneLabel: "Phone",
    companyLabel: "Company",
    dateLabel: "Preferred date *",
    timeLabel: "Preferred time",
    subjectLabel: "Subject / Message",
    namePlaceholder: "Your name",
    emailPlaceholder: "you@example.com",
    phonePlaceholder: "+221 ...",
    companyPlaceholder: "Your company",
    subjectPlaceholder: "Briefly describe the purpose of your appointment…",
    submitButton: "Book the appointment",
    submittingButton: "Booking in progress…",
    successTitle: "Appointment booked",
    successDescription:
      "Thank you for your request. Our team will contact you shortly to confirm the time slot.",
    bookAnother: "Book another appointment",
    consentText: "By submitting this form, you agree to be contacted by HMC.",
    toastTitle: "Appointment booked",
    toastDescription: "Your appointment request has been successfully recorded.",
    errorLead: "Unable to create or find the lead.",
  },

  quote: {
    eyebrow: "Quote Generator",
    title1: "Request your",
    title2: "customized quote",
    description:
      "Describe your project in a few steps and receive a proposal tailored to your needs.",
    step1Title: "Select a product",
    step1Description: "Choose the product that matches your needs.",
    step2Title: "Describe your needs",
    step2Description: "Explain your project and what you expect from our solution.",
    step3Title: "Your information",
    step3Description: "Provide your contact details so we can reach you.",
    step4Title: "Timeline & budget",
    step4Description: "Help us calibrate our proposal by indicating your constraints.",
    step5Title: "Review your request",
    step5Description: "Verify the information before submitting your quote request.",
    successTitle: "Request sent",
    successDescription:
      "Thank you for your trust. Our team will review your request and contact you shortly with a personalized proposal.",
    newRequest: "New quote request",
    submit: "Submit request",
    next: "Next",
    previous: "Previous",
    sending: "Sending…",
    productsLabel: "Products",
    needLabel: "Needs",
    infoLabel: "Info",
    summaryLabel: "Summary",
    descriptionLabel: "Description of your project *",
    descriptionPlaceholder: "Describe your project, your objectives, your company's context…",
    descriptionHint:
      "Minimum 10 characters. The more precise your description, the more adapted our quote will be.",
    timelineLabel: "Desired timeline *",
    budgetLabel: "Estimated budget *",
    selectOption: "— Select —",
    fullNameLabel: "Full name *",
    emailLabel: "E-mail *",
    companyLabel: "Company",
    phoneLabel: "Phone",
    selectedProducts: "products selected",
    selectedProduct: "product selected",
    consentText: "By submitting this form, you agree to be contacted by HMC.",
    reviewProducts: "Products",
    reviewDescription: "Description",
    reviewTimeline: "Timeline",
    reviewBudget: "Estimated budget",
    reviewName: "Name",
    reviewEmail: "E-mail",
    reviewCompany: "Company",
    reviewPhone: "Phone",
  },

  newsletter: {
    title: "Stay",
    titleAccent: "informed",
    description:
      "Receive our analyses, advice and news directly in your inbox. Once a month, no spam.",
    placeholder: "your@email.com",
    submitButton: "Subscribe",
    loadingButton: "Subscribing...",
    successMessage: "Thank you! You are now subscribed to our newsletter.",
    eyebrow: "Newsletter",
    errorEmpty: "Please enter your e-mail address.",
    errorInvalid: "Please enter a valid e-mail address.",
    errorDuplicate: "This e-mail address is already subscribed.",
    errorConnection: "Connection error. Please try again later.",
  },

  team: {
    title: "Our team",
    description: "Discover the consultants and experts who make HMC's strength.",
  },

  testimonials: {
    title: "They trust",
    titleAccent: "us",
    description:
      "Discover what our clients say about our support and our commitment by their side.",
    eyebrow: "Testimonials",
    previous: "Previous testimonial",
    next: "Next testimonial",
  },

  home: {
    exploreEyebrow: "Explore HMC",
    exploreTitle1: "Discover our",
    exploreTitle2: "universe",
    exploreDescription:
      "A consulting and management firm dedicated to businesses, from strategic diagnosis to operational implementation.",
    servicesLink: "View all our services",
    productsEyebrow: "Our products",
    productsTitle1: "Innovative",
    productsTitle2: "digital solutions",
    productsDescription:
      "Discover our range of QR code technology-based solutions, designed for traceability, logistics and customer experience.",
    productsLink: "View all our products",
    ctaTitle1: "Let's talk about your",
    ctaTitle2: "project",
    ctaDescription:
      "A question, a development or structuring project? Our team responds with the confidentiality your challenges deserve.",
    ctaLink: "Contact us",
  },

  header: {
    contact: "Contact us",
    login: "Login",
    contactUs: "Contact us",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    openSubMenu: "Open submenu",
  },

  language: {
    french: "Français",
    english: "English",
  },

  formations: {
    eyebrow: "Training",
    title1: "Our training",
    title2: "domains",
    description: "Develop your teams' skills with our customized training programs, delivered by experts and adapted to the realities of the African market.",
    viewAll: "View all training programs",
    courses: "courses",
    course: "course",
    discover: "Discover",
    bannerTitle1: "Our",
    bannerTitle2: "training programs",
    bannerDescription: "Develop your teams' skills with our customized training programs, delivered by experts and adapted to the realities of the African market.",
    domains: "Domains",
    trainings: "Training programs",
    searchPlaceholder: "Search for a domain or training…",
    noResults: "No domain matches your search.",
    seeMore: "View more courses",
    seeLess: "View less",
    ctaTitle1: "Need a",
    ctaTitle2: "custom training",
    ctaDescription: "Our experts design programs adapted to your specific challenges. Contact us for a personalized program.",
    ctaLink: "Contact us",
  },

  devis: {
    eyebrow: "Quote",
    title1: "Request your",
    title2: "custom quote",
    description:
      "Discover our full range of services, products and training, and request a personalized quote tailored to your needs.",
  },
};

const translations: Record<Locale, TranslationSet> = { fr, en };

// ─── Locale store (module-level, reactive via useSyncExternalStore) ──

const STORAGE_KEY = "hmc-locale";

let currentLocale: Locale = "fr";
let listeners: Array<() => void> = [];

// Initialize from localStorage on client
if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "fr" || stored === "en") {
      currentLocale = stored;
    }
  } catch {
    // ignore
  }
}

function subscribe(listener: () => void): () => void {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): Locale {
  return currentLocale;
}

function getServerSnapshot(): Locale {
  return "fr";
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

// ─── Dot notation resolver ─────────────────────────────────────

function resolve(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return path;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

// ─── Hook ──────────────────────────────────────────────────────

export function useTranslation() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const t = useCallback(
    (key: string): string => {
      return resolve(translations[locale] as unknown as Record<string, unknown>, key);
    },
    [locale]
  );

  const setLocale = useCallback((newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    currentLocale = newLocale;
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // ignore
    }
    try {
      document.cookie = `hmc_locale=${newLocale};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
    } catch {
      // ignore
    }
    emitChange();
  }, []);

  return {
    locale,
    t,
    setLocale,
    isFr: locale === "fr",
    isEn: locale === "en",
  } as const;
}

// ─── Backward-compatible I18nProvider (no-op) ──────────────────
// The hook now uses useSyncExternalStore so no context provider is needed.
// This component is kept for backward compatibility with existing code.

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}
