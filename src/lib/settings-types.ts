export type SiteSettings = {
  siteName: string;
  siteFullName: string;
  tagline: string;
  email: string;
  phone: string;
  partner: string;
  partnerRole: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  ogImage: string | null;
  notifyEmail: string | null;
  notifyOnNewMessage: boolean;
  notifyDailyDigest: boolean;
  notifyWeeklyDigest: boolean;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  instagram: string | null;
  smtpHost: string | null;
  smtpPort: string | null;
  smtpUser: string | null;
  smtpPass: string | null;
  smtpFrom: string | null;
  adminPassword: string | null;
  autoReplyEnabled: boolean;
};

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};

export type EmailLogItem = {
  id: string;
  to: string;
  subject: string;
  body: string;
  type: string;
  status: string;
  messageId: string | null;
  createdAt: string;
};

export type MessageStatus = "new" | "in_progress" | "treated" | "archived";
export type MessageStage = "received" | "qualified" | "meeting" | "client";

export const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  in_progress: "En cours",
  treated: "Traité",
  archived: "Archivé",
};

export const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  in_progress: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  treated: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  archived: "bg-gray-500/10 text-gray-500 border-gray-500/30",
};

export const STAGE_LABELS: Record<string, string> = {
  received: "Reçu",
  qualified: "Qualifié",
  meeting: "Rendez-vous",
  client: "Client signé",
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "HMC",
  siteFullName: "Horizon Management Consulting",
  tagline: "Votre partenaire en conseil et management des entreprises",
  email: "contact@hmc-consulting.pro",
  phone: "+221 77 455 11 36",
  partner: "Cheikh Lam",
  partnerRole: "Partner",
  seoTitle: null,
  seoDescription: null,
  seoKeywords: null,
  ogImage: null,
  notifyEmail: null,
  notifyOnNewMessage: true,
  notifyDailyDigest: false,
  notifyWeeklyDigest: true,
  linkedin: null,
  twitter: null,
  facebook: null,
  instagram: null,
  smtpHost: null,
  smtpPort: null,
  smtpUser: null,
  smtpPass: null,
  smtpFrom: null,
  adminPassword: null,
  autoReplyEnabled: true,
};
