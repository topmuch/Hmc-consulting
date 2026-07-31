"use client";

import { useState } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import type { SiteSettings } from "@/lib/settings-types";
import { Field, TextInput, TextArea, TabHeader } from "./_fields";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  settings: SiteSettings;
  update: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
};

const PREVIEW_LIMIT = 160;

export function SeoTab({ settings, update }: Props) {
  const [showPreview, setShowPreview] = useState(true);

  const effectiveTitle =
    settings.seoTitle?.trim() || `${settings.siteName} — ${settings.siteFullName}`;
  const effectiveDesc = settings.seoDescription?.trim() || "Description par défaut du site HMC.";
  const keywords = settings.seoKeywords
    ? settings.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [];

  return (
    <div>
      <TabHeader
        title="Référencement (SEO)"
        description="Métadonnées utilisées par les moteurs de recherche et les réseaux sociaux."
      />

      <div className="space-y-5">
        <Field
          label="Titre SEO"
          description="Affiché dans l'onglet du navigateur et les résultats de recherche (recommandé : 50-60 caractères)."
        >
          <TextInput
            value={settings.seoTitle || ""}
            onChange={(e) => update("seoTitle", e.target.value)}
            placeholder={`${settings.siteName} — ${settings.siteFullName}`}
            maxLength={70}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span />
            <span>{(settings.seoTitle || "").length}/70</span>
          </div>
        </Field>

        <Field
          label="Description"
          description={`Résumé affiché sous le titre dans les résultats de recherche (recommandé : ~${PREVIEW_LIMIT} caractères).`}
        >
          <TextArea
            value={settings.seoDescription || ""}
            onChange={(e) => update("seoDescription", e.target.value)}
            placeholder="HMC est un cabinet de conseil et de management dédié aux entreprises…"
            rows={3}
            maxLength={300}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span />
            <span
              className={
                (settings.seoDescription || "").length > PREVIEW_LIMIT
                  ? "text-amber-600"
                  : ""
              }
            >
              {(settings.seoDescription || "").length}/{PREVIEW_LIMIT} recommandés
            </span>
          </div>
        </Field>

        <Field
          label="Mots-clés"
          description="Séparés par des virgules (ex. conseil, management, Afrique)."
        >
          <TextInput
            value={settings.seoKeywords || ""}
            onChange={(e) => update("seoKeywords", e.target.value)}
            placeholder="conseil entreprise, management, consulting stratégique, Afrique"
          />
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {keywords.map((k) => (
                <Badge key={k} variant="secondary" className="font-normal">
                  {k}
                </Badge>
              ))}
            </div>
          )}
        </Field>

        <Field
          label="Image Open Graph"
          description="URL de l'image affichée lors d'un partage sur les réseaux sociaux (1200×630 recommandé)."
        >
          <TextInput
            value={settings.ogImage || ""}
            onChange={(e) => update("ogImage", e.target.value)}
            placeholder="/hero-business.jpg"
          />
        </Field>

        {/* Google preview */}
        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Aperçu dans Google
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview((v) => !v)}
              className="h-7 text-xs"
            >
              {showPreview ? <EyeOff className="h-3.5 w-3.5 mr-1" /> : <Eye className="h-3.5 w-3.5 mr-1" />}
              {showPreview ? "Masquer" : "Afficher"}
            </Button>
          </div>
          {showPreview && (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground truncate">
                https://hmc-consulting.com
              </div>
              <div className="text-lg text-[#1a0dab] leading-snug line-clamp-1">
                {effectiveTitle}
              </div>
              <div className="text-sm text-[#4d5156] line-clamp-2 leading-relaxed">
                {effectiveDesc}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
