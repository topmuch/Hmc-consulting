"use client";

import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { COMPANY, NAV_LINKS } from "@/lib/site-data";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link href="#top" className="inline-flex items-center">
              <img
                src="/hmc-logo.png"
                alt={`${COMPANY.name} — ${COMPANY.fullName}`}
                className="h-14 w-auto sm:h-16"
              />
            </Link>
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-md">
              {COMPANY.fullName} — cabinet de conseil et de management dédié aux
              entreprises. {COMPANY.tagline}.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent font-semibold">
              <span className="h-px w-6 bg-accent" />
              Afrique &amp; Océan Indien
            </div>
          </div>

          {/* Nav */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.id || link.label}>
                  {link.href ? (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span className="text-sm text-foreground font-medium">{link.label}</span>
                  )}
                  {link.children && (
                    <ul className="ml-4 mt-1.5 space-y-1.5">
                      {link.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={child.href}
                            className="text-sm text-muted-foreground hover:text-accent transition-colors"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Contact
            </h4>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  {COMPANY.email}
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
