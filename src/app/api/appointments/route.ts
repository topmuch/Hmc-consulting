import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const VALID_STATUSES = new Set(["scheduled", "confirmed", "completed", "cancelled"]);

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { ok: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const date = url.searchParams.get("date")?.trim() || "";
    const status = url.searchParams.get("status")?.trim() || "";
    const employeeId = url.searchParams.get("employeeId")?.trim() || "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};

    if (status && VALID_STATUSES.has(status)) {
      where.status = status;
    }
    if (employeeId) {
      where.employeeId = employeeId;
    }
    if (date) {
      // Filter by date range (start of day to end of day)
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      where.date = { gte: start, lte: end };
    }

    const appointments = await db.appointment.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        lead: { select: { id: true, name: true, email: true, phone: true, company: true } },
        employee: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    return NextResponse.json({ ok: true, appointments });
  } catch (err) {
    console.error("[api/appointments GET] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { ok: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const leadId = typeof body?.leadId === "string" ? body.leadId.trim() : "";
    if (!leadId) {
      return NextResponse.json(
        { ok: false, error: "Le lead est obligatoire." },
        { status: 400 }
      );
    }

    const dateStr = typeof body?.date === "string" ? body.date.trim() : "";
    if (!dateStr) {
      return NextResponse.json(
        { ok: false, error: "La date du rendez-vous est obligatoire." },
        { status: 400 }
      );
    }

    const time =
      typeof body?.time === "string" && body.time.trim()
        ? body.time.trim()
        : null;
    const location =
      typeof body?.location === "string" && body.location.trim()
        ? body.location.trim()
        : null;
    const contactName =
      typeof body?.contactName === "string" && body.contactName.trim()
        ? body.contactName.trim()
        : null;
    const status =
      typeof body?.status === "string" && VALID_STATUSES.has(body.status)
        ? body.status
        : "scheduled";

    const employeeId =
      typeof body?.employeeId === "string" && body.employeeId.trim()
        ? body.employeeId.trim()
        : session.user?.id || null;

    const created = await db.appointment.create({
      data: {
        leadId,
        date: new Date(dateStr),
        time,
        location,
        contactName,
        employeeId,
        status,
      },
      include: {
        lead: { select: { id: true, name: true, email: true, phone: true, company: true } },
        employee: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    // Log activity on lead
    await db.leadActivity.create({
      data: {
        leadId,
        userId: employeeId,
        type: "meeting",
        content: `Rendez-vous planifié le ${new Date(dateStr).toLocaleDateString("fr-FR")}${time ? ` à ${time}` : ""}${location ? ` — ${location}` : ""}`,
      },
    });

    return NextResponse.json({ ok: true, appointment: created }, { status: 201 });
  } catch (err) {
    console.error("[api/appointments POST] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
