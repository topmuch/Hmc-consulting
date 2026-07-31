"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMPANY, NAV_LINKS } from "@/lib/site-data";
import { Button } from "@/components/ui/button";

export function SiteHeader({ onGoDashboard }: { onGoDashboard?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md shadow-[0_1px_0_0_var(--border)] py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#top" className="flex items-center gap-3 group">
          <img
            src="/hmc-logo.png"
            alt={`${COMPANY.name} — ${COMPANY.fullName}`}
            className="h-10 w-auto sm:h-11 transition-transform group-hover:scale-105"
          />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-serif text-base font-semibold text-foreground">
              {COMPANY.name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {COMPANY.fullName}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors relative after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
          {onGoDashboard && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onGoDashboard}
              className="text-foreground/80 hover:text-accent"
            >
              <LayoutDashboard className="h-4 w-4 mr-1.5" />
              Dashboard
            </Button>
          )}
          <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="#contact">Nous contacter</Link>
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
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="container mx-auto flex flex-col px-4 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
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
              <Link href="#contact" onClick={() => setOpen(false)}>
                Nous contacter
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
