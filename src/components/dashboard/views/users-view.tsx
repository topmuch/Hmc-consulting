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
  Calendar,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  ShieldUser,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  USER_ROLE_LABELS,
  USER_ROLE_COLORS,
} from "./_shared";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

const ROLE_OPTIONS = ["admin", "manager", "agent"];

type UserForm = {
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
};

const EMPTY_FORM: UserForm = {
  name: "",
  email: "",
  password: "",
  role: "agent",
  active: true,
};

export function UsersView({ refreshSignal = 0 }: { refreshSignal?: number } = {}) {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshSignal]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter((u) =>
      [u.name, u.email, u.role].some((v) => v?.toLowerCase().includes(q))
    );
  }, [users, search]);

  const stats = useMemo(() => {
    const admins = users.filter((u) => u.role === "admin").length;
    const active = users.filter((u) => u.active).length;
    return { total: users.length, admins, active };
  }, [users]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      active: user.active,
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
    if (!editing && !form.password.trim()) {
      toast({
        title: "Mot de passe requis",
        description: "Le mot de passe est obligatoire pour un nouvel utilisateur.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      active: form.active,
    };
    if (form.password.trim()) {
      payload.password = form.password.trim();
    }
    try {
      if (editing) {
        const res = await fetch(`/api/users/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
        setUsers((prev) =>
          prev.map((u) => (u.id === editing.id ? data.user : u))
        );
        toast({ title: "Utilisateur mis à jour", description: form.name });
      } else {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
        setUsers((prev) => [data.user, ...prev]);
        toast({ title: "Utilisateur créé", description: form.name });
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
    const prev = users;
    setUsers((cur) => cur.filter((u) => u.id !== deleteId));
    try {
      const res = await fetch(`/api/users/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Échec de la suppression");
      }
      toast({ title: "Utilisateur supprimé" });
      setDeleteId(null);
    } catch (err) {
      setUsers(prev);
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Échec de la suppression",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const roleIcon = (role: string) => {
    if (role === "admin") return ShieldAlert;
    if (role === "manager") return UserCog;
    return ShieldUser;
  };

  return (
    <>
      <ViewHeader
        title="Utilisateurs"
        subtitle="Gérez les accès au dashboard"
        actions={
          <Button onClick={openAdd} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Ajouter un utilisateur</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        }
      />

      {/* Warning banner */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-xl border border-amber-200/60 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center gap-2.5"
      >
        <ShieldAlert className="h-4 w-4 shrink-0" />
        <span>
          Seuls les administrateurs peuvent gérer les utilisateurs.
        </span>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MiniStatCard icon={Users} label="Total" value={stats.total} delay={0} />
        <MiniStatCard icon={ShieldCheck} label="Actifs" value={stats.active} color="bg-emerald-500/10 text-emerald-600" delay={0.05} />
        <MiniStatCard icon={ShieldAlert} label="Administrateurs" value={stats.admins} color="bg-red-500/10 text-red-600" delay={0.1} />
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border p-3 flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email, rôle…"
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState onRetry={fetchUsers} />
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border">
          <EmptyState
            icon={Users}
            title={users.length === 0 ? "Aucun utilisateur" : "Aucun utilisateur trouvé"}
            description={
              users.length === 0
                ? "Ajoutez votre premier utilisateur pour commencer."
                : "Essayez une autre recherche."
            }
            action={
              users.length === 0 ? (
                <Button onClick={openAdd} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Ajouter un utilisateur
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
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Email</th>
                  <th className="px-5 py-3 font-medium">Rôle</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium whitespace-nowrap">Date</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => {
                  const RoleIcon = roleIcon(u.role);
                  return (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
                      className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent font-medium text-xs shrink-0">
                            {u.name
                              .split(" ")
                              .map((w) => w[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div className="font-medium text-foreground truncate">
                            {u.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          {u.email}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${USER_ROLE_COLORS[u.role] || USER_ROLE_COLORS.agent}`}
                        >
                          <RoleIcon className="h-3 w-3" />
                          {USER_ROLE_LABELS[u.role] || u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {u.active ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                            Inactif
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="text-xs text-foreground/80 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(u.createdAt)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => openEdit(u)}
                            aria-label="Modifier"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                            onClick={() => setDeleteId(u.id)}
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="user-name">Nom *</Label>
              <Input
                id="user-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="user-email">Email *</Label>
              <Input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="user-password">
                Mot de passe {editing && <span className="text-muted-foreground font-normal">(laisser vide pour ne pas changer)</span>} *
              </Label>
              <Input
                id="user-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={editing ? "••••••••" : "Nouveau mot de passe"}
                required={!editing}
                autoComplete="new-password"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="user-role">Rôle</Label>
                <NativeSelect
                  id="user-role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {USER_ROLE_LABELS[r]}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label>Statut du compte</Label>
                <div className="flex items-center gap-2 h-9 rounded-md border border-input px-3">
                  <Switch
                    checked={form.active}
                    onCheckedChange={(checked) => setForm({ ...form, active: checked })}
                  />
                  <span className="text-sm text-foreground">
                    {form.active ? "Actif" : "Inactif"}
                  </span>
                </div>
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
                {editing ? "Enregistrer" : "Créer l'utilisateur"}
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
            <AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;utilisateur perdra l&apos;accès au dashboard.
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
