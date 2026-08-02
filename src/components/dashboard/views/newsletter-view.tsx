"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  Trash2,
  Download,
  Mail,
  Users,
  Calendar,
  TrendingUp,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ViewHeader,
  MiniStatCard,
  EmptyState,
  ErrorState,
  TableSkeleton,
  Pill,
  formatDate,
  timeAgo,
} from "./_shared";

type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
  status: string;
};

export function NewsletterView({ refreshSignal = 0 }: { refreshSignal?: number } = {}) {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/newsletter", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [refreshSignal, fetchSubscribers]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, search]);

  const stats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const newThisMonth = subscribers.filter(
      (s) => new Date(s.createdAt) >= startOfMonth
    ).length;
    const newThisWeek = subscribers.filter(
      (s) => new Date(s.createdAt) >= startOfWeek
    ).length;

    return {
      total: subscribers.length,
      newThisMonth,
      newThisWeek,
    };
  }, [subscribers]);

  const handleDelete = async () => {
    if (!deleteId || deleting) return;
    setDeleting(true);
    const prev = subscribers;
    setSubscribers((cur) => cur.filter((s) => s.id !== deleteId));
    try {
      const res = await fetch(`/api/newsletter?id=${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Échec de la suppression");
      }
      toast({ title: "Abonné supprimé", description: "L'abonné a été retiré de la newsletter." });
      setDeleteId(null);
    } catch (err) {
      setSubscribers(prev);
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Échec de la suppression",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCsv = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      // Build CSV client-side from current data
      const header = "Email,Date d'inscription,Statut\n";
      const rows = subscribers
        .map(
          (s) =>
            `"${s.email}","${formatDate(s.createdAt)}","${s.status || "active"}"`
        )
        .join("\n");
      const csv = header + rows;
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hmc-newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Export CSV prêt",
        description: "Le fichier a été téléchargé.",
      });
    } catch (err) {
      console.error("[newsletter export]", err);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <ViewHeader
        title="Newsletter"
        subtitle="Gérez vos abonnés à la newsletter"
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchSubscribers}
              size="sm"
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </Button>
            <Button
              onClick={handleExportCsv}
              size="sm"
              variant="outline"
              disabled={exporting || subscribers.length === 0}
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-1.5" />
              )}
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MiniStatCard
          icon={Users}
          label="Total abonnés"
          value={stats.total}
          delay={0}
        />
        <MiniStatCard
          icon={TrendingUp}
          label="Ce mois-ci"
          value={stats.newThisMonth}
          color="bg-emerald-500/10 text-emerald-600"
          delay={0.05}
        />
        <MiniStatCard
          icon={Calendar}
          label="Cette semaine"
          value={stats.newThisWeek}
          color="bg-blue-500/10 text-blue-600"
          delay={0.1}
        />
      </div>

      {/* Search */}
      <div className="bg-card rounded-2xl border border-border p-3 flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par e-mail…"
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState onRetry={fetchSubscribers} />
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border">
          <EmptyState
            icon={Mail}
            title={
              subscribers.length === 0
                ? "Aucun abonné pour le moment"
                : "Aucun abonné trouvé"
            }
            description={
              subscribers.length === 0
                ? "Les abonnés à la newsletter apparaîtront ici dès qu'ils s'inscrivent."
                : "Essayez une autre recherche."
            }
          />
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-5 py-3 font-medium">E-mail</th>
                  <th className="px-5 py-3 font-medium">Date d'inscription</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent shrink-0">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-foreground truncate">
                          {s.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="text-xs text-foreground/80 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(s.createdAt)}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {timeAgo(s.createdAt)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill
                        label={s.status === "new" ? "Actif" : s.status || "Actif"}
                        colorClass="bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                      />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                        onClick={() => setDeleteId(s.id)}
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !deleting && !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet abonné ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;abonné sera définitivement supprimé de la newsletter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
