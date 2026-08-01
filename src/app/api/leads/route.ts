import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const VALID_SOURCES = new Set(["website", "referral", "campaign", "other"]);
const VALID_STATUSES = new Set([
  "new",
  "contacted",
  "qualified",
  "converted",
  "lost",
]);

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
    const status = url.searchParams.get("status")?.trim() || "";
    const source = url.searchParams.get("source")?.trim() || "";

    const where: Prisma.LeadWhereInput = {};

    if (status && VALID_STATUSES.has(status)) {
      where.status = status;
    }
    if (source && VALID_SOURCES.has(source)) {
      where.source = source;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
      ];
    }

    const leads = await db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, leads });
  } catch (err) {
    console.error("[api/leads GET] error", err);
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

    const phone =
      typeof body?.phone === "string" && body.phone.trim()
        ? body.phone.trim()
        : null;
    const company =
      typeof body?.company === "string" && body.company.trim()
        ? body.company.trim()
        : null;
    const source =
      typeof body?.source === "string" && VALID_SOURCES.has(body.source)
        ? body.source
        : "website";
    const status =
      typeof body?.status === "string" && VALID_STATUSES.has(body.status)
        ? body.status
        : "new";
    const productId =
      typeof body?.productId === "string" && body.productId.trim()
        ? body.productId.trim()
        : null;
    const value =
      typeof body?.value === "string" && body.value.trim()
        ? body.value.trim()
        : null;
    const notes =
      typeof body?.notes === "string" && body.notes.trim()
        ? body.notes.trim()
        : null;

    const created = await db.lead.create({
      data: {
        name,
        email,
        phone,
        company,
        source,
        status,
        productId,
        value,
        notes,
      },
    });

    return NextResponse.json({ ok: true, lead: created }, { status: 201 });
  } catch (err) {
    console.error("[api/leads POST] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
