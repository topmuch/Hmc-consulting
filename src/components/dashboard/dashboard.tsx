"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  LayoutDashboard,
  RefreshCw,
  Mail,
  Phone,
  User,
  Settings2,
  Bell,
  Download,
  FileText,
  LogOut,
  Loader2,
} from "lucide-react";
import { COMPANY } from "@/lib/site-data";
import type { ContactMessage, DashboardData } from "@/lib/dashboard-types";
import type { NotificationItem } from "@/lib/settings-types";
import { StatsCards } from "./stats-cards";
import { MessagesAreaChart, SubjectPieChart, DowBarChart } from "./charts";
import { MessagesTable } from "./messages-table";
import { FunnelChart } from "./funnel-chart";
import { ProductStats } from "./product-stats";
import { LoginView } from "./login-view";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type AuthState = "checking" | "authenticated" | "unauthenticated";

function useAuth() {
  const [state, setState] = useState<AuthState>("checking");

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setState(data?.authenticated ? "authenticated" : "unauthenticated");
    } catch {
      setState("unauthenticated");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) {
          setState(data?.authenticated ? "authenticated" : "unauthenticated");
        }
      } catch {
        if (!cancelled) setState("unauthenticated");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { state, reload };
}

export function Dashboard({ onGoSettings }: { onGoSettings?: () => void }) {
  const { state: authState, reload: reloadAuth } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      if (res.status === 401) {
        // Session expired
        reloadAuth();
        return;
      }
      const json = await res.json();
      setData(json as DashboardData);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [reloadAuth]);

  const fetchNotifs = async () => {
    try {
      const res = await fetch("/api/notifications?limit=10", { cache: "no-store" });
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // ignore
    }
  };

  const markAllRead = async () => {
    if (unreadCount === 0) return;
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    await fetchNotifs();
  };

  useEffect(() => {
    if (authState !== "authenticated") return;
    fetchData();
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [authState, fetchData]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    reloadAuth();
  };

  const handleExportCsv = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const res = await fetch("/api/messages/export", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Échec de l'export");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hmc-messages.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Export CSV prêt",
        description: "Le fichier a été téléchargé.",
      });
    } catch (err) {
      console.error("[export]", err);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleMonthlyReport = () => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    window.open(`/api/messages/report?month=${month}`, "_blank");
  };

  const handleLocalUpdate = (updated: ContactMessage) => {
    setData((prev) => {
      if (!prev) return prev;
      const messages = prev.messages.map((m) => (m.id === updated.id ? updated : m));
      return { ...prev, messages };
    });
  };

  // ---- Auth gate ----
  if (authState === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-7 w-7 animate-spin text-accent" />
          <p className="text-sm">Vérification de la session…</p>
        </div>
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return <LoginView onSuccess={reloadAuth} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/hmc-logo.png"
              alt={`${COMPANY.name} — ${COMPANY.fullName}`}
              className="h-12 w-auto"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-serif text-base font-semibold text-foreground flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-accent" />
                Tableau de bord
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {COMPANY.fullName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Notifications bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <DropdownMenuLabel className="p-0 text-sm">
                    Notifications
                  </DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-accent hover:underline"
                    >
                      Tout marquer lu
                    </button>
                  )}
                </div>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="py-6 text-center">
                    <Bell className="h-6 w-6 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-xs text-muted-foreground">Aucune notification</p>
                  </div>
                ) : (
                  notifications.slice(0, 6).map((n) => (
                    <DropdownMenuItem
                      key={n.id}
                      className="flex items-start gap-2.5 py-2.5 cursor-pointer"
                    >
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 rounded-full shrink-0",
                          n.read ? "bg-muted-foreground/30" : "bg-accent"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground truncate">
                          {n.title}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {n.message}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
                {onGoSettings && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={onGoSettings}
                      className="text-accent cursor-pointer"
                    >
                      <Settings2 className="h-4 w-4 mr-2" />
                      Gérer les notifications
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="text-muted-foreground"
            >
              <RefreshCw className={`h-4 w-4 sm:mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportCsv}
              disabled={exporting}
              className="text-muted-foreground hover:text-accent"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 sm:mr-1.5 animate-spin" />
              ) : (
                <Download className="h-4 w-4 sm:mr-1.5" />
              )}
              <span className="hidden sm:inline">Exporter CSV</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleMonthlyReport}
              className="text-muted-foreground hover:text-accent"
            >
              <FileText className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Rapport</span>
            </Button>

            {onGoSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onGoSettings}
                className="text-muted-foreground hover:text-accent"
              >
                <Settings2 className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Paramètres</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-red-600"
            >
              <LogOut className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>

            <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Site</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-2"
        >
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
              Vue d&apos;ensemble des demandes
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Suivi en temps réel des messages reçus via le formulaire de contact.
            </p>
          </div>
          {data && data.messages.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Dernière mise à jour :{" "}
              {new Date().toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </motion.div>

        {loading ? (
          <DashboardSkeleton />
        ) : data ? (
          <>
            {/* Stats */}
            <StatsCards
              total={data.stats.total}
              thisMonth={data.stats.thisMonth}
              thisWeek={data.stats.thisWeek}
              today={data.stats.today}
              monthGrowth={data.stats.monthGrowth}
            />

            {/* Charts row 1: Area (2/3) + Pie by subject (1/3) */}
            <div className="grid lg:grid-cols-3 gap-4">
              <MessagesAreaChart data={data.byDay} />
              <SubjectPieChart data={data.bySubject} />
            </div>

            {/* Charts row 2: Funnel + Product stats + Dow bar */}
            <div className="grid lg:grid-cols-3 gap-4">
              <FunnelChart data={data.byStage} />
              <ProductStats data={data.byProduct} />
              <DowBarChart data={data.byDow} />
            </div>

            {/* Latest contact highlight */}
            {data.messages[0] && (
              <div className="bg-card rounded-2xl border border-border p-5 sm:p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Dernier message reçu
                </h3>
                <LatestMessageCard message={data.messages[0]} />
              </div>
            )}

            {/* Messages table */}
            <MessagesTable
              messages={data.messages}
              onMessageUpdated={handleLocalUpdate}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-muted-foreground">
              Impossible de charger les données.{" "}
              <button
                onClick={() => fetchData()}
                className="text-accent underline underline-offset-2"
              >
                Réessayer
              </button>
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {COMPANY.fullName} — Tableau de bord interne
        </div>
      </footer>
    </div>
  );
}

function LatestMessageCard({ message }: { message: ContactMessage }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent font-medium shrink-0">
          {message.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="font-medium text-foreground truncate">{message.name}</div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {new Date(message.createdAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
          <div className="text-sm text-accent font-medium truncate">{message.subject}</div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {message.message}
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border">
        {message.company && (
          <span className="inline-flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {message.company}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Mail className="h-3.5 w-3.5" />
          {message.email}
        </span>
        {message.phone && (
          <span className="inline-flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            {message.phone}
          </span>
        )}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Skeleton className="lg:col-span-2 h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}
