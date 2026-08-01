"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Menu, X, LayoutDashboard, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMPANY, NAV_LINKS } from "@/lib/site-data";
import { Button } from "@/components/ui/button";

export function SiteHeader({ onGoDashboard }: { onGoDashboard?: () => void }) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const activePage = searchParams.get("page");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            const active = link.id ? activePage === link.id : false;

            // Dropdown item (À propos)
            if (link.children && link.children.length > 0) {
              const isChildActive = link.children.some((c) => activePage === c.id);
              return (
                <div key={link.id || link.label} ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    onMouseEnter={() => setDropdownOpen(true)}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1",
                      isChildActive || active
                        ? "text-accent"
                        : "text-foreground/80 hover:text-accent hover:bg-secondary"
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        dropdownOpen && "rotate-180"
                      )}
                    />
                    {(isChildActive || active) && (
                      <span className="absolute -bottom-px left-3 right-3 h-0.5 bg-accent rounded-full" />
                    )}
                  </button>

                  {/* Dropdown panel */}
                  {dropdownOpen && (
                    <div
                      onMouseLeave={() => setDropdownOpen(false)}
                      className="absolute top-full left-0 mt-1 w-52 rounded-lg border border-border bg-background shadow-lg py-1 z-50 animate-in fade-in-0 slide-in-from-top-2 duration-150"
                    >
                      {/* Parent link */}
                      {link.href && (
                        <Link
                          href={link.href}
                          onClick={() => setDropdownOpen(false)}
                          className={cn(
                            "block px-4 py-2.5 text-sm font-medium transition-colors",
                            active
                              ? "bg-accent/10 text-accent"
                              : "text-foreground/80 hover:bg-secondary hover:text-accent"
                          )}
                        >
                          {link.label}
                        </Link>
                      )}
                      {link.href && link.children.length > 0 && (
                        <div className="my-1 border-t border-border" />
                      )}
                      {/* Children */}
                      {link.children.map((child) => {
                        const childActive = activePage === child.id;
                        return (
                          <Link
                            key={child.id}
                            href={child.href}
                            onClick={() => setDropdownOpen(false)}
                            className={cn(
                              "block px-4 py-2.5 text-sm transition-colors",
                              childActive
                                ? "bg-accent/10 text-accent font-medium"
                                : "text-foreground/70 hover:bg-secondary hover:text-accent"
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular link
            return (
              <Link
                key={link.id || link.label}
                href={link.href || "/"}
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
              Connexion
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
              aria-label="Connexion"
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
              const active = link.id ? activePage === link.id : false;

              // Dropdown item (À propos)
              if (link.children && link.children.length > 0) {
                const isChildActive = link.children.some((c) => activePage === c.id);
                const isExpanded = mobileSubOpen === link.id;
                return (
                  <div key={link.id || link.label}>
                    <div className="flex items-center">
                      {link.href && (
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex-1 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                            active
                              ? "bg-accent/10 text-accent"
                              : "text-foreground/80 hover:bg-secondary hover:text-accent"
                          )}
                        >
                          {link.label}
                        </Link>
                      )}
                      {!link.href && (
                        <button
                          onClick={() => setMobileSubOpen(isExpanded ? null : (link.id || null))}
                          className={cn(
                            "flex-1 text-left rounded-md px-3 py-2.5 text-sm font-medium transition-colors flex items-center justify-between",
                            isChildActive || active
                              ? "bg-accent/10 text-accent"
                              : "text-foreground/80 hover:bg-secondary hover:text-accent"
                          )}
                        >
                          {link.label}
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>
                      )}
                      {link.href && (
                        <button
                          onClick={() => setMobileSubOpen(isExpanded ? null : (link.id || null))}
                          className="p-2 rounded-md text-foreground/60 hover:bg-secondary hover:text-accent transition-colors"
                          aria-label="Ouvrir le sous-menu"
                        >
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>
                      )}
                    </div>
                    {isExpanded && (
                      <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-accent/20 pl-3">
                        {link.children.map((child) => {
                          const childActive = activePage === child.id;
                          return (
                            <Link
                              key={child.id}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "rounded-md px-3 py-2 text-sm transition-colors",
                                childActive
                                  ? "bg-accent/10 text-accent font-medium"
                                  : "text-foreground/70 hover:bg-secondary hover:text-accent"
                              )}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular link
              return (
                <Link
                  key={link.id || link.label}
                  href={link.href || "/"}
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
                Connexion
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
