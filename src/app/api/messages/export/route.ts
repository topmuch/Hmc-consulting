import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getProductById } from "@/lib/products-data";
import { STATUS_LABELS, STAGE_LABELS } from "@/lib/settings-types";

// CSV column headers
const COLUMNS = [
  "Date",
  "Nom",
  "Email",
  "Société",
  "Téléphone",
  "Sujet",
  "Message",
  "Produit",
  "Statut",
  "Étape",
  "Tags",
  "Notes",
] as const;

// Escape a CSV cell value (RFC 4180). Quote when it contains comma, quote, newline.
function csvCell(input: string | null | undefined): string {
  if (input === null || input === undefined) return "";
  const s = String(input);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { ok: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    const rows = messages.map((m) => {
      const product = m.productId ? getProductById(m.productId) : undefined;
      const productName = product?.name || m.productId || "";
      const statusLabel = STATUS_LABELS[m.status] || m.status;
      const stageLabel = STAGE_LABELS[m.stage] || m.stage;
      const date = new Date(m.createdAt).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return [
        date,
        m.name,
        m.email,
        m.company || "",
        m.phone || "",
        m.subject,
        m.message,
        productName,
        statusLabel,
        stageLabel,
        m.tags || "",
        m.notes || "",
      ]
        .map(csvCell)
        .join(",");
    });

    const header = COLUMNS.map(csvCell).join(",");
    const csv = [header, ...rows].join("\r\n");

    // Prepend BOM for Excel UTF-8 compatibility
    const bom = "\uFEFF";
    const csvWithBom = bom + csv;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="hmc-messages.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[api/messages/export] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
