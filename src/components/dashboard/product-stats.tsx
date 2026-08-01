"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { getProductById } from "@/lib/products-data";

type ProductPoint = { productId: string | null; count: number };

// Distinct colors for each product slot
const PRODUCT_COLORS = [
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#ef4444", // red
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
];

export function ProductStats({ data }: { data: ProductPoint[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  // Sort by count desc, keep "none" at the bottom if present
  const sorted = [...data].sort((a, b) => {
    if (!a.productId) return 1;
    if (!b.productId) return -1;
    return b.count - a.count;
  });

  const maxCount = Math.max(...sorted.map((d) => d.count), 1);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="h-8 w-1.5 rounded-full shrink-0 bg-gradient-to-b from-amber-500 via-emerald-500 to-cyan-500" />
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Demandes par produit
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Origine des contacts par solution
            </p>
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6 pt-3">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-emerald-500/20">
              <Package className="h-6 w-6 text-amber-500" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">Aucune donnée produit</p>
            <p className="mt-1 text-xs text-muted-foreground">Les stats produit apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((item, idx) => {
              const product = item.productId ? getProductById(item.productId) : undefined;
              const name = product?.name || "Non spécifié";
              const Icon = product?.icon || Package;
              const accentHex = product?.accentHex;
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              const widthPct = (item.count / maxCount) * 100;
              const color = accentHex || PRODUCT_COLORS[idx % PRODUCT_COLORS.length];

              return (
                <motion.div
                  key={item.productId || "__none__"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group"
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-md shrink-0"
                        style={{ backgroundColor: `${color}1a`, color }}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm font-medium text-foreground truncate">
                        {name}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 shrink-0">
                      <span className="text-sm font-semibold text-foreground tabular-nums">
                        {item.count}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-secondary/60 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 + 0.05, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </motion.div>
              );
            })}

            <div className="pt-3 mt-2 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold text-foreground tabular-nums">{total}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
