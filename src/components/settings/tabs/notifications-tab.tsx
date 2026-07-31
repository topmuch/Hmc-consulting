"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck, Mail, Clock, Calendar, Loader2, Trash2 } from "lucide-react";
import type { SiteSettings, NotificationItem } from "@/lib/settings-types";
import { Field, TextInput, TabHeader } from "./_fields";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  settings: SiteSettings;
  update: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `Il y a ${d} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export function NotificationsTab({ settings, update }: Props) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotif, setLoadingNotif] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifs = async () => {
    setLoadingNotif(true);
    try {
      const res = await fetch("/api/notifications?limit=20", { cache: "no-store" });
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // ignore
    } finally {
      setLoadingNotif(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      await fetchNotifs();
    } finally {
      setMarkingAll(false);
    }
  };

  const markOneRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchNotifs();
  };

  return (
    <div>
      <TabHeader
        title="Notifications"
        description="Préférences d'alertes et journal des notifications récentes."
      />

      <div className="space-y-6">
        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-accent" />
            Préférences
          </h3>

          <Field
            label="Email de notification"
            description="Adresse où recevoir les alertes (hors app, pour les synthèses)."
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <TextInput
                type="email"
                value={settings.notifyEmail || ""}
                onChange={(e) => update("notifyEmail", e.target.value)}
                placeholder={settings.email}
                className="pl-9"
              />
            </div>
          </Field>

          <ToggleRow
            icon={<Mail className="h-4 w-4" />}
            title="Nouveau message de contact"
            description="Créer une notification quand un visiteur envoie un message via le formulaire."
            checked={settings.notifyOnNewMessage}
            onCheckedChange={(v) => update("notifyOnNewMessage", v)}
          />

          <ToggleRow
            icon={<Clock className="h-4 w-4" />}
            title="Synthèse quotidienne"
            description="Recevoir un récapitulatif quotidien des nouvelles demandes."
            checked={settings.notifyDailyDigest}
            onCheckedChange={(v) => update("notifyDailyDigest", v)}
          />

          <ToggleRow
            icon={<Calendar className="h-4 w-4" />}
            title="Synthèse hebdomadaire"
            description="Recevoir un récapitulatif hebdomadaire de l'activité."
            checked={settings.notifyWeeklyDigest}
            onCheckedChange={(v) => update("notifyWeeklyDigest", v)}
          />
        </div>

        {/* Notification log */}
        <div className="border-t border-border pt-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Bell className="h-4 w-4 text-accent" />
              Journal des notifications
              {unreadCount > 0 && (
                <Badge className="bg-accent text-accent-foreground ml-1">
                  {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                </Badge>
              )}
            </h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                disabled={markingAll}
                className="h-7 text-xs"
              >
                {markingAll ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                ) : (
                  <CheckCheck className="h-3.5 w-3.5 mr-1" />
                )}
                Tout marquer lu
              </Button>
            )}
          </div>

          {loadingNotif ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">Aucune notification</p>
              <p className="text-xs text-muted-foreground">
                Les nouvelles demandes apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.read && markOneRead(n.id)}
                  className={cn(
                    "w-full text-left flex items-start gap-3 rounded-lg p-3 border transition-colors",
                    n.read
                      ? "bg-background border-border hover:bg-secondary/40"
                      : "bg-accent/[0.06] border-accent/30 hover:bg-accent/10"
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 rounded-full shrink-0",
                      n.read ? "bg-muted-foreground/30" : "bg-accent"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {n.title}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {n.message}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
          {icon}
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">{title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
