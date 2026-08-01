import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const VALID_STATUSES = new Set(["in_progress", "delivered"]);

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
    const leadId = url.searchParams.get("leadId")?.trim() || "";

    const where: { leadId?: string } = {};
    if (leadId) where.leadId = leadId;

    const orders = await db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        employee: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    return NextResponse.json({ ok: true, orders });
  } catch (err) {
    console.error("[api/leads/orders GET] error", err);
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

    const contactName =
      typeof body?.contactName === "string" ? body.contactName.trim() : "";
    if (!contactName) {
      return NextResponse.json(
        { ok: false, error: "Le nom du contact est obligatoire." },
        { status: 400 }
      );
    }

    const products =
      typeof body?.products === "string" ? body.products.trim() : "";
    if (!products) {
      return NextResponse.json(
        { ok: false, error: "Les produits commandés sont obligatoires." },
        { status: 400 }
      );
    }

    const company =
      typeof body?.company === "string" && body.company.trim()
        ? body.company.trim()
        : null;
    const quantity =
      typeof body?.quantity === "number" && body.quantity > 0
        ? body.quantity
        : 1;
    const packagePrice =
      typeof body?.packagePrice === "string" && body.packagePrice.trim()
        ? body.packagePrice.trim()
        : null;
    const deliveryDate =
      typeof body?.deliveryDate === "string" && body.deliveryDate.trim()
        ? new Date(body.deliveryDate)
        : null;
    const status =
      typeof body?.status === "string" && VALID_STATUSES.has(body.status)
        ? body.status
        : "in_progress";

    const employeeId = session.user?.id || null;

    const created = await db.order.create({
      data: {
        leadId,
        contactName,
        company,
        products,
        quantity,
        packagePrice,
        deliveryDate,
        status,
        employeeId,
      },
      include: {
        employee: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    // Log activity on lead
    await db.leadActivity.create({
      data: {
        leadId,
        userId: employeeId,
        type: "status_change",
        content: `Commande créée : ${products} (x${quantity})${packagePrice ? ` — ${packagePrice}` : ""}`,
        newValue: "ordered",
      },
    });

    // Auto-update lead status to "ordered" if it's not already
    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (lead && lead.status !== "ordered") {
      await db.lead.update({
        where: { id: leadId },
        data: { status: "ordered" },
      });
    }

    return NextResponse.json({ ok: true, order: created }, { status: 201 });
  } catch (err) {
    console.error("[api/leads/orders POST] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
