"use client";

import { motion } from "framer-motion";
import { Inbox, CalendarDays, CalendarRange, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatItem = {
  icon: LucideIcon;
  label: string;
  value: number | string;
  sub: string;
  trend?: number;
  delay: number;
};

export function StatsCards({
  total,
  thisMonth,
  thisWeek,
  today,
  monthGrowth,
}: {
  total: number;
  thisMonth: number;
  thisWeek: number;
  today: number;
  monthGrowth: number;
}) {
  const items: StatItem[] = [
    {
      icon: Inbox,
      label: "Total des demandes",
      value: total,
      sub: "depuis le début",
      delay: 0,
    },
    {
      icon: CalendarDays,
      label: "Ce mois-ci",
      value: thisMonth,
      sub: "vs mois dernier",
      trend: monthGrowth,
      delay: 0.1,
    },
    {
      icon: CalendarRange,
      label: "Cette semaine",
      value: thisWeek,
      sub: "7 derniers jours",
      delay: 0.2,
    },
    {
      icon: Clock,
      label: "Aujourd'hui",
      value: today,
      sub: "nouvelles demandes",
      delay: 0.3,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: item.delay }}
          className="relative bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow overflow-hidden group"
        >
          <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-accent/5 blur-2xl group-hover:bg-accent/10 transition-colors" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <item.icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
              {item.trend !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    item.trend >= 0
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                  )}
                >
                  {item.trend >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(item.trend)}%
                </span>
              )}
            </div>
            <div className="mt-4 font-serif text-3xl sm:text-4xl font-semibold text-foreground">
              {item.value}
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">{item.label}</div>
            <div className="text-xs text-muted-foreground">{item.sub}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
