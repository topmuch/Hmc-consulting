import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Select object so we NEVER leak the password field
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

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { ok: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const users = await db.user.findMany({
      select: userSelect,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, users });
  } catch (err) {
    console.error("[api/users GET] error", err);
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

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!name) {
      return NextResponse.json(
        { ok: false, error: "Le nom est obligatoire." },
        { status: 400 }
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Un email valide est obligatoire." },
        { status: 400 }
      );
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        {
          ok: false,
          error: "Le mot de passe doit contenir au moins 6 caractères.",
        },
        { status: 400 }
      );
    }

    const role =
      typeof body?.role === "string" && VALID_ROLES.has(body.role)
        ? body.role
        : "agent";
    const active = typeof body?.active === "boolean" ? body.active : true;

    // Hash password with bcrypt
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const created = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        active,
      },
      select: userSelect,
    });

    return NextResponse.json({ ok: true, user: created }, { status: 201 });
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
    console.error("[api/users POST] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
