import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const VALID_TYPES = new Set(["prospect", "client", "partner"]);
const VALID_STATUSES = new Set(["active", "inactive", "archived"]);

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

    const client = await db.client.findUnique({ where: { id } });

    if (!client) {
      return NextResponse.json(
        { ok: false, error: "Client introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, client });
  } catch (err) {
    console.error("[api/clients/[id] GET] error", err);
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

    if (body?.company !== undefined) {
      data.company =
        typeof body.company === "string" && body.company.trim()
          ? body.company.trim()
          : null;
    }

    if (body?.phone !== undefined) {
      data.phone =
        typeof body.phone === "string" && body.phone.trim()
          ? body.phone.trim()
          : null;
    }

    if (typeof body?.type === "string") {
      if (!VALID_TYPES.has(body.type)) {
        return NextResponse.json(
          { ok: false, error: "Type invalide." },
          { status: 400 }
        );
      }
      data.type = body.type;
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

    if (body?.address !== undefined) {
      data.address =
        typeof body.address === "string" && body.address.trim()
          ? body.address.trim()
          : null;
    }

    if (body?.notes !== undefined) {
      data.notes =
        typeof body.notes === "string" && body.notes.trim()
          ? body.notes.trim()
          : null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { ok: false, error: "Aucun champ à mettre à jour." },
        { status: 400 }
      );
    }

    const updated = await db.client.update({
      where: { id },
      data,
    });

    return NextResponse.json({ ok: true, client: updated });
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, error: "Client introuvable." },
        { status: 404 }
      );
    }
    console.error("[api/clients/[id] PATCH] error", err);
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

    await db.client.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, error: "Client introuvable." },
        { status: 404 }
      );
    }
    console.error("[api/clients/[id] DELETE] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
