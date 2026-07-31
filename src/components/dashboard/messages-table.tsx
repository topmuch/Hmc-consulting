"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Mail, Phone, Building2, Calendar, Eye, Inbox } from "lucide-react";
import type { ContactMessage } from "@/lib/dashboard-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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

export function MessagesTable({ messages }: { messages: ContactMessage[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return messages;
    return messages.filter((m) =>
      [m.name, m.email, m.company, m.subject, m.message]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    );
  }, [messages, query]);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-border">
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Demandes récentes
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtered.length} message{filtered.length > 1 ? "s" : ""}{" "}
            {query && `(sur ${messages.length})`}
          </p>
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

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Inbox className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">Aucun message trouvé</p>
          <p className="text-xs text-muted-foreground">
            {query ? "Essayez une autre recherche." : "Les demandes apparaîtront ici."}
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

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent font-medium text-xs">
                {selected
                  ?.name.split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
              </span>
              <span>{selected?.name}</span>
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 mt-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-normal">
                  {selected.subject}
                </Badge>
                <Badge variant="outline" className="font-normal">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDateTime(selected.createdAt)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={selected.email} />
                {selected.phone && (
                  <InfoRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Téléphone"
                    value={selected.phone}
                  />
                )}
                {selected.company && (
                  <InfoRow
                    icon={<Building2 className="h-4 w-4" />}
                    label="Société"
                    value={selected.company}
                  />
                )}
              </div>

              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Message
                </div>
                <div className="rounded-xl bg-secondary/50 p-4 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button asChild size="sm" className="flex-1">
                  <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Répondre
                  </a>
                </Button>
                {selected.phone && (
                  <Button asChild size="sm" variant="outline">
                    <a href={`tel:${selected.phone.replace(/\s/g, "")}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
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
