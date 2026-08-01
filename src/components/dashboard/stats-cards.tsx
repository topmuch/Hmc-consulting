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
  // Multicolor theme for each card
  gradient: string; // bg gradient
  iconBg: string; // icon container bg
  iconColor: string; // icon color
  valueColor: string; // big number color
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
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-white/20",
      iconColor: "text-white",
      valueColor: "text-white",
    },
    {
      icon: CalendarDays,
      label: "Ce mois-ci",
      value: thisMonth,
      sub: "vs mois dernier",
      trend: monthGrowth,
      delay: 0.1,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-white/20",
      iconColor: "text-white",
      valueColor: "text-white",
    },
    {
      icon: CalendarRange,
      label: "Cette semaine",
      value: thisWeek,
      sub: "7 derniers jours",
      delay: 0.2,
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-white/20",
      iconColor: "text-white",
      valueColor: "text-white",
    },
    {
      icon: Clock,
      label: "Aujourd'hui",
      value: today,
      sub: "nouvelles demandes",
      delay: 0.3,
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-white/20",
      iconColor: "text-white",
      valueColor: "text-white",
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
          className={cn(
            "relative rounded-2xl p-5 overflow-hidden group bg-gradient-to-br shadow-lg hover:shadow-xl transition-shadow",
            item.gradient
          )}
        >
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors" />
          {/* Decorative pattern */}
          <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full border-4 border-white/10" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg backdrop-blur-sm",
                  item.iconBg,
                  item.iconColor
                )}
              >
                <item.icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
              {item.trend !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium backdrop-blur-sm",
                    item.trend >= 0
                      ? "bg-white/20 text-white"
                      : "bg-red-500/30 text-white"
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
            <div
              className={cn(
                "mt-4 font-serif text-3xl sm:text-4xl font-semibold",
                item.valueColor
              )}
            >
              {item.value}
            </div>
            <div className="mt-1 text-sm font-medium text-white/95">{item.label}</div>
            <div className="text-xs text-white/70">{item.sub}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
