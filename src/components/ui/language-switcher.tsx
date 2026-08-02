"use client";

import { useTranslation, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LOCALE_OPTIONS: { code: Locale; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-muted/50 p-0.5",
        className
      )}
    >
      {LOCALE_OPTIONS.map((opt) => (
        <button
          key={opt.code}
          onClick={() => setLocale(opt.code)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-all duration-200",
            locale === opt.code
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-foreground/60 hover:text-foreground/90"
          )}
          aria-label={opt.code === "fr" ? "Switch to French" : "Switch to English"}
          aria-pressed={locale === opt.code}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
