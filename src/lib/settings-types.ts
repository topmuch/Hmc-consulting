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

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "HMC",
  siteFullName: "Horizon Management Consulting",
  tagline: "Votre partenaire en conseil et management des entreprises",
  email: "contact@hmc-consulting.com",
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
};
