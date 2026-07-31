"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { SUBJECT_COLORS } from "@/lib/dashboard-types";

const NAVY = "#003070";
const SKY = "#50b0e0";
const SKY_LIGHT = "#7fc8ed";

type DayPoint = { date: string; label: string; count: number };
type SubjectPoint = { name: string; value: number };
type DowPoint = { name: string; count: number };

function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-card rounded-2xl border border-border p-5 sm:p-6 ${className || ""}`}>
      <div className="mb-4">
        <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "rgba(0, 48, 112, 0.95)",
  border: "none",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#fff",
  padding: "8px 12px",
};

const labelStyle = { color: "#fff", fontWeight: 600, marginBottom: "4px" };

export function MessagesAreaChart({ data }: { data: DayPoint[] }) {
  return (
    <ChartCard
      title="Demandes reçues"
      subtitle="30 derniers jours"
      className="lg:col-span-2"
    >
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={SKY} stopOpacity={0.4} />
              <stop offset="95%" stopColor={SKY} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={labelStyle}
            formatter={(v: number) => [`${v} demande${v > 1 ? "s" : ""}`, "Reçues"]}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={NAVY}
            strokeWidth={2}
            fill="url(#colorCount)"
            dot={false}
            activeDot={{ r: 5, fill: NAVY, stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SubjectPieChart({ data }: { data: SubjectPoint[] }) {
  return (
    <ChartCard title="Par thématique" subtitle="Répartition des demandes">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={SUBJECT_COLORS[entry.name] || SKY_LIGHT}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={labelStyle}
            formatter={(v: number, n: string) => [`${v} demande${v > 1 ? "s" : ""}`, n]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: SUBJECT_COLORS[entry.name] || SKY_LIGHT }}
            />
            <span className="text-muted-foreground truncate">{entry.name}</span>
            <span className="ml-auto font-medium text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

export function DowBarChart({ data }: { data: DowPoint[] }) {
  return (
    <ChartCard title="Par jour de la semaine" subtitle="Activité cumulée">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={labelStyle}
            cursor={{ fill: "rgba(80, 176, 224, 0.08)" }}
            formatter={(v: number) => [`${v} demande${v > 1 ? "s" : ""}`, "Reçues"]}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.count > 0 ? NAVY : "rgba(0,48,112,0.2)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
