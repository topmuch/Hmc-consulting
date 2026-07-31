"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { COMPANY, NAV_LINKS } from "@/lib/site-data";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="#top" className="inline-flex items-center">
              <img
                src="/hmc-logo.png"
                alt={`${COMPANY.name} — ${COMPANY.fullName}`}
                className="h-16 w-auto sm:h-20"
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
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
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
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <span className="block text-muted-foreground text-xs uppercase tracking-wider">
                  Interlocuteur
                </span>
                <span className="text-foreground">
                  {COMPANY.partner} — {COMPANY.partnerRole}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                  className="group inline-flex items-center gap-1.5 text-foreground hover:text-accent transition-colors"
                >
                  {COMPANY.phone}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="group inline-flex items-center gap-1.5 text-foreground hover:text-accent transition-colors"
                >
                  {COMPANY.email}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} {COMPANY.fullName}. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground">
            Conseil et management des entreprises.
          </p>
        </div>
      </div>
    </footer>
  );
}
