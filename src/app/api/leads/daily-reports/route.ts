import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/leads/daily-reports?userId=xxx&date=2024-01-15
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session.authenticated) {
      return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
    }

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId")?.trim() || "";
    const dateStr = url.searchParams.get("date")?.trim() || "";

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (dateStr) {
      const d = new Date(dateStr);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      where.date = { gte: d, lt: nextDay };
    }

    const reports = await db.dailyReport.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    return NextResponse.json({ ok: true, reports });
  } catch (err) {
    console.error("[api/leads/daily-reports GET] error", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/leads/daily-reports — create or update a daily report
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session.authenticated) {
      return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const userId = session.user?.id;
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Utilisateur non identifié" }, { status: 401 });
    }

    const content = typeof body?.content === "string" ? body.content.trim() : "";
    const dateStr = typeof body?.date === "string" ? body.date.trim() : new Date().toISOString().split("T")[0];
    const leadsCount = typeof body?.leadsCount === "number" ? body.leadsCount : 0;
    const callsCount = typeof body?.callsCount === "number" ? body.callsCount : 0;
    const meetingsCount = typeof body?.meetingsCount === "number" ? body.meetingsCount : 0;

    if (!content) {
      return NextResponse.json({ ok: false, error: "Le contenu du rapport est requis" }, { status: 400 });
    }

    const date = new Date(dateStr);

    // Upsert: one report per user per day
    const report = await db.dailyReport.upsert({
      where: {
        userId_date: { userId, date },
      },
      update: {
        content,
        leadsCount,
        callsCount,
        meetingsCount,
      },
      create: {
        userId,
        date,
        content,
        leadsCount,
        callsCount,
        meetingsCount,
      },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    return NextResponse.json({ ok: true, report });
  } catch (err) {
    console.error("[api/leads/daily-reports POST] error", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
