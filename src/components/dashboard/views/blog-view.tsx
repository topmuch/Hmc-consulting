"use client";

import { useState, useMemo, useEffect, FormEvent } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FileText,
  Calendar,
  Clock,
  Loader2,
  Eye,
  EyeOff,
  Newspaper,
  CheckCircle2,
  CircleDot,
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

/* ── Post type ── */
type Post = {
  id: string;
  title: string;
  content: string | null;
  published: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

/* ── Form state ── */
type PostForm = {
  title: string;
  content: string;
  published: boolean;
};

const EMPTY_FORM: PostForm = {
  title: "",
  content: "",
  published: false,
};

/* ── Status labels & colors ── */
const POST_STATUS_LABELS: Record<string, string> = {
  published: "Publié",
  draft: "Brouillon",
};

const POST_STATUS_COLORS: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  draft: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

/* ── Estimate read time ── */
function estimateReadTime(content: string | null): string {
  if (!content) return "—";
  const words = content.split(/\s+/).length;
  const minutes = Math.max(3, Math.ceil(words / 200));
  return `${minutes} min`;
}

export function BlogView({ refreshSignal = 0 }: { refreshSignal?: number } = {}) {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<PostForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/posts?all=true", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshSignal]);

  const filtered = useMemo(() => {
    let result = posts;
    if (statusFilter === "published") result = result.filter((p) => p.published);
    if (statusFilter === "draft") result = result.filter((p) => !p.published);

    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.content && p.content.toLowerCase().includes(q)) ||
          p.authorName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, search, statusFilter]);

  const stats = useMemo(() => {
    const published = posts.filter((p) => p.published).length;
    const drafts = posts.filter((p) => !p.published).length;
    return { total: posts.length, published, drafts };
  }, [posts]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditing(post);
    setForm({
      title: post.title,
      content: post.content || "",
      published: post.published,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!form.title.trim()) {
      toast({
        title: "Titre manquant",
        description: "Le titre est obligatoire.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      content: form.content.trim() || null,
      published: form.published,
    };
    try {
      if (editing) {
        const res = await fetch(`/api/posts/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
        setPosts((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...data.post } : p))
        );
        toast({ title: "Article mis à jour", description: form.title });
      } else {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
        // Re-fetch to get the authorName
        await fetchPosts();
        toast({ title: "Article créé", description: form.title });
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
    const prev = posts;
    setPosts((cur) => cur.filter((p) => p.id !== deleteId));
    try {
      const res = await fetch(`/api/posts/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Échec de la suppression");
      }
      toast({ title: "Article supprimé" });
      setDeleteId(null);
    } catch (err) {
      setPosts(prev);
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Échec de la suppression",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const togglePublish = async (post: Post) => {
    const newPublished = !post.published;
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, published: newPublished } : p))
    );
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: newPublished }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
      toast({
        title: newPublished ? "Article publié" : "Article dépublié",
        description: post.title,
      });
    } catch (err) {
      // Revert
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, published: post.published } : p))
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
        title="Blog"
        subtitle="Gérez vos articles et publications"
        actions={
          <Button onClick={openAdd} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Nouvel article</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MiniStatCard icon={Newspaper} label="Total" value={stats.total} delay={0} />
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
            placeholder="Rechercher par titre, contenu, auteur…"
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
        <ErrorState onRetry={fetchPosts} />
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border">
          <EmptyState
            icon={Newspaper}
            title={posts.length === 0 ? "Aucun article" : "Aucun article trouvé"}
            description={
              posts.length === 0
                ? "Créez votre premier article pour commencer."
                : "Essayez une autre recherche ou filtre."
            }
            action={
              posts.length === 0 ? (
                <Button onClick={openAdd} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Nouvel article
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
                  <th className="px-5 py-3 font-medium">Titre</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Auteur</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">Lecture</th>
                  <th className="px-5 py-3 font-medium whitespace-nowrap hidden lg:table-cell">Date</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground truncate max-w-[240px]">
                            {post.title}
                          </div>
                          {post.content && (
                            <div className="text-xs text-muted-foreground truncate max-w-[240px]">
                              {post.content.slice(0, 60)}
                              {post.content.length > 60 ? "…" : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">{post.authorName}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill
                        label={post.published ? POST_STATUS_LABELS.published : POST_STATUS_LABELS.draft}
                        colorClass={post.published ? POST_STATUS_COLORS.published : POST_STATUS_COLORS.draft}
                      />
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {estimateReadTime(post.content)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-xs text-foreground/80 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.createdAt)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => togglePublish(post)}
                          aria-label={post.published ? "Dépublier" : "Publier"}
                          title={post.published ? "Dépublier" : "Publier"}
                        >
                          {post.published ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => openEdit(post)}
                          aria-label="Modifier"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                          onClick={() => setDeleteId(post.id)}
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
              {editing ? "Modifier l'article" : "Nouvel article"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="post-title">Titre *</Label>
              <Input
                id="post-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                autoFocus
                placeholder="Titre de l'article"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="post-content">Contenu</Label>
              <Textarea
                id="post-content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Rédigez votre article ici…&#10;&#10;Conseil : utilisez des doubles sauts de ligne pour séparer les paragraphes.&#10;Préfixez avec ## pour les sous-titres."
                className="min-h-[240px] resize-y"
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
                {editing ? "Enregistrer" : "Créer l'article"}
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
            <AlertDialogTitle>Supprimer cet article ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;article sera définitivement supprimé.
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
