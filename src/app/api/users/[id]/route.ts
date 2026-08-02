import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  active: true,
  createdAt: true,
  updatedAt: true,
} as const;

const VALID_ROLES = new Set(["admin", "manager", "agent"]);

async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.hash(password, 10);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error("[api/users/[id] GET] error", err);
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
    const denied = await requireAdmin(req);
    if (denied) return denied;

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
      const email = body.email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json(
          { ok: false, error: "Email invalide." },
          { status: 400 }
        );
      }
      data.email = email;
    }

    if (typeof body?.password === "string" && body.password.length > 0) {
      if (body.password.length < 4) {
        return NextResponse.json(
          {
            ok: false,
            error: "Le mot de passe doit contenir au moins 4 caractères.",
          },
          { status: 400 }
        );
      }
      data.password = await hashPassword(body.password);
    }

    if (typeof body?.role === "string") {
      if (!VALID_ROLES.has(body.role)) {
        return NextResponse.json(
          { ok: false, error: "Rôle invalide." },
          { status: 400 }
        );
      }
      data.role = body.role;
    }

    if (typeof body?.active === "boolean") {
      data.active = body.active;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { ok: false, error: "Aucun champ à mettre à jour." },
        { status: 400 }
      );
    }

    const updated = await db.user.update({
      where: { id },
      data,
      select: userSelect,
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json(
        { ok: false, error: "Un utilisateur avec cet email existe déjà." },
        { status: 409 }
      );
    }
    // P2025: record not found on update
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }
    console.error("[api/users/[id] PATCH] error", err);
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
    const denied = await requireAdmin(req);
    if (denied) return denied;

    const { id } = await params;

    await db.user.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }
    console.error("[api/users/[id] DELETE] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
