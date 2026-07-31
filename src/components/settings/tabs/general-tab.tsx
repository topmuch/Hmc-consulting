"use client";

import type { SiteSettings } from "@/lib/settings-types";
import { Field, TextInput, TabHeader } from "./_fields";

type Props = {
  settings: SiteSettings;
  update: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
};

export function GeneralTab({ settings, update }: Props) {
  return (
    <div>
      <TabHeader
        title="Informations générales"
        description="Coordonnées et identité de l'entreprise affichées sur le site."
      />
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Nom court" description="Affiché dans l'en-tête (ex. HMC).">
          <TextInput
            value={settings.siteName}
            onChange={(e) => update("siteName", e.target.value)}
            placeholder="HMC"
          />
        </Field>
        <Field label="Nom complet" description="Affiché sous le logo et dans le footer.">
          <TextInput
            value={settings.siteFullName}
            onChange={(e) => update("siteFullName", e.target.value)}
            placeholder="Horizon Management Consulting"
          />
        </Field>
        <Field label="Slogan" description="Phrase d'accroche du site.">
          <TextInput
            value={settings.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            placeholder="Votre partenaire en conseil et management des entreprises"
          />
        </Field>
        <Field label="Email de contact" description="Adresse affichée sur le site.">
          <TextInput
            type="email"
            value={settings.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="contact@hmc-consulting.pro"
          />
        </Field>
        <Field label="Téléphone" description="Numéro affiché sur le site.">
          <TextInput
            value={settings.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+221 77 455 11 36"
          />
        </Field>
        <Field label="Interlocuteur" description="Personne de contact principale.">
          <TextInput
            value={settings.partner}
            onChange={(e) => update("partner", e.target.value)}
            placeholder="Cheikh Lam"
          />
        </Field>
        <Field label="Rôle de l'interlocuteur">
          <TextInput
            value={settings.partnerRole}
            onChange={(e) => update("partnerRole", e.target.value)}
            placeholder="Partner"
          />
        </Field>
      </div>
    </div>
  );
}
