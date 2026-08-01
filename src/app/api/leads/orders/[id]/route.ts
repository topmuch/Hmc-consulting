import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const VALID_STATUSES = new Set(["in_progress", "delivered"]);

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

    const currentOrder = await db.order.findUnique({ where: { id } });
    if (!currentOrder) {
      return NextResponse.json(
        { ok: false, error: "Commande introuvable." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (typeof body?.contactName === "string") {
      const contactName = body.contactName.trim();
      if (!contactName) {
        return NextResponse.json(
          { ok: false, error: "Le nom du contact ne peut pas être vide." },
          { status: 400 }
        );
      }
      data.contactName = contactName;
    }

    if (body?.company !== undefined) {
      data.company =
        typeof body.company === "string" && body.company.trim()
          ? body.company.trim()
          : null;
    }

    if (typeof body?.products === "string") {
      const products = body.products.trim();
      if (!products) {
        return NextResponse.json(
          { ok: false, error: "Les produits commandés ne peuvent pas être vides." },
          { status: 400 }
        );
      }
      data.products = products;
    }

    if (typeof body?.quantity === "number" && body.quantity > 0) {
      data.quantity = body.quantity;
    }

    if (body?.packagePrice !== undefined) {
      data.packagePrice =
        typeof body.packagePrice === "string" && body.packagePrice.trim()
          ? body.packagePrice.trim()
          : null;
    }

    if (body?.deliveryDate !== undefined) {
      data.deliveryDate =
        typeof body.deliveryDate === "string" && body.deliveryDate.trim()
          ? new Date(body.deliveryDate)
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

    const updated = await db.order.update({
      where: { id },
      data,
      include: {
        employee: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    // Log status change activity on lead
    if (data.status && data.status !== currentOrder.status) {
      const statusLabels: Record<string, string> = {
        in_progress: "En cours",
        delivered: "Livré",
      };
      await db.leadActivity.create({
        data: {
          leadId: currentOrder.leadId,
          userId,
          type: "status_change",
          content: `Commande : statut changé à ${statusLabels[data.status as string] || data.status}`,
        },
      });
    }

    return NextResponse.json({ ok: true, order: updated });
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, error: "Commande introuvable." },
        { status: 404 }
      );
    }
    console.error("[api/leads/orders/[id] PATCH] error", err);
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

    await db.order.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, error: "Commande introuvable." },
        { status: 404 }
      );
    }
    console.error("[api/leads/orders/[id] DELETE] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
