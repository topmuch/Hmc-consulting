"use client";

import { ReactNode } from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ---- Label maps ----

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  contacted: "Contacté",
  callback: "À rappeler",
  interested: "Intéressé",
  ordered: "Commandé",
  lost: "Perdu",
};

export const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  contacted: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  callback: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  interested: "bg-violet-500/10 text-violet-600 border-violet-500/30",
  ordered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  lost: "bg-gray-500/10 text-gray-500 border-gray-500/30",
};

export const LEAD_SOURCE_LABELS: Record<string, string> = {
  website: "Site web",
  referral: "Recommandation",
  campaign: "Campagne",
  other: "Autre",
};

export const LEAD_SOURCE_COLORS: Record<string, string> = {
  website: "bg-sky-500/10 text-sky-600 border-sky-500/30",
  referral: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  campaign: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  other: "bg-gray-500/10 text-gray-500 border-gray-500/30",
};

export const CLIENT_TYPE_LABELS: Record<string, string> = {
  prospect: "Prospect",
  client: "Client",
  partner: "Partenaire",
};

export const CLIENT_TYPE_COLORS: Record<string, string> = {
  prospect: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  client: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  partner: "bg-violet-500/10 text-violet-600 border-violet-500/30",
};

export const CLIENT_STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  inactive: "Inactif",
  archived: "Archivé",
};

export const CLIENT_STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  inactive: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  archived: "bg-gray-500/10 text-gray-500 border-gray-500/30",
};

export const USER_ROLE_LABELS: Record<string, string> = {
  admin: "Administrateur",
  manager: "Manager",
  agent: "Agent",
};

export const USER_ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-500/10 text-red-600 border-red-500/30",
  manager: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  agent: "bg-gray-500/10 text-gray-500 border-gray-500/30",
};

// ---- Small components ----

export function ViewHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
    >
      <div className="min-w-0">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function MiniStatCard({
  icon: Icon,
  label,
  value,
  color = "bg-accent/10 text-accent",
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color?: string;
  delay?: number;
}) {
  return (
    <div
      className="bg-card rounded-xl border border-border p-4 flex items-center gap-3"
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
          color
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <div className="font-serif text-2xl font-semibold text-foreground tabular-nums leading-none">
          {value}
        </div>
        <div className="text-xs text-muted-foreground mt-1 truncate">
          {label}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  onRetry,
  message = "Impossible de charger les données.",
}: {
  onRetry?: () => void;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-sm text-muted-foreground">
        {message}{" "}
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-accent underline underline-offset-2"
          >
            Réessayer
          </button>
        )}
      </p>
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between gap-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-48" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Styled native select ----

export function NativeSelect({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  );
}

// ---- Badge helpers ----

export function Pill({
  label,
  colorClass,
}: {
  label: string;
  colorClass: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        colorClass
      )}
    >
      {label}
    </span>
  );
}

// ---- Date helpers ----

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "À l'instant";
  const min = Math.floor(sec / 60);
  if (min < 60) return `Il y a ${min} min`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)} sem.`;
  return `Il y a ${Math.floor(days / 30)} mois`;
}

// ---- Loading overlay for buttons ----

export function LoadingIcon({ loading }: { loading: boolean }) {
  if (!loading) return null;
  return <Loader2 className="h-4 w-4 animate-spin" />;
}
