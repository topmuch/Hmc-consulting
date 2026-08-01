"use client";

import { Mail, Phone, User } from "lucide-react";
import type { ContactMessage, DashboardData } from "@/lib/dashboard-types";
import { StatsCards } from "../stats-cards";
import { MessagesAreaChart, SubjectPieChart, DowBarChart } from "../charts";
import { MessagesTable } from "../messages-table";
import { FunnelChart } from "../funnel-chart";
import { ProductStats } from "../product-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "./_shared";

export function OverviewView({
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
  return (
    <>
      <div
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-2"
      >
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
            Vue d&apos;ensemble des demandes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Suivi en temps réel des messages reçus via le formulaire de contact.
          </p>
        </div>
        {data && data.messages.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Dernière mise à jour :{" "}
            {new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>

      {loading ? (
        <OverviewSkeleton />
      ) : data ? (
        <>
          {/* Stats */}
          <StatsCards
            total={data.stats.total}
            thisMonth={data.stats.thisMonth}
            thisWeek={data.stats.thisWeek}
            today={data.stats.today}
            monthGrowth={data.stats.monthGrowth}
          />

          {/* Charts row 1: Area (2/3) + Pie by subject (1/3) */}
          <div className="grid lg:grid-cols-3 gap-4">
            <MessagesAreaChart data={data.byDay} />
            <SubjectPieChart data={data.bySubject} />
          </div>

          {/* Charts row 2: Funnel + Product stats + Dow bar */}
          <div className="grid lg:grid-cols-3 gap-4">
            <FunnelChart data={data.byStage} />
            <ProductStats data={data.byProduct} />
            <DowBarChart data={data.byDow} />
          </div>

          {/* Latest contact highlight */}
          {data.messages[0] && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="h-8 w-1.5 rounded-full shrink-0 bg-gradient-to-b from-rose-500 to-orange-500" />
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    Dernier message reçu
                  </h3>
                </div>
              </div>
              <div className="p-5 sm:p-6 pt-3">
                <LatestMessageCard message={data.messages[0]} />
              </div>
            </div>
          )}

          {/* Messages table */}
          <MessagesTable
            messages={data.messages}
            onMessageUpdated={onMessageUpdated}
          />
        </>
      ) : (
        <ErrorState onRetry={onRetry} />
      )}
    </>
  );
}

function LatestMessageCard({ message }: { message: ContactMessage }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent font-medium shrink-0">
          {message.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="font-medium text-foreground truncate">
              {message.name}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {new Date(message.createdAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
          <div className="text-sm text-accent font-medium truncate">
            {message.subject}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {message.message}
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border">
        {message.company && (
          <span className="inline-flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {message.company}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Mail className="h-3.5 w-3.5" />
          {message.email}
        </span>
        {message.phone && (
          <span className="inline-flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            {message.phone}
          </span>
        )}
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Skeleton className="lg:col-span-2 h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}
