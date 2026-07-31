import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const now = new Date();

    // ---- Stats ----
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonth = messages.filter((m) => new Date(m.createdAt) >= startOfMonth);
    const thisWeek = messages.filter((m) => new Date(m.createdAt) >= startOfWeek);
    const today = messages.filter((m) => new Date(m.createdAt) >= startOfToday);
    const lastMonth = messages.filter((m) => {
      const d = new Date(m.createdAt);
      return d >= startOfPrevMonth && d < startOfMonth;
    });

    const monthGrowth =
      lastMonth.length === 0
        ? thisMonth.length > 0
          ? 100
          : 0
        : Math.round(((thisMonth.length - lastMonth.length) / lastMonth.length) * 100);

    // ---- Time series: messages per day (last 30 days) ----
    const daysAgo30 = new Date(now);
    daysAgo30.setDate(daysAgo30.getDate() - 29);
    daysAgo30.setHours(0, 0, 0, 0);

    const byDayMap = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
      const d = new Date(daysAgo30);
      d.setDate(d.getDate() + i);
      byDayMap.set(d.toISOString().split("T")[0], 0);
    }
    messages.forEach((m) => {
      const d = new Date(m.createdAt);
      if (d >= daysAgo30) {
        const key = d.toISOString().split("T")[0];
        byDayMap.set(key, (byDayMap.get(key) || 0) + 1);
      }
    });
    const byDay = Array.from(byDayMap.entries()).map(([date, count]) => {
      const d = new Date(date);
      return {
        date,
        label: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
        count,
      };
    });

    // ---- Breakdown by subject keyword ----
    const subjectBuckets: Record<string, number> = {};
    messages.forEach((m) => {
      const s = m.subject.toLowerCase();
      let bucket = "Autre";
      if (/audit|contrôle|contrôle interne/.test(s)) bucket = "Audit";
      else if (/stratég|développ|croissance|business plan/.test(s)) bucket = "Stratégie";
      else if (/financ|fonds|capital|invest/.test(s)) bucket = "Finance";
      else if (/transform|digital|si/.test(s)) bucket = "Transformation";
      else if (/management|transition|organis/.test(s)) bucket = "Management";
      else if (/structur|jurid/.test(s)) bucket = "Structuration";
      subjectBuckets[bucket] = (subjectBuckets[bucket] || 0) + 1;
    });
    const bySubject = Object.entries(subjectBuckets)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // ---- Breakdown by day of week ----
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const byDowMap = new Map<string, number>([
      ["Lun", 0], ["Mar", 0], ["Mer", 0], ["Jeu", 0], ["Ven", 0], ["Sam", 0], ["Dim", 0],
    ]);
    messages.forEach((m) => {
      const d = new Date(m.createdAt).getDay();
      byDowMap.set(dayNames[d], (byDowMap.get(dayNames[d]) || 0) + 1);
    });
    const byDow = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((name) => ({
      name,
      count: byDowMap.get(name) || 0,
    }));

    // ---- Breakdown by status (new|in_progress|treated|archived) ----
    const statusOrder = ["new", "in_progress", "treated", "archived"];
    const byStatusMap = new Map<string, number>(
      statusOrder.map((s) => [s, 0])
    );
    messages.forEach((m) => {
      const s = byStatusMap.has(m.status) ? m.status : "new";
      byStatusMap.set(s, (byStatusMap.get(s) || 0) + 1);
    });
    const byStatus = statusOrder.map((status) => ({
      status,
      count: byStatusMap.get(status) || 0,
    }));

    // ---- Breakdown by stage (received|qualified|meeting|client) — funnel ----
    const stageOrder = ["received", "qualified", "meeting", "client"];
    const byStageMap = new Map<string, number>(
      stageOrder.map((s) => [s, 0])
    );
    messages.forEach((m) => {
      const st = byStageMap.has(m.stage) ? m.stage : "received";
      byStageMap.set(st, (byStageMap.get(st) || 0) + 1);
    });
    const byStage = stageOrder.map((stage) => ({
      stage,
      count: byStageMap.get(stage) || 0,
    }));

    // ---- Breakdown by product (null = "Non spécifié") ----
    const byProductMap = new Map<string, number>();
    messages.forEach((m) => {
      const key = m.productId || "__none__";
      byProductMap.set(key, (byProductMap.get(key) || 0) + 1);
    });
    const byProduct = Array.from(byProductMap.entries()).map(([key, count]) => ({
      productId: key === "__none__" ? null : key,
      count,
    }));

    return NextResponse.json({
      messages,
      stats: {
        total: messages.length,
        thisMonth: thisMonth.length,
        thisWeek: thisWeek.length,
        today: today.length,
        monthGrowth,
      },
      byDay,
      bySubject,
      byDow,
      byStatus,
      byStage,
      byProduct,
    });
  } catch (err) {
    console.error("[api/messages] error", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
