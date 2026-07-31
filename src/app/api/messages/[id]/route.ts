import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const VALID_STATUSES = new Set(["new", "in_progress", "treated", "archived"]);
const VALID_STAGES = new Set(["received", "qualified", "meeting", "client"]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { ok: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await req.json();
    const data: Record<string, string> = {};

    if (typeof body?.status === "string") {
      if (!VALID_STATUSES.has(body.status)) {
        return NextResponse.json(
          { ok: false, error: "Statut invalide." },
          { status: 400 }
        );
      }
      data.status = body.status;
    }

    if (typeof body?.stage === "string") {
      if (!VALID_STAGES.has(body.stage)) {
        return NextResponse.json(
          { ok: false, error: "Étape invalide." },
          { status: 400 }
        );
      }
      data.stage = body.stage;
    }

    if (typeof body?.tags === "string") {
      data.tags = body.tags;
    } else if (body?.tags === null) {
      data.tags = "";
    }

    if (typeof body?.notes === "string") {
      data.notes = body.notes;
    } else if (body?.notes === null) {
      data.notes = "";
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { ok: false, error: "Aucun champ à mettre à jour." },
        { status: 400 }
      );
    }

    const updated = await db.contactMessage.update({
      where: { id },
      data,
    });

    return NextResponse.json({ ok: true, message: updated });
  } catch (err) {
    console.error("[api/messages/[id] PATCH] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
