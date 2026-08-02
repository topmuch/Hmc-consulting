import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getSession, requireManager } from "@/lib/auth";

const VALID_TYPES = new Set(["prospect", "client", "partner"]);
const VALID_STATUSES = new Set(["active", "inactive", "archived"]);

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
    const search = url.searchParams.get("search")?.trim() || "";
    const type = url.searchParams.get("type")?.trim() || "";
    const status = url.searchParams.get("status")?.trim() || "";

    const where: Prisma.ClientWhereInput = {};

    if (type && VALID_TYPES.has(type)) {
      where.type = type;
    }
    if (status && VALID_STATUSES.has(status)) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
      ];
    }

    const clients = await db.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, clients });
  } catch (err) {
    console.error("[api/clients GET] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const denied = await requireManager(req);
    if (denied) return denied;

    const body = await req.json();

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";

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

    const company =
      typeof body?.company === "string" && body.company.trim()
        ? body.company.trim()
        : null;
    const phone =
      typeof body?.phone === "string" && body.phone.trim()
        ? body.phone.trim()
        : null;
    const type =
      typeof body?.type === "string" && VALID_TYPES.has(body.type)
        ? body.type
        : "prospect";
    const status =
      typeof body?.status === "string" && VALID_STATUSES.has(body.status)
        ? body.status
        : "active";
    const address =
      typeof body?.address === "string" && body.address.trim()
        ? body.address.trim()
        : null;
    const notes =
      typeof body?.notes === "string" && body.notes.trim()
        ? body.notes.trim()
        : null;

    const created = await db.client.create({
      data: {
        name,
        email,
        company,
        phone,
        type,
        status,
        address,
        notes,
      },
    });

    return NextResponse.json({ ok: true, client: created }, { status: 201 });
  } catch (err) {
    console.error("[api/clients POST] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
