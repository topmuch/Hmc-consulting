"use client";

import { Lock, ShieldCheck, KeyRound, Info } from "lucide-react";
import type { SiteSettings } from "@/lib/settings-types";
import { Field, TextInput, TabHeader } from "./_fields";

type Props = {
  settings: SiteSettings;
  update: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
};

export function SecurityTab({ settings, update }: Props) {
  return (
    <div>
      <TabHeader
        title="Sécurité"
        description="Protection de l'accès au dashboard et aux paramètres."
      />

      <div className="space-y-5">
        {/* Admin password */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-accent" />
            Mot de passe administrateur
          </h3>

          <Field
            label="Mot de passe"
            description="Mot de passe requis pour accéder au dashboard et aux paramètres. Laissez vide pour utiliser le mot de passe par défaut (hmc2024)."
          >
            <TextInput
              type="password"
              value={settings.adminPassword || ""}
              onChange={(e) => update("adminPassword", e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-4">
            <Info className="h-5 w-5 shrink-0 mt-0.5 text-accent" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Comment ça marche</p>
              <ul className="space-y-1 list-disc list-inside text-xs">
                <li>Le dashboard et les paramètres sont protégés par mot de passe</li>
                <li>Le mot de passe par défaut est <code className="bg-muted px-1 rounded">hmc2024</code></li>
                <li>Définissez un mot de passe personnalisé ci-dessus pour le remplacer</li>
                <li>La session reste active 7 jours</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security tips */}
        <div className="rounded-xl bg-navy text-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-5 w-5 text-sky-light" />
            <h3 className="font-serif text-base font-semibold">Bonnes pratiques</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-sky-light shrink-0 mt-0.5" />
              Utilisez un mot de passe d'au moins 8 caractères
            </li>
            <li className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-sky-light shrink-0 mt-0.5" />
              Mélangez majuscules, minuscules, chiffres et caractères spéciaux
            </li>
            <li className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-sky-light shrink-0 mt-0.5" />
              Changez le mot de passe régulièrement
            </li>
            <li className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-sky-light shrink-0 mt-0.5" />
              Ne partagez jamais le mot de passe par email
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
