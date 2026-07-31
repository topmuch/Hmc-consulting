"use client";

import { Mail, Server, Info } from "lucide-react";
import type { SiteSettings } from "@/lib/settings-types";
import { Field, TextInput, TabHeader } from "./_fields";
import { Switch } from "@/components/ui/switch";

type Props = {
  settings: SiteSettings;
  update: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
};

export function EmailTab({ settings, update }: Props) {
  const smtpConfigured = !!(settings.smtpHost && settings.smtpUser);

  return (
    <div>
      <TabHeader
        title="Email & SMTP"
        description="Configuration du serveur d'envoi d'emails pour les accusés de réception, notifications et réponses."
      />

      <div className="space-y-5">
        {/* Status */}
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 ${
            smtpConfigured
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-amber-500/30 bg-amber-500/5"
          }`}
        >
          <Info
            className={`h-5 w-5 shrink-0 mt-0.5 ${
              smtpConfigured ? "text-emerald-600" : "text-amber-600"
            }`}
          />
          <div className="text-sm">
            <div className={`font-medium ${smtpConfigured ? "text-emerald-700" : "text-amber-700"}`}>
              {smtpConfigured ? "SMTP configuré" : "SMTP non configuré"}
            </div>
            <p className="text-muted-foreground mt-1">
              {smtpConfigured
                ? "Les emails seront envoyés via votre serveur SMTP."
                : "Sans SMTP, les emails (accusés de réception, notifications) sont enregistrés dans le journal mais non envoyés réellement. Configurez SMTP pour activer l'envoi réel."}
            </p>
          </div>
        </div>

        {/* Auto-reply toggle */}
        <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">
                Accusé de réception automatique
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Envoie un email de confirmation à chaque visiteur qui soumet le formulaire de contact.
              </div>
            </div>
          </div>
          <Switch
            checked={settings.autoReplyEnabled}
            onCheckedChange={(v) => update("autoReplyEnabled", v)}
          />
        </div>

        {/* SMTP config */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Server className="h-4 w-4 text-accent" />
            Configuration SMTP
          </h3>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Serveur SMTP" description="Ex. smtp.gmail.com, mail.votredomaine.com">
              <TextInput
                value={settings.smtpHost || ""}
                onChange={(e) => update("smtpHost", e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </Field>
            <Field label="Port" description="587 (TLS), 465 (SSL), ou 25">
              <TextInput
                value={settings.smtpPort || ""}
                onChange={(e) => update("smtpPort", e.target.value)}
                placeholder="587"
              />
            </Field>
            <Field label="Utilisateur" description="Identifiant de connexion SMTP">
              <TextInput
                value={settings.smtpUser || ""}
                onChange={(e) => update("smtpUser", e.target.value)}
                placeholder="contact@hmc-consulting.pro"
              />
            </Field>
            <Field label="Mot de passe" description="Mot de passe ou clé d'application">
              <TextInput
                type="password"
                value={settings.smtpPass || ""}
                onChange={(e) => update("smtpPass", e.target.value)}
                placeholder="••••••••"
              />
            </Field>
          </div>

          <Field
            label="Expéditeur (From)"
            description="Nom et adresse affichés. Ex. HMC <contact@hmc-consulting.pro>"
          >
            <TextInput
              value={settings.smtpFrom || ""}
              onChange={(e) => update("smtpFrom", e.target.value)}
              placeholder="HMC <contact@hmc-consulting.pro>"
            />
          </Field>
        </div>

        <div className="rounded-xl bg-secondary/50 border border-border p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">💡 Astuce Gmail</p>
          Pour Gmail, utilisez une « clé d'application » (App Password) plutôt que votre mot de passe
          habituel. Activez la validation en deux étapes, puis générez une clé d'application.
        </div>
      </div>
    </div>
  );
}
