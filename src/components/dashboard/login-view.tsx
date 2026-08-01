"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { COMPANY } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginView({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setError(data?.error || "Mot de passe incorrect");
        setLoading(false);
        return;
      }
      onSuccess();
    } catch (err) {
      console.error("[login] error", err);
      setError("Impossible de contacter le serveur. Réessayez.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#003070] via-[#003a82] to-[#50b0e0]">
      {/* Decorative blurs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <header className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center gap-3">
          <img
            src="/hmc-logo.png"
            alt={`${COMPANY.name} — ${COMPANY.fullName}`}
            className="h-12 w-auto drop-shadow"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-serif text-base font-semibold text-white">
              {COMPANY.name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-sky-100/80">
              {COMPANY.fullName}
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Top accent */}
            <div className="h-1.5 bg-gradient-to-r from-[#003070] to-[#50b0e0]" />

            <div className="p-7 sm:p-9">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#003070]/10 text-[#003070] mb-4">
                  <ShieldCheck className="h-7 w-7" strokeWidth={1.8} />
                </div>
                <h1 className="font-serif text-2xl font-semibold text-foreground">
                  Accès au tableau de bord
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
                  Entrez votre mot de passe administrateur pour accéder au suivi des demandes.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      className="pl-9 h-11"
                      autoFocus
                      disabled={loading}
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-600"
                  >
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full h-11 bg-[#003070] hover:bg-[#003a82] text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connexion…
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {process.env.NODE_ENV !== "production" && (
              <div className="mt-6 rounded-md bg-sky-50 border border-sky-200/60 px-3 py-2.5 text-xs text-sky-800">
                <span className="font-medium">Astuce :</span> mot de passe par défaut{" "}
                <code className="font-mono bg-white/70 border border-sky-200 rounded px-1 py-0.5">
                  hmc2024
                </code>
              </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-sky-100/80 mt-6">
            © {new Date().getFullYear()} {COMPANY.fullName} — Espace réservé à l&apos;administration
          </p>
        </motion.div>
      </main>
    </div>
  );
}
