import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getSettings, maybeCreateNotification } from "@/lib/settings-server";

// ─── POST: Create a new quote request ─────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const company =
      typeof body?.company === "string" && body.company.trim()
        ? body.company.trim()
        : null;
    const phone =
      typeof body?.phone === "string" && body.phone.trim()
        ? body.phone.trim()
        : null;
    const description =
      typeof body?.description === "string" ? body.description.trim() : "";
    const estimatedBudget =
      typeof body?.estimatedBudget === "string" && body.estimatedBudget.trim()
        ? body.estimatedBudget.trim()
        : null;
    const timeline =
      typeof body?.timeline === "string" && body.timeline.trim()
        ? body.timeline.trim()
        : null;

    // productIds should be an array of product ID strings
    const productIds: string[] = Array.isArray(body?.productIds)
      ? body.productIds.filter(
          (id: unknown) => typeof id === "string" && id.trim() !== ""
        )
      : [];

    if (!name || !email || productIds.length === 0 || !description) {
      return NextResponse.json(
        { ok: false, error: "Champs requis manquants (name, email, productIds, description)." },
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

    if (description.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "Description trop longue (max 5000 caractères)." },
        { status: 500 }
      );
    }

    // Store quote details as JSON in the notes field
    // productId="quote" on the ContactMessage itself, with the actual productIds in notes
    const quoteDetails = {
      productIds,
      estimatedBudget,
      timeline,
      description,
    };
    const notes = JSON.stringify(quoteDetails);

    // Create as ContactMessage with subject="Devis" and productId="quote"
    const record = await db.contactMessage.create({
      data: {
        name,
        email,
        company,
        phone,
        subject: "Devis",
        message: description,
        productId: "quote",
        notes,
      },
    });

    const settings = await getSettings();

    // Create in-app notification
    const productLabel = productIds.join(", ");
    await maybeCreateNotification(
      "new_message",
      `Nouvelle demande de devis de ${name}`,
      `Produits : ${productLabel}${company ? ` · ${company}` : ""}${estimatedBudget ? ` · Budget : ${estimatedBudget}` : ""}`,
      `/?view=dashboard`,
      settings.notifyOnNewMessage
    );

    // Auto-create a lead from the quote request
    try {
      const existingLead = await db.lead.findFirst({
        where: { email },
        orderBy: { createdAt: "desc" },
      });

      if (!existingLead) {
        const lead = await db.lead.create({
          data: {
            name,
            email,
            phone: phone || null,
            company: company || null,
            source: "website",
            status: "new",
            productId: productIds[0] || null,
            value: estimatedBudget || null,
            notes: `Créé automatiquement depuis le formulaire de devis.\nProduits : ${productIds.join(", ")}\nDescription : ${description.substring(0, 200)}${description.length > 200 ? "..." : ""}${timeline ? `\nDélai : ${timeline}` : ""}${estimatedBudget ? `\nBudget : ${estimatedBudget}` : ""}`,
          },
        });

        await db.leadActivity.create({
          data: {
            leadId: lead.id,
            type: "note",
            content: "Lead créé automatiquement depuis le formulaire de devis",
          },
        });

        await maybeCreateNotification(
          "new_lead",
          `Nouveau lead (devis) : ${name}`,
          `Produits : ${productLabel}${company ? ` · ${company}` : ""}`,
          `/?view=dashboard`,
          settings.notifyOnNewMessage
        );
      } else {
        await db.leadActivity.create({
          data: {
            leadId: existingLead.id,
            type: "note",
            content: `Nouvelle demande de devis pour : ${productIds.join(", ")}`,
          },
        });
      }
    } catch (leadErr) {
      console.error("[api/quotes] lead creation error", leadErr);
    }

    return NextResponse.json({ ok: true, id: record.id });
  } catch (err) {
    console.error("[api/quotes] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur. Réessayez ultérieurement." },
      { status: 500 }
    );
  }
}

// ─── GET: List all quote requests (admin only) ────────────────
export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const quotes = await db.contactMessage.findMany({
      where: {
        subject: "Devis",
        productId: "quote",
      },
      orderBy: { createdAt: "desc" },
    });

    // Parse the notes JSON for each quote
    const enriched = quotes.map((q) => {
      let quoteDetails: Record<string, unknown> = {};
      try {
        if (q.notes) {
          quoteDetails = JSON.parse(q.notes);
        }
      } catch {
        // ignore parse errors
      }

      return {
        ...q,
        productIds: Array.isArray(quoteDetails.productIds)
          ? quoteDetails.productIds
          : q.productId
            ? [q.productId]
            : [],
        estimatedBudget:
          (quoteDetails.estimatedBudget as string | null) || null,
        timeline: (quoteDetails.timeline as string | null) || null,
      };
    });

    return NextResponse.json({ ok: true, quotes: enriched });
  } catch (err) {
    console.error("[api/quotes] GET error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
