"use client";

import { useState, useMemo, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  Mail,
  Phone,
  Building2,
  Calendar,
  Loader2,
  User,
  Handshake,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  CLIENT_TYPE_LABELS,
  CLIENT_TYPE_COLORS,
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_COLORS,
} from "./_shared";

type Client = {
  id: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  type: string;
  status: string;
  address?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

const TYPE_OPTIONS = ["prospect", "client", "partner"];
const STATUS_OPTIONS = ["active", "inactive", "archived"];

type ClientForm = {
  name: string;
  email: string;
  company: string;
  phone: string;
  type: string;
  status: string;
  address: string;
  notes: string;
};

const EMPTY_FORM: ClientForm = {
  name: "",
  email: "",
  company: "",
  phone: "",
  type: "prospect",
  status: "active",
  address: "",
  notes: "",
};

export function ClientsView({ refreshSignal = 0 }: { refreshSignal?: number } = {}) {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState<ClientForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/clients", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setClients(data.clients || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [refreshSignal]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return clients.filter((c) => {
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!q) return true;
      return [c.name, c.email, c.company, c.phone]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [clients, search, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    const byType = (t: string) => clients.filter((c) => c.type === t).length;
    return {
      total: clients.length,
      prospects: byType("prospect"),
      clients: byType("client"),
      partners: byType("partner"),
    };
  }, [clients]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditing(client);
    setForm({
      name: client.name,
      email: client.email,
      company: client.company || "",
      phone: client.phone || "",
      type: client.type,
      status: client.status,
      address: client.address || "",
      notes: client.notes || "",
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
      company: form.company.trim() || null,
      phone: form.phone.trim() || null,
      type: form.type,
      status: form.status,
      address: form.address.trim() || null,
      notes: form.notes.trim() || null,
    };
    try {
      if (editing) {
        const res = await fetch(`/api/clients/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
        setClients((prev) =>
          prev.map((c) => (c.id === editing.id ? data.client : c))
        );
        toast({ title: "Client mis à jour", description: form.name });
      } else {
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
        setClients((prev) => [data.client, ...prev]);
        toast({ title: "Client créé", description: form.name });
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
    const prev = clients;
    setClients((cur) => cur.filter((c) => c.id !== deleteId));
    try {
      const res = await fetch(`/api/clients/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Échec de la suppression");
      }
      toast({ title: "Client supprimé" });
      setDeleteId(null);
    } catch (err) {
      setClients(prev);
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
        title="Clients"
        subtitle="Gérez vos clients et prospects"
        actions={
          <Button onClick={openAdd} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Ajouter un client</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MiniStatCard icon={Users} label="Total" value={stats.total} delay={0} />
        <MiniStatCard icon={User} label="Prospects" value={stats.prospects} color="bg-blue-500/10 text-blue-600" delay={0.05} />
        <MiniStatCard icon={UserCheck} label="Clients" value={stats.clients} color="bg-emerald-500/10 text-emerald-600" delay={0.1} />
        <MiniStatCard icon={Handshake} label="Partenaires" value={stats.partners} color="bg-violet-500/10 text-violet-600" delay={0.15} />
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
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full sm:w-40"
        >
          <option value="all">Tous les types</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {CLIENT_TYPE_LABELS[t]}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-40"
        >
          <option value="all">Tous les statuts</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {CLIENT_STATUS_LABELS[s]}
            </option>
          ))}
        </NativeSelect>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState onRetry={fetchClients} />
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border">
          <EmptyState
            icon={Users}
            title={clients.length === 0 ? "Aucun client pour le moment" : "Aucun client trouvé"}
            description={
              clients.length === 0
                ? "Ajoutez votre premier client ou prospect pour commencer."
                : "Essayez une autre recherche ou filtre."
            }
            action={
              clients.length === 0 ? (
                <Button onClick={openAdd} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Ajouter un client
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
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">Contact</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium whitespace-nowrap">Date</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
                    className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent font-medium text-xs shrink-0">
                          {c.name
                            .split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="font-medium text-foreground truncate">
                          {c.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {c.company ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Building2 className="h-3.5 w-3.5" />
                          {c.company}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {c.email}
                      </div>
                      {c.phone && (
                        <div className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" />
                          {c.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill
                        label={CLIENT_TYPE_LABELS[c.type] || c.type}
                        colorClass={CLIENT_TYPE_COLORS[c.type] || CLIENT_TYPE_COLORS.prospect}
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill
                        label={CLIENT_STATUS_LABELS[c.status] || c.status}
                        colorClass={CLIENT_STATUS_COLORS[c.status] || CLIENT_STATUS_COLORS.active}
                      />
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="text-xs text-foreground/80 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(c.createdAt)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => openEdit(c)}
                          aria-label="Modifier"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                          onClick={() => setDeleteId(c.id)}
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
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
              {editing ? "Modifier le client" : "Ajouter un client"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="client-name">Nom *</Label>
                <Input
                  id="client-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="client-email">Email *</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="client-company">Société</Label>
                <Input
                  id="client-company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="client-phone">Téléphone</Label>
                <Input
                  id="client-phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="client-type">Type</Label>
                <NativeSelect
                  id="client-type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {CLIENT_TYPE_LABELS[t]}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="client-status">Statut</Label>
                <NativeSelect
                  id="client-status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {CLIENT_STATUS_LABELS[s]}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-address">Adresse</Label>
              <Input
                id="client-address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-notes">Notes</Label>
              <Textarea
                id="client-notes"
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
                {editing ? "Enregistrer" : "Créer le client"}
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
            <AlertDialogTitle>Supprimer ce client ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le client sera définitivement supprimé.
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
