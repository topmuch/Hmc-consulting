import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSettings, maybeCreateNotification } from "@/lib/settings-server";
import { sendAutoReply, sendNewMessageNotification, sendNewLeadNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
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

    // 1. Save the contact message
    const record = await db.contactMessage.create({
      data: {
        name,
        email,
        company,
        phone,
        subject,
        message,
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
      // Check if a lead with the same email already exists
      const existingLead = await db.lead.findFirst({
        where: { email },
        orderBy: { createdAt: "desc" },
      });

      if (!existingLead) {
        // Determine source based on productId
        const source = productId ? "produit" : "contact_form";
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

        // Log activity
        await db.leadActivity.create({
          data: {
            leadId: lead.id,
            type: "note",
            description: "Lead créé automatiquement depuis le formulaire de contact",
          },
        });

        leadCreated = true;

        // Create in-app notification for new lead
        await maybeCreateNotification(
          "new_lead",
          `Nouveau lead : ${name}`,
          `Source : ${productId ? "Produit" : "Contact"}${company ? ` · ${company}` : ""}`,
          `/?view=dashboard`,
          settings.notifyOnNewMessage
        );

        // Send email notification about new lead
        try {
          await sendNewLeadNotification(name, email, company, phone, productId);
        } catch (err) {
          console.error("[api/contact] sendNewLeadNotification error", err);
        }
      } else {
        // Lead exists — log the new contact as an activity on the existing lead
        await db.leadActivity.create({
          data: {
            leadId: existingLead.id,
            type: "note",
            description: `Nouveau message contact : ${subject}`,
          },
        });
      }
    } catch (leadErr) {
      console.error("[api/contact] lead creation error", leadErr);
      // Don't fail the contact form if lead creation fails
    }

    // 4. Send auto-reply to the contact form submitter (respects autoReplyEnabled)
    try {
      await sendAutoReply(name, email, subject);
    } catch (err) {
      console.error("[api/contact] sendAutoReply error", err);
    }

    // 5. Notify the team about the new message (respects notifyOnNewMessage)
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
