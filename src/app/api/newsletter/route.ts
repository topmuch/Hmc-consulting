import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// ─── Simple in-memory rate limiter ───────────────────────────
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

// ─── GET: List all newsletter subscribers (admin) ──────────
export async function GET(req: NextRequest) {
  try {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    const subscribers = await db.contactMessage.findMany({
      where: {
        productId: "newsletter",
        tags: "newsletter",
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, subscribers });
  } catch (err) {
    console.error("[api/newsletter GET] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur. Réessayez ultérieurement." },
      { status: 500 }
    );
  }
}

// ─── POST: Subscribe to newsletter (public) ────────────────
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Trop de requêtes. Réessayez dans quelques minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    // Validate email
    if (!email) {
      return NextResponse.json(
        { ok: false, error: "L'adresse e-mail est requise." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Veuillez entrer une adresse e-mail valide." },
        { status: 400 }
      );
    }

    // Check for duplicate — look for existing newsletter subscription with same email
    const existing = await db.contactMessage.findFirst({
      where: {
        email,
        productId: "newsletter",
        tags: "newsletter",
      },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, error: "Cette adresse e-mail est déjà inscrite à notre newsletter." },
        { status: 409 }
      );
    }

    // Store using ContactMessage model with newsletter markers
    const record = await db.contactMessage.create({
      data: {
        name: "Newsletter Subscriber",
        email,
        subject: "Newsletter",
        message: `Inscription à la newsletter depuis le site web.`,
        productId: "newsletter",
        tags: "newsletter",
        status: "new",
        stage: "received",
      },
    });

    return NextResponse.json({
      ok: true,
      id: record.id,
      message: "Merci ! Vous êtes inscrit(e) à notre newsletter.",
    });
  } catch (err) {
    console.error("[api/newsletter] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur. Réessayez ultérieurement." },
      { status: 500 }
    );
  }
}

// ─── DELETE: Remove a newsletter subscriber (admin) ────────
export async function DELETE(req: NextRequest) {
  try {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID de l'abonné requis." },
        { status: 400 }
      );
    }

    // Verify the record is a newsletter subscriber
    const record = await db.contactMessage.findUnique({ where: { id } });

    if (!record || record.productId !== "newsletter" || record.tags !== "newsletter") {
      return NextResponse.json(
        { ok: false, error: "Abonné introuvable." },
        { status: 404 }
      );
    }

    await db.contactMessage.delete({ where: { id } });

    return NextResponse.json({ ok: true, message: "Abonné supprimé." });
  } catch (err) {
    console.error("[api/newsletter DELETE] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur. Réessayez ultérieurement." },
      { status: 500 }
    );
  }
}
