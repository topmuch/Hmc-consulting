export type MessageStatus = "new" | "in_progress" | "treated" | "archived";
export type MessageStage = "received" | "qualified" | "meeting" | "client";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: string;
  message: string;
  productId: string | null;
  status: string; // MessageStatus
  stage: string; // MessageStage
  tags: string | null; // comma-separated
  notes: string | null; // internal notes
  createdAt: string;
  updatedAt: string;
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
  byStatus: { status: string; count: number }[];
  byStage: { stage: string; count: number }[];
  byProduct: { productId: string | null; count: number }[];
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
