"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  LayoutDashboard,
  RefreshCw,
  Settings2,
  Bell,
  Download,
  FileText,
  LogOut,
  Loader2,
  Inbox,
  Target,
  Users,
  User as UserIcon,
  BarChart3,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { COMPANY } from "@/lib/site-data";
import type { ContactMessage, DashboardData } from "@/lib/dashboard-types";
import type { NotificationItem } from "@/lib/settings-types";
import { LoginView } from "./login-view";
import { Button } from "@/components/ui/button";
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
import { OverviewView } from "./views/overview-view";
import { MessagesView } from "./views/messages-view";
import { LeadsView } from "./views/leads-view";
import { ClientsView } from "./views/clients-view";
import { UsersView } from "./views/users-view";
import { ReportsView } from "./views/reports-view";

type AuthState = "checking" | "authenticated" | "unauthenticated";

type ViewId =
  | "overview"
  | "messages"
  | "leads"
  | "clients"
  | "users"
  | "reports";

const NAV_TABS: { id: ViewId; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "messages", label: "Messages", icon: Inbox },
  { id: "leads", label: "Leads", icon: Target },
  { id: "clients", label: "Clients", icon: Users },
  { id: "users", label: "Utilisateurs", icon: UserIcon },
  { id: "reports", label: "Rapports", icon: BarChart3 },
];

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
  const [activeView, setActiveView] = useState<ViewId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(
    async (silent = false) => {
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
    },
    [reloadAuth]
  );

  const fetchNotifs = async () => {
    try {
      const res = await fetch("/api/notifications?limit=10", {
        cache: "no-store",
      });
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

  const handleRefresh = () => {
    setRefreshSignal((n) => n + 1);
    fetchData(true);
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
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    window.open(`/api/messages/report?month=${month}`, "_blank");
  };

  const handleLocalUpdate = (updated: ContactMessage) => {
    setData((prev) => {
      if (!prev) return prev;
      const messages = prev.messages.map((m) =>
        m.id === updated.id ? updated : m
      );
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
    <div className="min-h-screen flex bg-background">
      {/* Sidebar — blue background, white text */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-navy text-white flex flex-col shrink-0 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between gap-2 px-5 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5 group min-w-0">
            <img
              src="/hmc-logo.png"
              alt={`${COMPANY.name} — ${COMPANY.fullName}`}
              className="h-10 w-auto shrink-0"
            />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-serif text-sm font-semibold text-white truncate">
                {COMPANY.name}
              </span>
              <span className="text-[9px] uppercase tracking-[0.16em] text-sky-light/80 truncate">
                Dashboard
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white p-1"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
            Navigation
          </div>
          {NAV_TABS.map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveView(tab.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sky text-navy shadow-md"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <tab.icon className="h-4.5 w-4.5 shrink-0" strokeWidth={1.8} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer actions */}
        <div className="border-t border-white/10 p-3 space-y-1">
          {onGoSettings && (
            <button
              onClick={onGoSettings}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Settings2 className="h-4 w-4 shrink-0" />
              <span>Paramètres</span>
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/75 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Déconnexion</span>
          </button>
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>Retour au site</span>
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3">
            {/* Left: mobile menu + title */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-foreground hover:bg-secondary transition-colors"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-serif text-base sm:text-lg font-semibold text-foreground truncate">
                  {NAV_TABS.find((t) => t.id === activeView)?.label}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground truncate hidden sm:block">
                  {COMPANY.fullName}
                </span>
              </div>
            </div>

            {/* Right: actions */}
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
                      <p className="text-xs text-muted-foreground">
                        Aucune notification
                      </p>
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
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-muted-foreground"
              >
                <RefreshCw
                  className={`h-4 w-4 sm:mr-1.5 ${refreshing ? "animate-spin" : ""}`}
                />
                <span className="hidden md:inline">Actualiser</span>
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
                <span className="hidden md:inline">Export CSV</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleMonthlyReport}
                className="text-muted-foreground hover:text-accent"
              >
                <FileText className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden md:inline">Rapport</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Active view content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 overflow-x-hidden">
          {activeView === "overview" && (
            <OverviewView
              data={data}
              loading={loading}
              onMessageUpdated={handleLocalUpdate}
              onRetry={() => fetchData()}
            />
          )}
          {activeView === "messages" && (
            <MessagesView
              data={data}
              loading={loading}
              onMessageUpdated={handleLocalUpdate}
              onRetry={() => fetchData()}
            />
          )}
          {activeView === "leads" && <LeadsView refreshSignal={refreshSignal} />}
          {activeView === "clients" && (
            <ClientsView refreshSignal={refreshSignal} />
          )}
          {activeView === "users" && <UsersView refreshSignal={refreshSignal} />}
          {activeView === "reports" && (
            <ReportsView refreshSignal={refreshSignal} />
          )}
        </main>

        <footer className="border-t border-border py-5">
          <div className="px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} {COMPANY.fullName} — Tableau de bord
            interne
          </div>
        </footer>
      </div>
    </div>
  );
}
