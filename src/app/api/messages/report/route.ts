import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings-server";
import { getProductById } from "@/lib/products-data";
import { STATUS_LABELS, STAGE_LABELS } from "@/lib/settings-types";

const STATUS_ORDER = ["new", "in_progress", "treated", "archived"];
const STAGE_ORDER = ["received", "qualified", "meeting", "client"];

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseMonth(param: string | null): { year: number; month: number } {
  const now = new Date();
  if (!param) return { year: now.getFullYear(), month: now.getMonth() };
  const m = /^(\d{4})-(\d{2})$/.exec(param);
  if (!m) return { year: now.getFullYear(), month: now.getMonth() };
  const year = parseInt(m[1], 10);
  const month = parseInt(m[2], 10) - 1;
  if (month < 0 || month > 11) return { year: now.getFullYear(), month: now.getMonth() };
  return { year, month };
}

function monthLabel(year: number, month: number): string {
  const d = new Date(year, month, 1);
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
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

    const url = new URL(req.url);
    const { year, month } = parseMonth(url.searchParams.get("month"));

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 1);

    const messages = await db.contactMessage.findMany({
      where: {
        AND: [
          { createdAt: { gte: startOfMonth } },
          { createdAt: { lt: endOfMonth } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    const settings = await getSettings();

    // ---- Stats ----
    const total = messages.length;

    const byStatusMap = new Map<string, number>(
      STATUS_ORDER.map((s) => [s, 0])
    );
    messages.forEach((m) => {
      const key = byStatusMap.has(m.status) ? m.status : "new";
      byStatusMap.set(key, (byStatusMap.get(key) || 0) + 1);
    });

    const byProductMap = new Map<string, number>();
    messages.forEach((m) => {
      const key = m.productId || "__none__";
      byProductMap.set(key, (byProductMap.get(key) || 0) + 1);
    });

    const byProductEntries = Array.from(byProductMap.entries())
      .map(([key, count]) => {
        const productId = key === "__none__" ? null : key;
        const product = productId ? getProductById(productId) : undefined;
        const label = product?.name || (productId ?? "Non spécifié");
        return { label, count };
      })
      .sort((a, b) => b.count - a.count);

    // ---- HTML ----
    const monthName = monthLabel(year, month);
    const siteName = settings.siteName || "HMC";
    const siteFullName = settings.siteFullName || "Horizon Management Consulting";
    const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/hmc-logo.png`;

    // Status pills HTML
    const statusPills = STATUS_ORDER.map((s) => {
      const count = byStatusMap.get(s) || 0;
      const label = STATUS_LABELS[s] || s;
      return `<span class="pill"><strong>${count}</strong> ${escapeHtml(label)}</span>`;
    }).join("");

    // Products list HTML
    const productItems =
      byProductEntries.length === 0
        ? `<li class="empty">Aucun message</li>`
        : byProductEntries
            .map(
              (p) =>
                `<li><span class="count">${p.count}</span><span class="label">${escapeHtml(p.label)}</span></li>`
            )
            .join("");

    // Messages table rows
    const tableRows =
      messages.length === 0
        ? `<tr><td colspan="7" class="empty">Aucun message pour cette période.</td></tr>`
        : messages
            .map((m) => {
              const date = new Date(m.createdAt).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              const product = m.productId ? getProductById(m.productId) : undefined;
              const productLabel = product?.name || m.productId || "—";
              const statusLabel = STATUS_LABELS[m.status] || m.status;
              const stageLabel = STAGE_LABELS[m.stage] || m.stage;
              return `<tr>
                <td>${escapeHtml(date)}</td>
                <td>${escapeHtml(m.name)}${m.company ? `<br/><span class="muted">${escapeHtml(m.company)}</span>` : ""}</td>
                <td>${escapeHtml(m.email)}</td>
                <td>${escapeHtml(m.subject)}</td>
                <td>${escapeHtml(productLabel)}</td>
                <td>${escapeHtml(statusLabel)}</td>
                <td>${escapeHtml(stageLabel)}</td>
              </tr>`;
            })
            .join("");

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Rapport d'activité — ${escapeHtml(monthName)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      margin: 0;
      padding: 24px;
      color: #1f2937;
      background: #fff;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      background: linear-gradient(135deg, #003070 0%, #1a4a8a 100%);
      border-radius: 12px;
      color: #fff;
      margin-bottom: 24px;
    }
    .header img {
      width: 56px;
      height: 56px;
      border-radius: 8px;
      background: #fff;
      padding: 6px;
      object-fit: contain;
    }
    .header .titles h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
    }
    .header .titles p {
      margin: 4px 0 0;
      font-size: 13px;
      color: #50b0e0;
    }
    .toolbar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
    }
    .print-btn {
      background: #003070;
      color: #fff;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 48, 112, 0.2);
    }
    .print-btn:hover { background: #1a4a8a; }
    h2.section {
      color: #003070;
      font-size: 16px;
      margin: 24px 0 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid #50b0e0;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #003070;
      padding: 14px 16px;
      border-radius: 8px;
    }
    .stat-card .label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .stat-card .value {
      font-size: 26px;
      font-weight: 700;
      color: #003070;
      margin-top: 4px;
    }
    .pills { display: flex; flex-wrap: wrap; gap: 8px; }
    .pill {
      background: #eef6fc;
      border: 1px solid #cfe2f3;
      color: #003070;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 13px;
    }
    .pill strong { font-weight: 700; margin-right: 4px; }
    .product-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 8px;
    }
    .product-list li {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      border-radius: 6px;
    }
    .product-list .count {
      background: #003070;
      color: #fff;
      font-weight: 700;
      font-size: 13px;
      padding: 2px 8px;
      border-radius: 4px;
      min-width: 28px;
      text-align: center;
    }
    .product-list .label { font-size: 14px; color: #1f2937; }
    .product-list .empty { color: #94a3b8; font-style: italic; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 8px;
    }
    th, td {
      text-align: left;
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }
    th {
      background: #003070;
      color: #fff;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    tr:nth-child(even) td { background: #f8fafc; }
    td.empty { text-align: center; color: #94a3b8; font-style: italic; padding: 24px; }
    .muted { color: #64748b; font-size: 11px; }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #64748b;
      text-align: center;
    }
    @media print {
      body { padding: 0; }
      .toolbar { display: none; }
      .header { border-radius: 0; }
      .stat-card, .product-list li, table th, tr:nth-child(even) td {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(siteName)}" />
    <div class="titles">
      <h1>${escapeHtml(siteFullName)}</h1>
      <p>Rapport d'activité — ${escapeHtml(monthName)}</p>
    </div>
  </div>

  <div class="toolbar">
    <button class="print-btn" onclick="window.print()">🖨️ Imprimer</button>
  </div>

  <h2 class="section">Résumé</h2>
  <div class="summary-grid">
    <div class="stat-card">
      <div class="label">Messages totaux</div>
      <div class="value">${total}</div>
    </div>
    <div class="stat-card">
      <div class="label">Période</div>
      <div class="value" style="font-size: 16px; padding-top: 4px;">${escapeHtml(monthName)}</div>
    </div>
  </div>

  <h2 class="section">Par statut</h2>
  <div class="pills">${statusPills}</div>

  <h2 class="section">Par produit</h2>
  <ul class="product-list">${productItems}</ul>

  <h2 class="section">Détail des messages</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Contact</th>
        <th>Email</th>
        <th>Sujet</th>
        <th>Produit</th>
        <th>Statut</th>
        <th>Étape</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <div class="footer">
    ${escapeHtml(siteFullName)} — Rapport généré le ${new Date().toLocaleString("fr-FR")}
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[api/messages/report] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
