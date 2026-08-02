"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!email.trim()) {
      setError("Veuillez entrer votre adresse e-mail.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setError("Cette adresse e-mail est déjà inscrite.");
          toast({
            title: "Déjà inscrit(e)",
            description: "Cette adresse e-mail est déjà inscrite à notre newsletter.",
            variant: "destructive",
          });
        } else {
          setError(data.error || "Une erreur est survenue. Réessayez.");
          toast({
            title: "Erreur",
            description: data.error || "Une erreur est survenue lors de l'inscription.",
            variant: "destructive",
          });
        }
        return;
      }

      // Success
      setSubmitted(true);
      setEmail("");
      toast({
        title: "Inscription réussie !",
        description: data.message || "Merci ! Vous êtes inscrit(e) à notre newsletter.",
      });
    } catch {
      setError("Erreur de connexion. Réessayez ultérieurement.");
      toast({
        title: "Erreur",
        description: "Impossible de se connecter au serveur. Réessayez ultérieurement.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Navy background */}
          <div className="absolute inset-0 bg-navy" />

          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-sky/5 blur-3xl" />

          <div className="relative px-6 sm:px-12 py-12 sm:py-16">
            <div className="max-w-2xl mx-auto text-center">
              {/* Icon */}
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-accent border border-white/10 mb-6">
                <Mail className="h-7 w-7" strokeWidth={1.5} />
              </div>

              {/* Heading */}
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="h-px w-8 bg-accent" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  Newsletter
                </span>
                <span className="h-px w-8 bg-accent" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white text-balance">
                Restez <span className="italic text-sky-light">informé</span>
              </h2>
              <p className="mt-4 text-white/75 max-w-lg mx-auto">
                Recevez nos analyses, nos conseils et nos actualités directement dans votre boîte
                mail. Une fois par mois, sans spam.
              </p>

              {/* Form */}
              {submitted ? (
                <div className="mt-8 flex items-center justify-center gap-2 text-accent">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    Merci ! Vous êtes inscrit(e) à notre newsletter.
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
                >
                  <div className="w-full">
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={loading}
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Adresse e-mail"
                    />
                    {error && (
                      <p className="mt-1.5 text-xs text-red-400 text-left">{error}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/90 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        Inscription...
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        S&apos;inscrire
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
