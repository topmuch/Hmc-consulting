export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string;
};

export type DashboardData = {
  messages: ContactMessage[];
  stats: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    today: number;
    monthGrowth: number;
  };
  byDay: { date: string; label: string; count: number }[];
  bySubject: { name: string; value: number }[];
  byDow: { name: string; count: number }[];
};

export const SUBJECT_COLORS: Record<string, string> = {
  Audit: "#003070",
  Stratégie: "#50b0e0",
  Finance: "#2b6cb0",
  Transformation: "#3182ce",
  Management: "#4299e1",
  Structuration: "#63b3ed",
  Autre: "#90cdf4",
};
