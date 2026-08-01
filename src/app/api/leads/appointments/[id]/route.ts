import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const VALID_STATUSES = new Set(["planned", "completed", "cancelled"]);

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
    const userId = session.user?.id || null;

    const currentAppointment = await db.appointment.findUnique({ where: { id } });
    if (!currentAppointment) {
      return NextResponse.json(
        { ok: false, error: "Rendez-vous introuvable." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (typeof body?.date === "string" && body.date.trim()) {
      data.date = new Date(body.date.trim());
    }
    if (body?.time !== undefined) {
      data.time =
        typeof body.time === "string" && body.time.trim()
          ? body.time.trim()
          : null;
    }
    if (body?.location !== undefined) {
      data.location =
        typeof body.location === "string" && body.location.trim()
          ? body.location.trim()
          : null;
    }
    if (body?.contactName !== undefined) {
      data.contactName =
        typeof body.contactName === "string" && body.contactName.trim()
          ? body.contactName.trim()
          : null;
    }
    if (body?.company !== undefined) {
      data.company =
        typeof body.company === "string" && body.company.trim()
          ? body.company.trim()
          : null;
    }
    if (body?.notes !== undefined) {
      data.notes =
        typeof body.notes === "string" && body.notes.trim()
          ? body.notes.trim()
          : null;
    }
    if (typeof body?.status === "string") {
      if (!VALID_STATUSES.has(body.status)) {
        return NextResponse.json(
          { ok: false, error: "Statut invalide." },
          { status: 400 }
        );
      }
      data.status = body.status;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { ok: false, error: "Aucun champ à mettre à jour." },
        { status: 400 }
      );
    }

    const updated = await db.appointment.update({
      where: { id },
      data,
      include: {
        employee: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    // Log status change activity on lead
    if (data.status && data.status !== currentAppointment.status) {
      const statusLabels: Record<string, string> = {
        planned: "Planifié",
        completed: "Terminé",
        cancelled: "Annulé",
      };
      await db.leadActivity.create({
        data: {
          leadId: currentAppointment.leadId,
          userId,
          type: "meeting",
          content: `Rendez-vous ${statusLabels[data.status as string] || data.status}`,
        },
      });
    }

    return NextResponse.json({ ok: true, appointment: updated });
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, error: "Rendez-vous introuvable." },
        { status: 404 }
      );
    }
    console.error("[api/leads/appointments/[id] PATCH] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await db.appointment.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, error: "Rendez-vous introuvable." },
        { status: 404 }
      );
    }
    console.error("[api/leads/appointments/[id] DELETE] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
