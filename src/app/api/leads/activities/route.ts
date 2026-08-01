import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const VALID_ACTIVITY_TYPES = new Set([
  "status_change",
  "note",
  "call",
  "email",
  "meeting",
  "assignment",
]);

// GET /api/leads/activities?leadId=xxx
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session.authenticated) {
      return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
    }

    const url = new URL(req.url);
    const leadId = url.searchParams.get("leadId")?.trim();

    if (!leadId) {
      return NextResponse.json({ ok: false, error: "leadId requis" }, { status: 400 });
    }

    const activities = await db.leadActivity.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, role: true } },
      },
    });

    return NextResponse.json({ ok: true, activities });
  } catch (err) {
    console.error("[api/leads/activities GET] error", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/leads/activities — add a note/call/email/meeting to a lead
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session.authenticated) {
      return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const leadId = typeof body?.leadId === "string" ? body.leadId.trim() : "";
    const type = typeof body?.type === "string" ? body.type.trim() : "";
    const content = typeof body?.content === "string" ? body.content.trim() : "";

    if (!leadId) {
      return NextResponse.json({ ok: false, error: "leadId requis" }, { status: 400 });
    }
    if (!VALID_ACTIVITY_TYPES.has(type)) {
      return NextResponse.json({ ok: false, error: "Type d'activité invalide" }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ ok: false, error: "Contenu requis" }, { status: 400 });
    }

    const userId = session.user?.id || null;

    const activity = await db.leadActivity.create({
      data: {
        leadId,
        userId,
        type,
        content,
      },
      include: {
        user: { select: { id: true, name: true, role: true } },
      },
    });

    return NextResponse.json({ ok: true, activity }, { status: 201 });
  } catch (err) {
    console.error("[api/leads/activities POST] error", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
