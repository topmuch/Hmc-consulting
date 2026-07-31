"use client";

import { Linkedin, Twitter, Facebook, Instagram, ExternalLink } from "lucide-react";
import type { SiteSettings } from "@/lib/settings-types";
import { Field, TextInput, TabHeader } from "./_fields";

type Props = {
  settings: SiteSettings;
  update: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
};

export function SocialTab({ settings, update }: Props) {
  const links = [
    {
      key: "linkedin" as const,
      label: "LinkedIn",
      icon: Linkedin,
      placeholder: "https://linkedin.com/company/hmc-consulting",
      color: "text-[#0a66c2]",
    },
    {
      key: "twitter" as const,
      label: "Twitter / X",
      icon: Twitter,
      placeholder: "https://twitter.com/hmc_consulting",
      color: "text-foreground",
    },
    {
      key: "facebook" as const,
      label: "Facebook",
      icon: Facebook,
      placeholder: "https://facebook.com/hmc.consulting",
      color: "text-[#1877f2]",
    },
    {
      key: "instagram" as const,
      label: "Instagram",
      icon: Instagram,
      placeholder: "https://instagram.com/hmc.consulting",
      color: "text-[#e1306c]",
    },
  ];

  return (
    <div>
      <TabHeader
        title="Réseaux sociaux"
        description="Liens vers vos profils sur les réseaux sociaux."
      />
      <div className="space-y-5">
        {links.map((l) => {
          const value = settings[l.key] || "";
          const isValidUrl = value && /^https?:\/\//.test(value);
          return (
            <Field key={l.key} label={l.label} description={l.placeholder}>
              <div className="relative">
                <l.icon className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${l.color}`} />
                <TextInput
                  type="url"
                  value={value}
                  onChange={(e) => update(l.key, e.target.value)}
                  placeholder={l.placeholder}
                  className="pl-9 pr-10"
                />
                {isValidUrl && (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                    aria-label={`Ouvrir ${l.label}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </Field>
          );
        })}

        {links.every((l) => !settings[l.key]) && (
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Renseignez vos liens pour les afficher dans le pied de page du site.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
