import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const VALID_SOURCES = new Set(["website", "referral", "campaign", "other"]);
const VALID_STATUSES = new Set([
  "new",
  "contacted",
  "callback",
  "interested",
  "ordered",
  "lost",
]);

export async function GET(
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

    const lead = await db.lead.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
        activities: {
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, name: true, role: true } },
          },
        },
        appointments: {
          orderBy: { date: "desc" },
          include: {
            employee: { select: { id: true, name: true, email: true, role: true } },
          },
        },
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            employee: { select: { id: true, name: true, email: true, role: true } },
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { ok: false, error: "Lead introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, lead });
  } catch (err) {
    console.error("[api/leads/[id] GET] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

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

    // Get current lead for activity tracking
    const currentLead = await db.lead.findUnique({ where: { id } });
    if (!currentLead) {
      return NextResponse.json(
        { ok: false, error: "Lead introuvable." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (typeof body?.name === "string") {
      const name = body.name.trim();
      if (!name) {
        return NextResponse.json(
          { ok: false, error: "Le nom ne peut pas être vide." },
          { status: 400 }
        );
      }
      data.name = name;
    }

    if (typeof body?.email === "string") {
      const email = body.email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json(
          { ok: false, error: "Email invalide." },
          { status: 400 }
        );
      }
      data.email = email;
    }

    if (body?.phone !== undefined) {
      data.phone =
        typeof body.phone === "string" && body.phone.trim()
          ? body.phone.trim()
          : null;
    }

    if (body?.company !== undefined) {
      data.company =
        typeof body.company === "string" && body.company.trim()
          ? body.company.trim()
          : null;
    }

    if (typeof body?.source === "string") {
      if (!VALID_SOURCES.has(body.source)) {
        return NextResponse.json(
          { ok: false, error: "Source invalide." },
          { status: 400 }
        );
      }
      data.source = body.source;
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

    if (body?.productId !== undefined) {
      data.productId =
        typeof body.productId === "string" && body.productId.trim()
          ? body.productId.trim()
          : null;
    }

    if (body?.value !== undefined) {
      data.value =
        typeof body.value === "string" && body.value.trim()
          ? body.value.trim()
          : null;
    }

    if (body?.notes !== undefined) {
      data.notes =
        typeof body.notes === "string" && body.notes.trim()
          ? body.notes.trim()
          : null;
    }

    if (body?.assignedToId !== undefined) {
      data.assignedToId =
        typeof body.assignedToId === "string" && body.assignedToId.trim()
          ? body.assignedToId.trim()
          : null;
    }

    if (body?.nextFollowUp !== undefined) {
      data.nextFollowUp =
        typeof body.nextFollowUp === "string" && body.nextFollowUp.trim()
          ? new Date(body.nextFollowUp)
          : null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { ok: false, error: "Aucun champ à mettre à jour." },
        { status: 400 }
      );
    }

    const updated = await db.lead.update({
      where: { id },
      data,
      include: {
        createdBy: { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    // Log status change activity
    if (data.status && data.status !== currentLead.status) {
      await db.leadActivity.create({
        data: {
          leadId: id,
          userId,
          type: "status_change",
          content: `Statut changé`,
          oldValue: currentLead.status,
          newValue: data.status as string,
        },
      });
    }

    // Log assignment change
    if (data.assignedToId !== undefined && data.assignedToId !== currentLead.assignedToId) {
      await db.leadActivity.create({
        data: {
          leadId: id,
          userId,
          type: "assignment",
          content: `Lead assigné`,
          oldValue: currentLead.assignedToId || null,
          newValue: (data.assignedToId as string) || null,
        },
      });
    }

    return NextResponse.json({ ok: true, lead: updated });
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, error: "Lead introuvable." },
        { status: 404 }
      );
    }
    console.error("[api/leads/[id] PATCH] error", err);
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

    await db.lead.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, error: "Lead introuvable." },
        { status: 404 }
      );
    }
    console.error("[api/leads/[id] DELETE] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
