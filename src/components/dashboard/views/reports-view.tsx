"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Target,
  Users,
  User as UserIcon,
  Activity,
  Download,
  FileText,
  Loader2,
  Megaphone,
  Globe,
  Package,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { getProductById } from "@/lib/products-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  ViewHeader,
  MiniStatCard,
  ErrorState,
  EmptyState,
  Pill,
  timeAgo,
  LEAD_SOURCE_LABELS,
} from "./_shared";

type OverviewReport = {
  messages: {
    total: number;
    new: number;
    inProgress: number;
    treated: number;
    archived: number;
  };
  leads: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
    lost: number;
    bySource: { source: string; count: number }[];
    byProduct: { productId: string | null; count: number }[];
  };
  clients: {
    total: number;
    prospects: number;
    clients: number;
    partners: number;
    active: number;
    inactive: number;
  };
  users: {
    total: number;
    active: number;
  };
  recentActivity: { type: "message" | "lead" | "client"; label: string; date: string }[];
};

const NAVY = "#003070";
const SKY = "#50b0e0";

const SOURCE_COLORS: Record<string, string> = {
  website: "#0ea5e9",
  referral: "#10b981",
  campaign: "#f97316",
  other: "#94a3b8",
};

const ACTIVITY_META: Record<
  string,
  { icon: typeof Mail; color: string }
> = {
  message: { icon: Mail, color: "bg-sky-500/10 text-sky-600" },
  lead: { icon: Target, color: "bg-amber-500/10 text-amber-600" },
  client: { icon: Users, color: "bg-emerald-500/10 text-emerald-600" },
};

export function ReportsView({ refreshSignal = 0 }: { refreshSignal?: number } = {}) {
  const { toast } = useToast();
  const [report, setReport] = useState<OverviewReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/reports/overview", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setReport(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [refreshSignal]);

  const handleExportCsv = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const res = await fetch("/api/messages/export", { cache: "no-store" });
      if (!res.ok) throw new Error("Échec de l'export");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hmc-messages.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Export CSV prêt",
        description: "Le fichier a été téléchargé.",
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleMonthlyReport = () => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    window.open(`/api/messages/report?month=${month}`, "_blank");
  };

  return (
    <>
      <ViewHeader
        title="Rapports"
        subtitle="Vue d'ensemble de l'activité"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={handleExportCsv}
              disabled={exporting}
              size="sm"
              variant="outline"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-1.5" />
              )}
              <span className="hidden sm:inline">Exporter les messages (CSV)</span>
              <span className="sm:hidden">CSV</span>
            </Button>
            <Button onClick={handleMonthlyReport} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <FileText className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Rapport mensuel (PDF)</span>
              <span className="sm:hidden">Rapport</span>
            </Button>
          </div>
        }
      />

      {loading ? (
        <ReportsSkeleton />
      ) : error ? (
        <ErrorState onRetry={fetchReport} />
      ) : report ? (
        <div className="space-y-6">
          {/* Messages section */}
          <ReportSection
            title="Messages"
            icon={Mail}
            color="bg-sky-500/10 text-sky-600"
          >
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <MiniStatCard icon={Mail} label="Total" value={report.messages.total} />
              <MiniStatCard icon={AlertCircle} label="Nouveaux" value={report.messages.new} color="bg-blue-500/10 text-blue-600" delay={0.05} />
              <MiniStatCard icon={Activity} label="En cours" value={report.messages.inProgress} color="bg-amber-500/10 text-amber-600" delay={0.1} />
              <MiniStatCard icon={RefreshCw} label="Traités" value={report.messages.treated} color="bg-emerald-500/10 text-emerald-600" delay={0.15} />
              <MiniStatCard icon={Package} label="Archivés" value={report.messages.archived} color="bg-gray-500/10 text-gray-500" delay={0.2} />
            </div>
          </ReportSection>

          {/* Leads section */}
          <ReportSection
            title="Leads"
            icon={Target}
            color="bg-amber-500/10 text-amber-600"
          >
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
              <MiniStatCard icon={Target} label="Total" value={report.leads.total} />
              <MiniStatCard icon={AlertCircle} label="Nouveaux" value={report.leads.new} color="bg-blue-500/10 text-blue-600" delay={0.05} />
              <MiniStatCard icon={Mail} label="Contactés" value={report.leads.contacted} color="bg-amber-500/10 text-amber-600" delay={0.1} />
              <MiniStatCard icon={UserIcon} label="Qualifiés" value={report.leads.qualified} color="bg-violet-500/10 text-violet-600" delay={0.15} />
              <MiniStatCard icon={Activity} label="Convertis" value={report.leads.converted} color="bg-emerald-500/10 text-emerald-600" delay={0.2} />
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <SimpleBarChart
                title="Leads par source"
                data={report.leads.bySource.map((s) => ({
                  key: s.source,
                  label: LEAD_SOURCE_LABELS[s.source] || s.source,
                  value: s.count,
                  color: SOURCE_COLORS[s.source] || SKY,
                }))}
                emptyIcon={Globe}
              />
              <SimpleBarChart
                title="Leads par produit"
                data={report.leads.byProduct.map((p) => {
                  const product = p.productId ? getProductById(p.productId) : undefined;
                  return {
                    key: p.productId || "__none__",
                    label: product?.name || "Non spécifié",
                    value: p.count,
                    color: product?.accentHex || NAVY,
                    icon: product?.icon,
                  };
                })}
                emptyIcon={Package}
              />
            </div>
          </ReportSection>

          {/* Clients section */}
          <ReportSection
            title="Clients"
            icon={Users}
            color="bg-emerald-500/10 text-emerald-600"
          >
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <MiniStatCard icon={Users} label="Total" value={report.clients.total} />
              <MiniStatCard icon={UserIcon} label="Prospects" value={report.clients.prospects} color="bg-blue-500/10 text-blue-600" delay={0.05} />
              <MiniStatCard icon={Activity} label="Clients" value={report.clients.clients} color="bg-emerald-500/10 text-emerald-600" delay={0.1} />
              <MiniStatCard icon={Megaphone} label="Partenaires" value={report.clients.partners} color="bg-violet-500/10 text-violet-600" delay={0.15} />
              <MiniStatCard icon={RefreshCw} label="Actifs" value={report.clients.active} color="bg-emerald-500/10 text-emerald-600" delay={0.2} />
            </div>
          </ReportSection>

          {/* Users section */}
          <ReportSection
            title="Utilisateurs"
            icon={UserIcon}
            color="bg-violet-500/10 text-violet-600"
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-md">
              <MiniStatCard icon={Users} label="Total" value={report.users.total} />
              <MiniStatCard icon={Activity} label="Actifs" value={report.users.active} color="bg-emerald-500/10 text-emerald-600" delay={0.05} />
            </div>
          </ReportSection>

          {/* Recent activity */}
          <div className="bg-card rounded-2xl border border-border p-5 sm:p-6">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Activité récente
            </h3>
            {report.recentActivity.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="Aucune activité récente"
                description="Les nouveaux messages, leads et clients apparaîtront ici."
              />
            ) : (
              <ul className="divide-y divide-border">
                {report.recentActivity.map((a, i) => {
                  const meta = ACTIVITY_META[a.type] || ACTIVITY_META.message;
                  const Icon = meta.icon;
                  return (
                    <li
                      key={`${a.type}-${i}-${a.date}`}
                      className="flex items-center gap-3 py-3"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${meta.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-foreground truncate">
                          {a.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {timeAgo(a.date)}
                        </div>
                      </div>
                      <Pill
                        label={a.type}
                        colorClass={
                          a.type === "message"
                            ? "bg-sky-500/10 text-sky-600 border-sky-500/30"
                            : a.type === "lead"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function ReportSection({
  title,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  icon: typeof Mail;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="bg-card rounded-2xl border border-border p-5 sm:p-6"
    >
      <h3 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function SimpleBarChart({
  title,
  data,
  emptyIcon: EmptyIcon,
}: {
  title: string;
  data: { key: string; label: string; value: number; color: string; icon?: typeof Mail }[];
  emptyIcon: typeof Mail;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const maxCount = Math.max(...sorted.map((d) => d.value), 1);

  return (
    <div className="rounded-xl border border-border p-4">
      <h4 className="text-sm font-semibold text-foreground mb-3">{title}</h4>
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <EmptyIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Aucune donnée</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sorted.map((d, idx) => {
            const Icon = d.icon;
            const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
            const widthPct = (d.value / maxCount) * 100;
            return (
              <div key={d.key}>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {Icon && (
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-md shrink-0"
                        style={{ backgroundColor: `${d.color}1a`, color: d.color }}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <span className="text-sm text-foreground truncate">{d.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 shrink-0">
                    <span className="text-sm font-semibold text-foreground tabular-nums">
                      {d.value}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums w-9 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary/60 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ backgroundColor: d.color, width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card rounded-2xl border border-border p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}
