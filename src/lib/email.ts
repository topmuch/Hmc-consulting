import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings-server";

type SendEmailParams = {
  to: string;
  subject: string;
  body: string;
  type: string; // auto_reply | notification | reply | lead_notification
  messageId?: string;
};

type SmtpConfig = {
  host: string;
  port: string;
  user: string;
  pass: string;
  from: string;
};

/**
 * Send an email. If SMTP is configured in settings, sends via nodemailer.
 * Otherwise, logs to EmailLog table (status="logged") for demo purposes.
 * Returns the EmailLog record.
 */
export async function sendEmail({ to, subject, body, type, messageId }: SendEmailParams) {
  const settings = await getSettings();

  const smtp: SmtpConfig | null =
    settings.smtpHost && settings.smtpUser
      ? {
          host: settings.smtpHost,
          port: settings.smtpPort || "587",
          user: settings.smtpUser,
          pass: settings.smtpPass || "",
          from: settings.smtpFrom || settings.email,
        }
      : null;

  let status: "sent" | "logged" | "failed" = "logged";

  if (smtp) {
    try {
      // Dynamic import of nodemailer (only when SMTP is configured)
      const nodemailer: any = await import("nodemailer").catch(() => null);
      if (nodemailer) {
        const transporter = nodemailer.createTransport({
          host: smtp.host,
          port: parseInt(smtp.port, 10),
          secure: parseInt(smtp.port, 10) === 465,
          auth: { user: smtp.user, pass: smtp.pass },
        });
        await transporter.sendMail({
          from: smtp.from,
          to,
          subject,
          html: body,
        });
        status = "sent";
      } else {
        console.log("[email] nodemailer not installed, logging instead");
      }
    } catch (err) {
      console.error("[email] SMTP send failed:", err);
      status = "failed";
    }
  } else {
    console.log(`[email] (no SMTP) ${type} → ${to}: ${subject}`);
  }

  const log = await db.emailLog.create({
    data: { to, subject, body, type, status, messageId },
  });

  return log;
}

/**
 * Send an auto-reply confirmation email to a contact form submitter.
 */
export async function sendAutoReply(name: string, email: string, subject: string) {
  const settings = await getSettings();
  if (!settings.autoReplyEnabled) return null;

  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #003070; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">${settings.siteFullName}</h1>
        <p style="color: #50b0e0; margin: 4px 0 0; font-size: 13px;">${settings.tagline}</p>
      </div>
      <div style="background: #f8f9fa; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="color: #333; font-size: 15px;">Bonjour ${name},</p>
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          Nous avons bien reçu votre demande : <strong>« ${subject} »</strong>.
        </p>
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          Notre équipe vous recontactera dans les plus brefs délais pour répondre à vos besoins.
          Merci de votre confiance.
        </p>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0e0e0;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            ${settings.partner} — ${settings.partnerRole}<br/>
            📞 ${settings.phone} · ✉️ ${settings.email}<br/>
            Afrique & Océan Indien
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Confirmation de réception — ${settings.siteName}`,
    body,
    type: "auto_reply",
  });
}

/**
 * Send a notification email to the team about a new message.
 */
export async function sendNewMessageNotification(
  name: string,
  subject: string,
  company: string | null
) {
  const settings = await getSettings();
  if (!settings.notifyOnNewMessage) return null;

  const to = settings.notifyEmail || settings.email;
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #003070;">📨 Nouveau message reçu</h2>
      <table style="width: 100%; font-size: 14px; color: #333;">
        <tr><td style="padding: 4px 0; font-weight: 600;">De:</td><td>${name}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: 600;">Sujet:</td><td>${subject}</td></tr>
        ${company ? `<tr><td style="padding: 4px 0; font-weight: 600;">Société:</td><td>${company}</td></tr>` : ""}
      </table>
      <p style="margin-top: 16px;"><a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/?view=dashboard" style="background: #003070; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-block;">Voir dans le dashboard</a></p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Nouveau message de ${name}`,
    body,
    type: "notification",
  });
}

/**
 * Send a notification email to the team about a new lead created from contact form.
 */
export async function sendNewLeadNotification(
  name: string,
  email: string,
  company: string | null,
  phone: string | null,
  productId: string | null
) {
  const settings = await getSettings();
  if (!settings.notifyOnNewMessage) return null;

  const to = settings.notifyEmail || settings.email;
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #003070; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">🎯 Nouveau lead créé</h1>
        <p style="color: #50b0e0; margin: 4px 0 0; font-size: 13px;">Un lead a été automatiquement créé depuis le formulaire de contact</p>
      </div>
      <div style="background: #f8f9fa; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; font-size: 14px; color: #333;">
          <tr><td style="padding: 4px 0; font-weight: 600; width: 100px;">Nom:</td><td>${name}</td></tr>
          <tr><td style="padding: 4px 0; font-weight: 600;">Email:</td><td><a href="mailto:${email}" style="color: #003070;">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding: 4px 0; font-weight: 600;">Téléphone:</td><td>${phone}</td></tr>` : ""}
          ${company ? `<tr><td style="padding: 4px 0; font-weight: 600;">Société:</td><td>${company}</td></tr>` : ""}
          <tr><td style="padding: 4px 0; font-weight: 600;">Source:</td><td>${productId ? "Produit (" + productId + ")" : "Formulaire de contact"}</td></tr>
        </table>
        <p style="margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/?view=dashboard" style="background: #003070; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-block; margin-right: 8px;">Voir le lead</a>
          <a href="mailto:${email}" style="background: #50b0e0; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-block;">Répondre</a>
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `🎯 Nouveau lead : ${name}${company ? ` (${company})` : ""}`,
    body,
    type: "lead_notification",
  });
}
