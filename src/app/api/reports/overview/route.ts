import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const MESSAGE_STATUS_ORDER = ["new", "in_progress", "treated", "archived"];
const LEAD_STATUS_ORDER = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "lost",
];
const LEAD_SOURCES = ["website", "referral", "campaign", "other"];
const CLIENT_TYPES = ["prospect", "client", "partner"];
const CLIENT_STATUSES = ["active", "inactive", "archived"];

type RecentActivity = {
  type: "message" | "lead" | "client";
  label: string;
  date: string;
};

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { ok: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const [messages, leads, clients, users] = await Promise.all([
      db.contactMessage.findMany({
        select: { id: true, status: true, name: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      db.lead.findMany({
        select: {
          id: true,
          status: true,
          source: true,
          productId: true,
          name: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      db.client.findMany({
        select: {
          id: true,
          type: true,
          status: true,
          name: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      db.user.findMany({
        select: { id: true, active: true },
      }),
    ]);

    // ---- Messages by status ----
    const messageCounts = new Map<string, number>(
      MESSAGE_STATUS_ORDER.map((s) => [s, 0])
    );
    for (const m of messages) {
      const key = messageCounts.has(m.status) ? m.status : "new";
      messageCounts.set(key, (messageCounts.get(key) || 0) + 1);
    }

    // ---- Leads by status / by source / by product ----
    const leadStatusCounts = new Map<string, number>(
      LEAD_STATUS_ORDER.map((s) => [s, 0])
    );
    const leadSourceCounts = new Map<string, number>(
      LEAD_SOURCES.map((s) => [s, 0])
    );
    const leadProductMap = new Map<string, number>();
    for (const l of leads) {
      const stKey = leadStatusCounts.has(l.status) ? l.status : "new";
      leadStatusCounts.set(stKey, (leadStatusCounts.get(stKey) || 0) + 1);

      const srcKey = leadSourceCounts.has(l.source) ? l.source : "other";
      leadSourceCounts.set(srcKey, (leadSourceCounts.get(srcKey) || 0) + 1);

      const prodKey = l.productId || "__none__";
      leadProductMap.set(prodKey, (leadProductMap.get(prodKey) || 0) + 1);
    }

    // ---- Clients by type / by status ----
    const clientTypeCounts = new Map<string, number>(
      CLIENT_TYPES.map((t) => [t, 0])
    );
    const clientStatusCounts = new Map<string, number>(
      CLIENT_STATUSES.map((s) => [s, 0])
    );
    for (const c of clients) {
      const tKey = clientTypeCounts.has(c.type) ? c.type : "prospect";
      clientTypeCounts.set(tKey, (clientTypeCounts.get(tKey) || 0) + 1);

      const sKey = clientStatusCounts.has(c.status) ? c.status : "active";
      clientStatusCounts.set(sKey, (clientStatusCounts.get(sKey) || 0) + 1);
    }

    // ---- Users ----
    const usersTotal = users.length;
    const usersActive = users.filter((u) => u.active).length;

    // ---- Recent activity (last 10 across messages+leads+clients) ----
    const recentEvents: RecentActivity[] = [
      ...messages.map((m) => ({
        type: "message" as const,
        label: `Nouveau message de ${m.name}`,
        date: m.createdAt.toISOString(),
      })),
      ...leads.map((l) => ({
        type: "lead" as const,
        label: `Nouveau lead : ${l.name}`,
        date: l.createdAt.toISOString(),
      })),
      ...clients.map((c) => ({
        type: "client" as const,
        label: `Nouveau client : ${c.name}`,
        date: c.createdAt.toISOString(),
      })),
    ];
    recentEvents.sort((a, b) => (a.date < b.date ? 1 : -1));
    const recentActivity = recentEvents.slice(0, 10);

    return NextResponse.json({
      ok: true,
      messages: {
        total: messages.length,
        new: messageCounts.get("new") || 0,
        inProgress: messageCounts.get("in_progress") || 0,
        treated: messageCounts.get("treated") || 0,
        archived: messageCounts.get("archived") || 0,
      },
      leads: {
        total: leads.length,
        new: leadStatusCounts.get("new") || 0,
        contacted: leadStatusCounts.get("contacted") || 0,
        qualified: leadStatusCounts.get("qualified") || 0,
        converted: leadStatusCounts.get("converted") || 0,
        lost: leadStatusCounts.get("lost") || 0,
        bySource: LEAD_SOURCES.map((source) => ({
          source,
          count: leadSourceCounts.get(source) || 0,
        })),
        byProduct: Array.from(leadProductMap.entries()).map(([key, count]) => ({
          productId: key === "__none__" ? null : key,
          count,
        })),
      },
      clients: {
        total: clients.length,
        prospects: clientTypeCounts.get("prospect") || 0,
        clients: clientTypeCounts.get("client") || 0,
        partners: clientTypeCounts.get("partner") || 0,
        active: clientStatusCounts.get("active") || 0,
        inactive: clientStatusCounts.get("inactive") || 0,
      },
      users: {
        total: usersTotal,
        active: usersActive,
      },
      recentActivity,
    });
  } catch (err) {
    console.error("[api/reports/overview GET] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
