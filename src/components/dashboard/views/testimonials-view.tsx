"use client";

import { useState, useMemo, useEffect, FormEvent } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  MessageSquareQuote,
  CheckCircle2,
  CircleDot,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
  Pill,
  formatDate,
} from "./_shared";

/* ── Testimonial type ── */
type Testimonial = {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  image: string;
  project: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

/* ── Form state ── */
type TestimonialForm = {
  name: string;
  company: string;
  role: string;
  content: string;
  image: string;
  project: string;
  published: boolean;
};

const EMPTY_FORM: TestimonialForm = {
  name: "",
  company: "",
  role: "",
  content: "",
  image: "",
  project: "",
  published: true,
};

/* ── Status labels & colors ── */
const STATUS_LABELS: Record<string, string> = {
  published: "Publié",
  draft: "Brouillon",
};

const STATUS_COLORS: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  draft: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

export function TestimonialsView({ refreshSignal = 0 }: { refreshSignal?: number } = {}) {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<TestimonialForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/testimonials?all=true", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [refreshSignal]);

  const filtered = useMemo(() => {
    let result = testimonials;
    if (statusFilter === "published") result = result.filter((t) => t.published);
    if (statusFilter === "draft") result = result.filter((t) => !t.published);

    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.company.toLowerCase().includes(q) ||
          t.role.toLowerCase().includes(q) ||
          t.project.toLowerCase().includes(q)
      );
    }
    return result;
  }, [testimonials, search, statusFilter]);

  const stats = useMemo(() => {
    const published = testimonials.filter((t) => t.published).length;
    const drafts = testimonials.filter((t) => !t.published).length;
    return { total: testimonials.length, published, drafts };
  }, [testimonials]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      name: t.name,
      company: t.company,
      role: t.role,
      content: t.content,
      image: t.image,
      project: t.project,
      published: t.published,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!form.name.trim() || !form.company.trim() || !form.role.trim() || !form.content.trim()) {
      toast({
        title: "Champs manquants",
        description: "Les champs nom, entreprise, rôle et contenu sont obligatoires.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      company: form.company.trim(),
      role: form.role.trim(),
      content: form.content.trim(),
      image: form.image.trim(),
      project: form.project.trim(),
      published: form.published,
    };
    try {
      if (editing) {
        const res = await fetch(`/api/testimonials/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
        setTestimonials((prev) =>
          prev.map((t) => (t.id === editing.id ? { ...t, ...data.testimonial } : t))
        );
        toast({ title: "Témoignage mis à jour", description: form.name });
      } else {
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
        await fetchTestimonials();
        toast({ title: "Témoignage créé", description: form.name });
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
    const prev = testimonials;
    setTestimonials((cur) => cur.filter((t) => t.id !== deleteId));
    try {
      const res = await fetch(`/api/testimonials/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Échec de la suppression");
      }
      toast({ title: "Témoignage supprimé" });
      setDeleteId(null);
    } catch (err) {
      setTestimonials(prev);
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Échec de la suppression",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const togglePublish = async (t: Testimonial) => {
    const newPublished = !t.published;
    setTestimonials((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, published: newPublished } : x))
    );
    try {
      const res = await fetch(`/api/testimonials/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: newPublished }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
      toast({
        title: newPublished ? "Témoignage publié" : "Témoignage dépublié",
        description: t.name,
      });
    } catch (err) {
      setTestimonials((prev) =>
        prev.map((x) => (x.id === t.id ? { ...x, published: t.published } : x))
      );
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Échec de la mise à jour",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <ViewHeader
        title="Témoignages"
        subtitle="Gérez les témoignages et études de cas"
        actions={
          <Button onClick={openAdd} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Nouveau témoignage</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MiniStatCard icon={MessageSquareQuote} label="Total" value={stats.total} delay={0} />
        <MiniStatCard
          icon={CheckCircle2}
          label="Publiés"
          value={stats.published}
          color="bg-emerald-500/10 text-emerald-600"
          delay={0.05}
        />
        <MiniStatCard
          icon={CircleDot}
          label="Brouillons"
          value={stats.drafts}
          color="bg-amber-500/10 text-amber-600"
          delay={0.1}
        />
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border p-3 flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, entreprise, rôle…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setStatusFilter("published")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === "published"
                ? "bg-emerald-500 text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Publiés
          </button>
          <button
            onClick={() => setStatusFilter("draft")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === "draft"
                ? "bg-amber-500 text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Brouillons
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState onRetry={fetchTestimonials} />
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border">
          <EmptyState
            icon={MessageSquareQuote}
            title={testimonials.length === 0 ? "Aucun témoignage" : "Aucun témoignage trouvé"}
            description={
              testimonials.length === 0
                ? "Créez votre premier témoignage pour commencer."
                : "Essayez une autre recherche ou filtre."
            }
            action={
              testimonials.length === 0 ? (
                <Button onClick={openAdd} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Nouveau témoignage
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
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Entreprise</th>
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">Projet</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium whitespace-nowrap hidden sm:table-cell">Date</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
                          <MessageSquareQuote className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground truncate max-w-[200px]">
                            {t.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {t.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">{t.company}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground truncate max-w-[200px] block">
                        {t.project}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill
                        label={t.published ? STATUS_LABELS.published : STATUS_LABELS.draft}
                        colorClass={t.published ? STATUS_COLORS.published : STATUS_COLORS.draft}
                      />
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-xs text-foreground/80 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(t.createdAt)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => togglePublish(t)}
                          aria-label={t.published ? "Dépublier" : "Publier"}
                          title={t.published ? "Dépublier" : "Publier"}
                        >
                          {t.published ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => openEdit(t)}
                          aria-label="Modifier"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                          onClick={() => setDeleteId(t.id)}
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
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
              {editing ? "Modifier le témoignage" : "Nouveau témoignage"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="t-name">Nom *</Label>
                <Input
                  id="t-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Nom du client"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-company">Entreprise *</Label>
                <Input
                  id="t-company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  required
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-role">Rôle *</Label>
                <Input
                  id="t-role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                  placeholder="Fonction du client"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-project">Type de projet</Label>
                <Input
                  id="t-project"
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  placeholder="Ex: Audit organisationnel"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-content">Témoignage *</Label>
              <Textarea
                id="t-content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
                placeholder="Contenu du témoignage…"
                className="min-h-[120px] resize-y"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-image">URL de la photo</Label>
              <Input
                id="t-image"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Statut de publication</Label>
              <div className="flex items-center gap-2 h-9 rounded-md border border-input px-3">
                <Switch
                  checked={form.published}
                  onCheckedChange={(checked) => setForm({ ...form, published: checked })}
                />
                <span className="text-sm text-foreground">
                  {form.published ? "Publié" : "Brouillon"}
                </span>
              </div>
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
                {editing ? "Enregistrer" : "Créer le témoignage"}
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
            <AlertDialogTitle>Supprimer ce témoignage ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le témoignage sera définitivement supprimé.
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
