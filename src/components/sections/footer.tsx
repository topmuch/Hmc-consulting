"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY } from "@/lib/site-data";

const FOOTER_NAV = [
  { href: "/", label: "Accueil" },
  { href: "/?page=histoire", label: "À propos" },
  { href: "/?page=services", label: "Services" },
  { href: "/?page=produits", label: "Produits" },
  { href: "/?page=blog", label: "Blog" },
  { href: "/?page=equipe", label: "Équipe" },
  { href: "/?page=contact", label: "Contact" },
];

const FOOTER_ABOUT = [
  { href: "/?page=valeurs", label: "Nos valeurs" },
  { href: "/?page=experience", label: "Notre expérience" },
  { href: "/?page=expertise", label: "Notre expertise" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center">
              <img
                src="/hmc-logo.png"
                alt={`${COMPANY.name} — ${COMPANY.fullName}`}
                className="h-14 w-auto sm:h-16"
              />
            </Link>
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-xs">
              {COMPANY.fullName} — cabinet de conseil et de management dédié aux
              entreprises. {COMPANY.tagline}.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent font-semibold">
              <span className="h-px w-6 bg-accent" />
              Afrique &amp; Océan Indien
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* À propos */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              À propos
            </h4>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_ABOUT.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Contact
            </h4>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-muted-foreground hover:text-accent transition-colors break-all"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <a
                  href={`tel:${COMPANY.phone}`}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Dakar, Sénégal
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {year} {COMPANY.fullName}. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground">
            Conseil et management des entreprises.
          </p>
        </div>
      </div>
    </footer>
  );
}
