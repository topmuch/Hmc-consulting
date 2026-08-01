"use client";

import { useState, useMemo, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Target,
  Mail,
  Phone,
  Building2,
  Calendar,
  Loader2,
  Inbox,
  UserCheck,
  Contact,
  CheckCircle2,
} from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/products-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  NativeSelect,
  Pill,
  formatDate,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  LEAD_SOURCE_LABELS,
  LEAD_SOURCE_COLORS,
} from "./_shared";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  source: string;
  status: string;
  productId?: string | null;
  value?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

const STATUS_OPTIONS = ["new", "contacted", "qualified", "converted", "lost"];
const SOURCE_OPTIONS = ["website", "referral", "campaign", "other"];

type LeadForm = {
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: string;
  productId: string;
  value: string;
  notes: string;
};

const EMPTY_FORM: LeadForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "website",
  status: "new",
  productId: "",
  value: "",
  notes: "",
};

export function LeadsView({ refreshSignal = 0 }: { refreshSignal?: number } = {}) {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [form, setForm] = useState<LeadForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/leads", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setLeads(data.leads || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [refreshSignal]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!q) return true;
      return [l.name, l.email, l.company, l.phone]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [leads, search, statusFilter]);

  const stats = useMemo(() => {
    const byStatus = (s: string) => leads.filter((l) => l.status === s).length;
    return {
      total: leads.length,
      new: byStatus("new"),
      contacted: byStatus("contacted"),
      qualified: byStatus("qualified"),
      converted: byStatus("converted"),
    };
  }, [leads]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setEditing(lead);
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company || "",
      source: lead.source,
      status: lead.status,
      productId: lead.productId || "",
      value: lead.value || "",
      notes: lead.notes || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!form.name.trim() || !form.email.trim()) {
      toast({
        title: "Champs manquants",
        description: "Le nom et l'email sont obligatoires.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      company: form.company.trim() || null,
      source: form.source,
      status: form.status,
      productId: form.productId || null,
      value: form.value.trim() || null,
      notes: form.notes.trim() || null,
    };
    try {
      if (editing) {
        const res = await fetch(`/api/leads/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
        setLeads((prev) =>
          prev.map((l) => (l.id === editing.id ? data.lead : l))
        );
        toast({ title: "Lead mis à jour", description: form.name });
      } else {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
        setLeads((prev) => [data.lead, ...prev]);
        toast({ title: "Lead créé", description: form.name });
      }
      setDialogOpen(false);
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Échec de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || deleting) return;
    setDeleting(true);
    // Optimistic
    const prev = leads;
    setLeads((cur) => cur.filter((l) => l.id !== deleteId));
    try {
      const res = await fetch(`/api/leads/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Échec de la suppression");
      }
      toast({ title: "Lead supprimé" });
      setDeleteId(null);
    } catch (err) {
      setLeads(prev);
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Échec de la suppression",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <ViewHeader
        title="Leads"
        subtitle="Gérez vos prospects"
        actions={
          <Button onClick={openAdd} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Ajouter un lead</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MiniStatCard icon={Target} label="Total" value={stats.total} delay={0} />
        <MiniStatCard icon={Inbox} label="Nouveaux" value={stats.new} color="bg-blue-500/10 text-blue-600" delay={0.05} />
        <MiniStatCard icon={Contact} label="Contactés" value={stats.contacted} color="bg-amber-500/10 text-amber-600" delay={0.1} />
        <MiniStatCard icon={UserCheck} label="Qualifiés" value={stats.qualified} color="bg-violet-500/10 text-violet-600" delay={0.15} />
        <MiniStatCard icon={CheckCircle2} label="Convertis" value={stats.converted} color="bg-emerald-500/10 text-emerald-600" delay={0.2} />
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border p-3 flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email, société…"
            className="pl-9"
          />
        </div>
        <NativeSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="all">Tous les statuts</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
            </option>
          ))}
        </NativeSelect>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState onRetry={fetchLeads} />
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border">
          <EmptyState
            icon={Target}
            title={leads.length === 0 ? "Aucun lead pour le moment" : "Aucun lead trouvé"}
            description={
              leads.length === 0
                ? "Ajoutez votre premier prospect pour commencer."
                : "Essayez une autre recherche ou filtre."
            }
            action={
              leads.length === 0 ? (
                <Button onClick={openAdd} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Ajouter un lead
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-5 py-3 font-medium">Nom</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Société</th>
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">Source</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium hidden xl:table-cell">Produit</th>
                  <th className="px-5 py-3 font-medium whitespace-nowrap">Date</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => {
                  const product = lead.productId
                    ? getProductById(lead.productId)
                    : undefined;
                  return (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
                      className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-foreground truncate">{lead.name}</div>
                        <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </div>
                        {lead.phone && (
                          <div className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        {lead.company ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5" />
                            {lead.company}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <Pill
                          label={LEAD_SOURCE_LABELS[lead.source] || lead.source}
                          colorClass={LEAD_SOURCE_COLORS[lead.source] || LEAD_SOURCE_COLORS.other}
                        />
                      </td>
                      <td className="px-5 py-3.5">
                        <Pill
                          label={LEAD_STATUS_LABELS[lead.status] || lead.status}
                          colorClass={LEAD_STATUS_COLORS[lead.status] || LEAD_STATUS_COLORS.new}
                        />
                      </td>
                      <td className="px-5 py-3.5 hidden xl:table-cell">
                        {product ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-foreground/80">
                            <product.icon className="h-3.5 w-3.5" style={{ color: product.accentHex }} />
                            {product.name}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="text-xs text-foreground/80 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(lead.createdAt)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => openEdit(lead)}
                            aria-label="Modifier"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                            onClick={() => setDeleteId(lead.id)}
                            aria-label="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => !saving && setDialogOpen(o)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Modifier le lead" : "Ajouter un lead"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="lead-name">Nom *</Label>
                <Input
                  id="lead-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-email">Email *</Label>
                <Input
                  id="lead-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-phone">Téléphone</Label>
                <Input
                  id="lead-phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-company">Société</Label>
                <Input
                  id="lead-company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-source">Source</Label>
                <NativeSelect
                  id="lead-source"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="w-full"
                >
                  {SOURCE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {LEAD_SOURCE_LABELS[s]}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-status">Statut</Label>
                <NativeSelect
                  id="lead-status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {LEAD_STATUS_LABELS[s]}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-product">Produit</Label>
                <NativeSelect
                  id="lead-product"
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className="w-full"
                >
                  <option value="">— Aucun —</option>
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-value">Valeur</Label>
                <Input
                  id="lead-value"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder="ex. 1500 €"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-notes">Notes</Label>
              <Textarea
                id="lead-notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => !saving && setDialogOpen(false)}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                {editing ? "Enregistrer" : "Créer le lead"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !deleting && !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce lead ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le lead sera définitivement supprimé.
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
