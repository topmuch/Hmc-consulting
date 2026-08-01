"use client";

import { motion } from "framer-motion";
import { STAGE_LABELS } from "@/lib/settings-types";

type StagePoint = { stage: string; count: number };

const STAGE_ORDER = ["received", "qualified", "meeting", "client"] as const;

// Distinct colors per stage
const STAGE_COLORS = ["#3b82f6", "#f59e0b", "#8b5cf6", "#10b981"] as const;
const STAGE_BG = ["bg-blue-500", "bg-amber-500", "bg-violet-500", "bg-emerald-500"] as const;

export function FunnelChart({ data }: { data: StagePoint[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  const ordered = STAGE_ORDER.map((stage) => {
    const found = data.find((d) => d.stage === stage);
    return { stage, count: found?.count ?? 0 };
  });

  const maxCount = Math.max(...ordered.map((d) => d.count), 1);

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="font-serif text-lg font-semibold text-foreground">
          Tunnel de conversion
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          De la réception au client signé
        </p>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <span className="text-2xl">📊</span>
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">Aucune donnée disponible</p>
          <p className="mt-1 text-xs text-muted-foreground">Les données apparaîtront ici dès les premières demandes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ordered.map((item, idx) => {
            const label = STAGE_LABELS[item.stage] || item.stage;
            const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
            const maxWidthPct = 100 - idx * 8;
            const widthPct =
              item.count === 0 ? 0 : Math.max(8, (item.count / maxCount) * maxWidthPct);
            const color = STAGE_COLORS[idx];

            return (
              <motion.div
                key={item.stage}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-lg font-semibold text-foreground tabular-nums">
                      {item.count}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-7 w-full rounded-md bg-secondary/60 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.08 + 0.1, ease: "easeOut" }}
                    className="h-full rounded-md flex items-center justify-end px-2"
                    style={{
                      background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}

          <div className="pt-3 mt-2 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total traité</span>
            <span className="font-semibold text-foreground tabular-nums">{total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
