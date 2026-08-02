import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSettings, maybeCreateNotification } from "@/lib/settings-server";
import { sendAutoReply, sendNewMessageNotification, sendNewLeadNotification } from "@/lib/email";

// ─── Simple in-memory rate limiter ───────────────────────────
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // 3 requests per minute

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

// ─── HTML escape for email templates ─────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Trop de requêtes. Réessayez dans quelques minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const company =
      typeof body?.company === "string" && body.company.trim()
        ? body.company.trim()
        : null;
    const phone =
      typeof body?.phone === "string" && body.phone.trim() ? body.phone.trim() : null;
    const productId =
      typeof body?.productId === "string" && body.productId.trim()
        ? body.productId.trim()
        : null;
    const attachmentUrl =
      typeof body?.attachmentUrl === "string" && body.attachmentUrl.trim()
        ? body.attachmentUrl.trim()
        : null;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { ok: false, error: "Champs requis manquants." },
        { status: 400 }
      );
    }

    // Simple email format check
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json(
        { ok: false, error: "Adresse e-mail invalide." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "Message trop long (max 5000 caractères)." },
        { status: 400 }
      );
    }

    // Basic spam detection
    const spamPatterns = /[<>]script|javascript:|on\w+=/i;
    if (spamPatterns.test(name) || spamPatterns.test(subject)) {
      return NextResponse.json(
        { ok: false, error: "Contenu non autorisé détecté." },
        { status: 400 }
      );
    }

    // 1. Save the contact message
    const record = await db.contactMessage.create({
      data: {
        name,
        email,
        company,
        phone,
        subject,
        message:
          attachmentUrl
            ? `${message}\n\n--- Pièce jointe ---\n${attachmentUrl}`
            : message,
        productId,
      },
    });

    const settings = await getSettings();

    // 2. Create an in-app notification
    await maybeCreateNotification(
      "new_message",
      `Nouveau message de ${name}`,
      `Sujet : ${subject}${company ? ` · ${company}` : ""}`,
      `/?view=dashboard`,
      settings.notifyOnNewMessage
    );

    // 3. Auto-create a lead from the contact form if it looks like a business inquiry
    let leadCreated = false;
    try {
      const existingLead = await db.lead.findFirst({
        where: { email },
        orderBy: { createdAt: "desc" },
      });

      if (!existingLead) {
        // Use valid source values from the leads API
        const source = productId ? "website" : "website";
        const lead = await db.lead.create({
          data: {
            name,
            email,
            phone: phone || null,
            company: company || null,
            source,
            status: "new",
            productId: productId || null,
            notes: `Créé automatiquement depuis le formulaire de contact.\nSujet : ${subject}\nMessage : ${message.substring(0, 200)}${message.length > 200 ? "..." : ""}`,
          },
        });

        await db.leadActivity.create({
          data: {
            leadId: lead.id,
            type: "note",
            content: "Lead créé automatiquement depuis le formulaire de contact",
          },
        });

        leadCreated = true;

        await maybeCreateNotification(
          "new_lead",
          `Nouveau lead : ${name}`,
          `Source : ${productId ? "Produit" : "Contact"}${company ? ` · ${company}` : ""}`,
          `/?view=dashboard`,
          settings.notifyOnNewMessage
        );

        try {
          await sendNewLeadNotification(name, email, company, phone, productId);
        } catch (err) {
          console.error("[api/contact] sendNewLeadNotification error", err);
        }
      } else {
        await db.leadActivity.create({
          data: {
            leadId: existingLead.id,
            type: "note",
            content: `Nouveau message contact : ${subject}`,
          },
        });
      }
    } catch (leadErr) {
      console.error("[api/contact] lead creation error", leadErr);
    }

    // 4. Send auto-reply to the contact form submitter
    try {
      await sendAutoReply(name, email, subject);
    } catch (err) {
      console.error("[api/contact] sendAutoReply error", err);
    }

    // 5. Notify the team about the new message
    try {
      await sendNewMessageNotification(name, subject, company);
    } catch (err) {
      console.error("[api/contact] sendNewMessageNotification error", err);
    }

    return NextResponse.json({ ok: true, id: record.id, leadCreated });
  } catch (err) {
    console.error("[api/contact] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur. Réessayez ultérieurement." },
      { status: 500 }
    );
  }
}
