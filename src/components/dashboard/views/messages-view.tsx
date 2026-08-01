"use client";

import { motion } from "framer-motion";
import { Inbox, Mail } from "lucide-react";
import type { ContactMessage, DashboardData } from "@/lib/dashboard-types";
import { MessagesTable } from "../messages-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "./_shared";

export function MessagesView({
  data,
  loading,
  onMessageUpdated,
  onRetry,
}: {
  data: DashboardData | null;
  loading: boolean;
  onMessageUpdated?: (updated: ContactMessage) => void;
  onRetry?: () => void;
}) {
  const total = data?.messages?.length ?? 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
              Messages
            </h1>
            {!loading && data && (
              <Badge
                variant="secondary"
                className="text-xs font-medium tabular-nums"
              >
                {total} message{total > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Tous les messages reçus via le formulaire de contact
          </p>
        </div>
      </motion.div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-xl border border-sky-200/60 bg-sky-50 px-4 py-3 text-sm text-sky-800 flex items-center gap-2.5"
      >
        <Mail className="h-4 w-4 shrink-0" />
        <span>
          Tous les messages envoyés via le formulaire de contact arrivent ici
          automatiquement.
        </span>
      </motion.div>

      {loading ? (
        <MessagesViewSkeleton />
      ) : data ? (
        <MessagesTable
          messages={data.messages}
          onMessageUpdated={onMessageUpdated}
        />
      ) : (
        <ErrorState onRetry={onRetry} />
      )}
    </>
  );
}

function MessagesViewSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-12 rounded-xl" />
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-48" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
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
    </div>
  );
}
