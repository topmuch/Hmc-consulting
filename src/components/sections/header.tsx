"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMPANY, NAV_LINKS } from "@/lib/site-data";
import { Button } from "@/components/ui/button";

export function SiteHeader({ onGoDashboard }: { onGoDashboard?: () => void }) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const activePage = searchParams.get("page");

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        <Link href="/" className="flex items-center group" aria-label="HMC — Horizon Management Consulting">
          <img
            src="/hmc-logo.png"
            alt="HMC — Horizon Management Consulting"
            className="h-14 w-auto sm:h-16 transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = activePage === link.id;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
                  active
                    ? "text-accent"
                    : "text-foreground/80 hover:text-accent hover:bg-secondary"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-px left-3 right-3 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
          {onGoDashboard && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onGoDashboard}
              className="ml-2 text-foreground/80 hover:text-accent"
            >
              <LayoutDashboard className="h-4 w-4 mr-1.5" />
              Dashboard
            </Button>
          )}
          <Button asChild size="sm" className="ml-2 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/?page=contact">Nous contacter</Link>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-1">
          {onGoDashboard && (
            <button
              className="inline-flex items-center justify-center h-10 w-10 rounded-md text-foreground hover:bg-secondary transition-colors"
              onClick={onGoDashboard}
              aria-label="Ouvrir le tableau de bord"
            >
              <LayoutDashboard className="h-5 w-5" />
            </button>
          )}
          <button
            className="inline-flex items-center justify-center h-10 w-10 rounded-md text-foreground hover:bg-secondary transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Ouvrir le menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container mx-auto flex flex-col px-4 py-4 gap-1">
            {NAV_LINKS.map((link) => {
              const active = activePage === link.id;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-foreground/80 hover:bg-secondary hover:text-accent"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {onGoDashboard && (
              <button
                onClick={() => {
                  setOpen(false);
                  onGoDashboard();
                }}
                className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-accent transition-colors flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
            )}
            <Button asChild className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/?page=contact" onClick={() => setOpen(false)}>
                Nous contacter
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
