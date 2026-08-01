"use client";

import { useState, useMemo, useEffect, useRef, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  Phone,
  Building2,
  Calendar,
  Eye,
  Inbox,
  Send,
  Loader2,
  X,
  Plus,
  Tag as TagIcon,
  StickyNote,
  CheckCircle2,
  Filter,
} from "lucide-react";
import type { ContactMessage } from "@/lib/dashboard-types";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  STAGE_LABELS,
} from "@/lib/settings-types";
import { getProductById } from "@/lib/products-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const STATUS_OPTIONS = ["new", "in_progress", "treated", "archived"] as const;
const STAGE_OPTIONS = ["received", "qualified", "meeting", "client"] as const;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)} sem.`;
  return `Il y a ${Math.floor(days / 30)} mois`;
}

function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLORS[status] || STATUS_COLORS.new;
  const label = STATUS_LABELS[status] || status;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

export function MessagesTable({
  messages,
  onMessageUpdated,
}: {
  messages: ContactMessage[];
  onMessageUpdated?: (updated: ContactMessage) => void;
}) {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return messages.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (!q) return true;
      return [m.name, m.email, m.company, m.subject, m.message]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [messages, query, statusFilter]);

  const updateMessage = (id: string, patch: Partial<ContactMessage>) => {
    onMessageUpdated?.({ ...(messages.find((m) => m.id === id) as ContactMessage), ...patch, updatedAt: new Date().toISOString() } as ContactMessage);
  };

  const patchMessage = async (
    id: string,
    body: Record<string, unknown>,
    opts?: { silent?: boolean }
  ) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Échec de la mise à jour");
      }
      if (!opts?.silent) {
        toast({
          title: "Mis à jour",
          description: "Les modifications ont été enregistrées.",
        });
      }
      return data.message as ContactMessage;
    } catch (err) {
      console.error("[patchMessage]", err);
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Échec de la mise à jour",
        variant: "destructive",
      });
      throw err;
    }
  };

  const handleStatusChange = async (
    message: ContactMessage,
    newStatus: string
  ) => {
    // Optimistic local update
    updateMessage(message.id, { status: newStatus });
    if (selected?.id === message.id) {
      setSelected({ ...selected, status: newStatus });
    }
    try {
      const updated = await patchMessage(message.id, { status: newStatus });
      onMessageUpdated?.(updated);
    } catch {
      // Revert optimistic update on failure
      updateMessage(message.id, { status: message.status });
      if (selected?.id === message.id) {
        setSelected({ ...selected, status: message.status });
      }
    }
  };

  const handleStageChange = async (
    message: ContactMessage,
    newStage: string
  ) => {
    updateMessage(message.id, { stage: newStage });
    if (selected?.id === message.id) {
      setSelected({ ...selected, stage: newStage });
    }
    try {
      const updated = await patchMessage(message.id, { stage: newStage });
      onMessageUpdated?.(updated);
    } catch {
      updateMessage(message.id, { stage: message.stage });
      if (selected?.id === message.id) {
        setSelected({ ...selected, stage: message.stage });
      }
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full shrink-0 bg-gradient-to-b from-indigo-500 to-blue-500" />
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Demandes récentes
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filtered.length} message{filtered.length > 1 ? "s" : ""}{" "}
              {(query || statusFilter !== "all") && `(sur ${messages.length})`}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative w-full sm:w-56">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="pl-8 w-full sm:w-56 h-9" size="sm">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher (nom, société, sujet…)"
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Inbox className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">Aucun message trouvé</p>
          <p className="text-xs text-muted-foreground">
            {query || statusFilter !== "all"
              ? "Essayez une autre recherche ou filtre."
              : "Les demandes apparaîtront ici."}
          </p>
        </div>
      ) : (
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium hidden md:table-cell">Sujet</th>
                <th className="px-5 py-3 font-medium hidden lg:table-cell">Société</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium whitespace-nowrap">Date</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <motion.tr
                  key={m.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.4) }}
                  className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors cursor-pointer"
                  onClick={() => setSelected(m)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent font-medium text-xs shrink-0">
                        {m.name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate">{m.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-foreground/80 line-clamp-1">{m.subject}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    {m.company ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        {m.company}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
                          <StatusBadge status={m.status} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44">
                        <DropdownMenuLabel className="text-xs">
                          Changer le statut
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {STATUS_OPTIONS.map((s) => (
                          <DropdownMenuItem
                            key={s}
                            onClick={() => handleStatusChange(m, s)}
                            className="gap-2 cursor-pointer"
                          >
                            <span
                              className={`inline-flex h-2 w-2 rounded-full ${STATUS_COLORS[s]?.split(" ")[0] || "bg-muted"}`}
                            />
                            {STATUS_LABELS[s]}
                            {m.status === s && (
                              <CheckCircle2 className="h-3.5 w-3.5 ml-auto text-accent" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="text-xs text-foreground/80">{formatDate(m.createdAt)}</div>
                    <div className="text-xs text-muted-foreground">{timeAgo(m.createdAt)}</div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(m);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <MessageDetailDialog
        message={selected}
        onClose={() => setSelected(null)}
        onPatch={patchMessage}
        onLocalUpdate={(updated) => {
          onMessageUpdated?.(updated);
          setSelected(updated);
        }}
        onStageChange={handleStageChange}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

function MessageDetailDialog({
  message,
  onClose,
  onPatch,
  onLocalUpdate,
  onStageChange,
  onStatusChange,
}: {
  message: ContactMessage | null;
  onClose: () => void;
  onPatch: (id: string, body: Record<string, unknown>, opts?: { silent?: boolean }) => Promise<ContactMessage>;
  onLocalUpdate: (updated: ContactMessage) => void;
  onStageChange: (m: ContactMessage, stage: string) => Promise<void>;
  onStatusChange: (m: ContactMessage, status: string) => Promise<void>;
}) {
  // Local editing state — re-synced when `message` changes
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [notes, setNotes] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [savingTags, setSavingTags] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (message) {
      setTags(parseTags(message.tags));
      setNewTag("");
      setNotes(message.notes || "");
      setReplyBody("");
    }
  }, [message?.id]);

  if (!message) return null;

  const product = message.productId ? getProductById(message.productId) : undefined;

  const handleAddTag = async () => {
    const t = newTag.trim();
    if (!t || tags.includes(t)) {
      setNewTag("");
      return;
    }
    const next = [...tags, t];
    setTags(next);
    setNewTag("");
    setSavingTags(true);
    try {
      const updated = await onPatch(message.id, { tags: next.join(",") }, { silent: true });
      onLocalUpdate(updated);
    } catch {
      // revert
      setTags(tags);
    } finally {
      setSavingTags(false);
    }
  };

  const handleRemoveTag = async (tag: string) => {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    setSavingTags(true);
    try {
      const updated = await onPatch(message.id, { tags: next.join(",") }, { silent: true });
      onLocalUpdate(updated);
    } catch {
      setTags(tags);
    } finally {
      setSavingTags(false);
    }
  };

  const handleNotesBlur = async () => {
    if (notes === (message.notes || "")) return;
    setSavingNotes(true);
    try {
      const updated = await onPatch(message.id, { notes }, { silent: true });
      onLocalUpdate(updated);
    } catch {
      setNotes(message.notes || "");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSendReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim() || sendingReply) return;
    setSendingReply(true);
    try {
      const res = await fetch(`/api/messages/${message.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Échec de l'envoi");
      }
      toast({
        title: "Réponse envoyée",
        description: `Un email a été envoyé à ${message.email}.`,
      });
      setReplyBody("");
    } catch (err) {
      console.error("[reply]", err);
      toast({
        title: "Erreur",
        description:
          err instanceof Error ? err.message : "Impossible d'envoyer la réponse.",
        variant: "destructive",
      });
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <Dialog open={!!message} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent font-medium text-xs">
              {message.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
            <span>{message.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Badges & metadata */}
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="secondary" className="font-normal">
              {message.subject}
            </Badge>
            <Badge variant="outline" className="font-normal">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDateTime(message.createdAt)}
            </Badge>
            {product && (
              <Badge variant="outline" className="font-normal">
                <product.icon className="h-3 w-3 mr-1" />
                {product.name}
              </Badge>
            )}
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={message.email} />
            {message.phone && (
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="Téléphone"
                value={message.phone}
              />
            )}
            {message.company && (
              <InfoRow
                icon={<Building2 className="h-4 w-4" />}
                label="Société"
                value={message.company}
              />
            )}
          </div>

          {/* Message */}
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Message
            </div>
            <div className="rounded-xl bg-secondary/50 p-4 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {message.message}
            </div>
          </div>

          {/* Status & Stage selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Statut
              </Label>
              <Select
                value={message.status}
                onValueChange={(v) => onStatusChange(message, v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Étape (tunnel)
              </Label>
              <Select
                value={message.stage}
                onValueChange={(v) => onStageChange(message, v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STAGE_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <TagIcon className="h-3.5 w-3.5" />
                Tags
                {savingTags && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
              </Label>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.length === 0 && (
                <span className="text-xs text-muted-foreground">Aucun tag</span>
              )}
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 pr-1.5 font-normal"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted-foreground/20 transition-colors"
                    aria-label={`Retirer ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Ajouter un tag (Entrée pour valider)"
                className="h-8 text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddTag}
                disabled={!newTag.trim() || savingTags}
                className="h-8"
              >
                <Plus className="h-3.5 w-3.5" />
                Ajouter
              </Button>
            </div>
          </div>

          {/* Internal notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label
                htmlFor="notes"
                className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <StickyNote className="h-3.5 w-3.5" />
                Notes internes
                {savingNotes && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
                {!savingNotes && notes !== (message.notes || "") && (
                  <span className="text-[10px] text-amber-600 ml-1">Non enregistré</span>
                )}
              </Label>
              <span className="text-[10px] text-muted-foreground">
                Sauvegarde auto. à la perte de focus
              </span>
            </div>
            <Textarea
              ref={notesRef}
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Ajoutez vos notes internes (visibles uniquement ici)…"
              className="text-sm min-h-24"
            />
          </div>

          {/* Reply section */}
          <div className="rounded-xl border border-border p-4 bg-secondary/20">
            <div className="flex items-center justify-between mb-2">
              <Label
                htmlFor="reply"
                className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                Répondre par email
              </Label>
              <span className="text-[10px] text-muted-foreground truncate max-w-[240px]">
                Re: {message.subject}
              </span>
            </div>
            <Textarea
              id="reply"
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder={`Bonjour ${message.name.split(" ")[0]},\n\nMerci pour votre message…`}
              className="text-sm min-h-28 bg-background"
            />
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <Button
                onClick={handleSendReply}
                disabled={!replyBody.trim() || sendingReply}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {sendingReply ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Envoyer la réponse
                  </>
                )}
              </Button>
              <Button asChild size="sm" variant="outline">
                <a
                  href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
                >
                  <Mail className="h-4 w-4" />
                  Ouvrir dans le client mail
                </a>
              </Button>
              {message.phone && (
                <Button asChild size="sm" variant="ghost">
                  <a href={`tel:${message.phone.replace(/\s/g, "")}`}>
                    <Phone className="h-4 w-4" />
                    Appeler
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm text-foreground truncate">{value}</div>
      </div>
    </div>
  );
}
