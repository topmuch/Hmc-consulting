"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FileText,
  RefreshCw,
  Building2,
  Clock,
  Wallet,
  Package,
  Search,
  Mail,
} from "lucide-react";
import { PRODUCTS } from "@/lib/products-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";

type QuoteMessage = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: string;
  message: string;
  productId: string | null;
  status: string;
  stage: string;
  tags: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  // Enriched fields from API
  productIds: string[];
  estimatedBudget: string | null;
  timeline: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  in_progress: "En cours",
  treated: "Traité",
  archived: "Archivé",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  in_progress: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  treated: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  archived: "bg-gray-500/10 text-gray-500 border-gray-500/30",
};

export function QuotesView({ refreshSignal }: { refreshSignal: number }) {
  const [quotes, setQuotes] = useState<QuoteMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/quotes", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setQuotes(data.quotes || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes, refreshSignal]);

  const filtered = quotes.filter((q) => {
    const qSearch = search.toLowerCase();
    if (!qSearch) return true;
    return (
      q.name.toLowerCase().includes(qSearch) ||
      q.email.toLowerCase().includes(qSearch) ||
      (q.company || "").toLowerCase().includes(qSearch) ||
      (q.productIds || []).some((pid) =>
        pid.toLowerCase().includes(qSearch) ||
        (PRODUCTS.find((p) => p.id === pid)?.name || "").toLowerCase().includes(qSearch)
      ) ||
      (q.estimatedBudget || "").toLowerCase().includes(qSearch)
    );
  });

  const newCount = quotes.filter((q) => q.status === "new").length;
  const inProgressCount = quotes.filter(
    (q) => q.status === "in_progress"
  ).length;
  const treatedCount = quotes.filter((q) => q.status === "treated").length;

  const getProductNames = (productIds: string[]) => {
    if (!productIds || productIds.length === 0) return "—";
    return productIds
      .map((pid) => {
        const product = PRODUCTS.find((p) => p.id === pid);
        return product ? product.name : pid;
      })
      .join(", ");
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
      );
    } catch {
      // silently fail
    }
  };

  return (
    <>
      <ViewHeader
        title="Devis"
        subtitle="Toutes les demandes de devis reçues via le générateur de devis"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchQuotes}
            className="gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Actualiser
          </Button>
        }
      />

      {/* Info banner */}
      <div className="rounded-xl border border-sky-200/60 bg-sky-50 px-4 py-3 text-sm text-sky-800 flex items-center gap-2.5">
        <Mail className="h-4 w-4 shrink-0" />
        <span>
          Les demandes de devis soumises via le générateur de devis apparaissent
          ici automatiquement.
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MiniStatCard
          icon={FileText}
          label="Total"
          value={quotes.length}
          color="bg-accent/10 text-accent"
        />
        <MiniStatCard
          icon={FileText}
          label="Nouveaux"
          value={newCount}
          color="bg-blue-500/10 text-blue-600"
        />
        <MiniStatCard
          icon={RefreshCw}
          label="En cours"
          value={inProgressCount}
          color="bg-amber-500/10 text-amber-600"
        />
        <MiniStatCard
          icon={FileText}
          label="Traités"
          value={treatedCount}
          color="bg-emerald-500/10 text-emerald-600"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un devis…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState onRetry={fetchQuotes} />
      ) : quotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucune demande de devis"
          description="Les demandes de devis soumises via le générateur apparaîtront ici."
        />
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Contact
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Produits
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Société
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Budget
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Délai
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Statut
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((q) => (
                  <tr
                    key={q.id}
                    className="hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() =>
                      setExpandedId(expandedId === q.id ? null : q.id)
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">
                        {q.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {q.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-foreground truncate max-w-[200px]">
                          {getProductNames(q.productIds)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-foreground">
                          {q.company || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-foreground">
                          {q.estimatedBudget || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-foreground">
                          {q.timeline || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={q.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateStatus(q.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap bg-transparent cursor-pointer",
                          STATUS_COLORS[q.status] ||
                            "bg-gray-500/10 text-gray-500 border-gray-500/30"
                        )}
                      >
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      <span title={formatDate(q.createdAt)}>
                        {timeAgo(q.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-border">
            {filtered.map((q) => (
              <div key={q.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-foreground">{q.name}</div>
                  <select
                    value={q.status}
                    onChange={(e) => updateStatus(q.id, e.target.value)}
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap bg-transparent cursor-pointer",
                      STATUS_COLORS[q.status] ||
                        "bg-gray-500/10 text-gray-500 border-gray-500/30"
                    )}
                  >
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-muted-foreground">{q.email}</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Package className="h-3 w-3" />
                    {getProductNames(q.productIds)}
                  </span>
                  {q.company && (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {q.company}
                    </span>
                  )}
                  {q.estimatedBudget && (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Wallet className="h-3 w-3" />
                      {q.estimatedBudget}
                    </span>
                  )}
                  {q.timeline && (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {q.timeline}
                    </span>
                  )}
                </div>
                {q.message && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {q.message}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  {timeAgo(q.createdAt)}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && search && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Aucun résultat pour « {search} »
            </div>
          )}
        </div>
      )}
    </>
  );
}
