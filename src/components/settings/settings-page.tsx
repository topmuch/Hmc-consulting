"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Settings2,
  Building2,
  Search,
  Bell,
  Share2,
  Check,
  Loader2,
  Save,
  Mail,
  Lock,
} from "lucide-react";
import { COMPANY } from "@/lib/site-data";
import type { SiteSettings } from "@/lib/settings-types";
import { DEFAULT_SETTINGS } from "@/lib/settings-types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { GeneralTab } from "./tabs/general-tab";
import { SeoTab } from "./tabs/seo-tab";
import { NotificationsTab } from "./tabs/notifications-tab";
import { SocialTab } from "./tabs/social-tab";
import { EmailTab } from "./tabs/email-tab";
import { SecurityTab } from "./tabs/security-tab";

type TabId = "general" | "seo" | "notifications" | "social" | "email" | "security";

const TABS: { id: TabId; label: string; icon: typeof Building2 }[] = [
  { id: "general", label: "Général", icon: Building2 },
  { id: "seo", label: "SEO", icon: Search },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "email", label: "Email & SMTP", icon: Mail },
  { id: "security", label: "Sécurité", icon: Lock },
  { id: "social", label: "Réseaux sociaux", icon: Share2 },
];

export function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [original, setOriginal] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("general");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      const data = await res.json();
      const merged = { ...DEFAULT_SETTINGS, ...data };
      setSettings(merged);
      setOriginal(merged);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const dirty = JSON.stringify(settings) !== JSON.stringify(original);

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const onSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "Échec de la sauvegarde");
      }
      setSettings(data.settings);
      setOriginal(data.settings);
      toast({
        title: "Paramètres enregistrés",
        description: "Vos modifications ont été sauvegardées avec succès.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const onReset = () => {
    setSettings(original);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
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
                <Settings2 className="h-4 w-4 text-accent" />
                Paramètres
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {COMPANY.fullName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost" className="text-muted-foreground">
              <Link href="/?view=dashboard">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
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

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
            Paramètres du site
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les informations de l&apos;entreprise, le référencement, les notifications et les
            réseaux sociaux.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Tabs sidebar */}
          <aside className="lg:col-span-1">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <tab.icon className="h-4 w-4 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Tab content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-48 rounded-lg" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
              </div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-2xl border border-border p-5 sm:p-7"
              >
                {activeTab === "general" && (
                  <GeneralTab settings={settings} update={update} />
                )}
                {activeTab === "seo" && (
                  <SeoTab settings={settings} update={update} />
                )}
                {activeTab === "notifications" && (
                  <NotificationsTab settings={settings} update={update} />
                )}
                {activeTab === "email" && (
                  <EmailTab settings={settings} update={update} />
                )}
                {activeTab === "security" && (
                  <SecurityTab settings={settings} update={update} />
                )}
                {activeTab === "social" && (
                  <SocialTab settings={settings} update={update} />
                )}
              </motion.div>
            )}

            {/* Sticky save bar */}
            {!loading && (
              <div className="sticky bottom-4 mt-5 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/95 backdrop-blur-md p-3 shadow-lg">
                <div className="flex items-center gap-2 text-sm">
                  {dirty ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-muted-foreground">
                        Modifications non enregistrées
                      </span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span className="text-muted-foreground">Tout est à jour</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReset}
                    disabled={!dirty || saving}
                  >
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={onSave}
                    disabled={!dirty || saving}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                        Enregistrement…
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1.5" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {COMPANY.fullName} — Paramètres
        </div>
      </footer>
    </div>
  );
}
