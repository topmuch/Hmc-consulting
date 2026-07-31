# Worklog — Dashboard Features Implementation

## Context
Building 10 dashboard features for HMC site:
- P1: #1 Status, #21 CSV Export, #29 Auto-reply, #17 Product stats
- P2: #5 Tags, #3 Reply from dashboard, #9 Funnel
- P3: #26 Auth, #13 Email notifications, #22 PDF report

## Schema (DONE)
ContactMessage now has: productId?, status (new|in_progress|treated|archived), stage (received|qualified|meeting|client), tags?, notes?, updatedAt
SiteSetting now has: smtpHost?, smtpPort?, smtpUser?, smtpPass?, smtpFrom?, adminPassword?, autoReplyEnabled
New model: EmailLog (id, to, subject, body, type, status, messageId?, createdAt)

## Lib (DONE)
- `src/lib/email.ts`: sendEmail(), sendAutoReply(), sendNewMessageNotification()
- `src/lib/auth.ts`: getSession(), login(), logout(), COOKIE_NAME
- `src/lib/settings-types.ts`: SiteSettings updated with SMTP/auth fields, STATUS_LABELS, STATUS_COLORS, STAGE_LABELS
- `src/lib/settings-server.ts`: getSettings() updated

## Types & contracts for subagents

### ContactMessage (from DB):
```ts
{ id, name, email, company?, phone?, subject, message, productId?, status, stage, tags?, notes?, createdAt, updatedAt }
```

### Dashboard API (GET /api/messages) returns:
```ts
{
  messages: ContactMessage[],
  stats: { total, thisMonth, thisWeek, today, monthGrowth },
  byDay: [{date,label,count}],
  bySubject: [{name,value}],
  byDow: [{name,count}],
  // NEW:
  byStatus: [{status, count}],         // new|in_progress|treated|archived
  byStage: [{stage, count}],           // received|qualified|meeting|client (funnel)
  byProduct: [{productId, count}],     // product stats
}
```

### Auth API:
- POST /api/auth/login {password} → {ok:true} sets cookie
- POST /api/auth/logout → {ok:true}
- GET /api/auth/me → {authenticated: boolean}

### Messages update API:
- PATCH /api/messages/[id] {status?, stage?, tags?, notes?} → {ok, message}

### Reply API:
- POST /api/messages/[id]/reply {body} → sends email, returns {ok}

### Export API:
- GET /api/messages/export → CSV file (Content-Type: text/csv)

### Report API:
- GET /api/messages/report?month=YYYY-MM → HTML report (printable)

### Default admin password: "hmc2024" (env ADMIN_PASSWORD)

## API Routes (DONE — task "api")

All 10 API routes created/updated. `bun run lint` passes with no errors.

### Files created/updated:
1. `src/app/api/contact/route.ts` (POST) — UPDATED
   - Accepts `productId` (optional string) in body, stored on ContactMessage
   - After DB save + notification, calls `sendAutoReply(name, email, subject)` (respects `autoReplyEnabled`)
   - Calls `sendNewMessageNotification(name, subject, company)` (respects `notifyOnNewMessage`)
   - Both email calls are wrapped in try/catch so failures don't break the 200 response
   - Existing `maybeCreateNotification` kept intact

2. `src/app/api/messages/route.ts` (GET) — UPDATED
   - Now requires auth via `getSession(req)` → 401 if not authenticated
   - Added `byStatus`: array of `{ status, count }` for `new|in_progress|treated|archived`
   - Added `byStage`: array of `{ stage, count }` for `received|qualified|meeting|client` (funnel)
   - Added `byProduct`: array of `{ productId, count }` (null productId = "Non spécifié")
   - All existing aggregates (byDay/bySubject/byDow/stats) preserved

3. `src/app/api/messages/[id]/route.ts` (PATCH) — CREATED
   - Auth-protected
   - Accepts `{ status?, stage?, tags?, notes? }`
   - Validates `status` ∈ new|in_progress|treated|archived and `stage` ∈ received|qualified|meeting|client
   - `null` tags/notes are coerced to "" (DB column is String?)
   - Returns `{ ok: true, message: updatedMessage }`

4. `src/app/api/messages/[id]/reply/route.ts` (POST) — CREATED
   - Auth-protected
   - Accepts `{ body: string }` (the reply email body)
   - Loads original message → sends email via `sendEmail()` with `type="reply"`
   - Subject = `Re: {original subject}`, To = original message email
   - HTML body styled with HMC navy/sky theme, message escaped with `escapeHtml()`
   - `messageId` set to original.id for EmailLog traceability
   - Returns `{ ok: true }`

5. `src/app/api/messages/export/route.ts` (GET) — CREATED
   - Auth-protected
   - Returns CSV with UTF-8 BOM for Excel compatibility
   - Headers: `Content-Type: text/csv; charset=utf-8`, `Content-Disposition: attachment; filename="hmc-messages.csv"`
   - Columns: Date, Nom, Email, Société, Téléphone, Sujet, Message, Produit, Statut, Étape, Tags, Notes
   - RFC 4180 escaping (quotes doubled, fields quoted when needed)
   - Status/Stage translated via STATUS_LABELS/STAGE_LABELS, Produit resolved via getProductById
   - Ordered by createdAt desc

6. `src/app/api/messages/report/route.ts` (GET) — CREATED
   - Auth-protected
   - Query param `month` (YYYY-MM, defaults to current month)
   - Returns HTML (Content-Type: text/html) with inline CSS — navy (#003070) + sky blue (#50b0e0) theme
   - HMC header (logo + site name + "Rapport d'activité — {Month Year}")
   - Summary: total messages, by status (pills), by product (count badges)
   - Table of all messages from that month (date, contact, email, subject, product, status, stage)
   - Print button (`onclick="window.print()"`) + `@media print` styles to hide it on paper
   - All dynamic values escaped with `escapeHtml()`

7. `src/app/api/auth/login/route.ts` (POST) — CREATED
   - Imports `login` from `@/lib/auth` and delegates to `login(req)`

8. `src/app/api/auth/logout/route.ts` (POST) — CREATED
   - Imports `logout` from `@/lib/auth` and delegates to `logout()`

9. `src/app/api/auth/me/route.ts` (GET) — CREATED
   - Calls `getSession(req)` → returns `{ authenticated: boolean }`

10. `src/app/api/settings/route.ts` (PUT) — UPDATED
    - Added handling for: smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom, adminPassword (via `str()` helper)
    - Added `autoReplyEnabled` (typeof boolean check)
    - Added email format validation for `smtpFrom`
    - PUT response object now includes all new fields (smtp*, adminPassword, autoReplyEnabled) for consistency
    - GET handler untouched (already returns full settings via `getSettings()`)

### Notes / decisions:
- All routes use `export async function GET/POST/PATCH` with proper Next.js 16 signatures
- Dynamic route params declared as `Promise<{ id: string }>` and awaited
- `getSession(req)` is the single source of truth for auth (returns `{ authenticated: boolean }`)
- Default admin password still `"hmc2024"` (overridable via `ADMIN_PASSWORD` env or `adminPassword` setting)
- Email-sending failures in contact POST are caught and logged — they do not break the public contact form submission
- CSV uses `\r\n` line endings (Excel-friendly) + UTF-8 BOM (`\uFEFF`)
- HTML report uses `escapeHtml()` for all interpolated values to prevent XSS

### Verification:
- `bun run lint` → passes with no errors

## Dashboard UI (DONE — task "ui-dashboard")

All 10 dashboard UI features implemented. `bun run lint` passes with no errors. No new TypeScript errors in any dashboard-related file.

### Files created/updated:

1. `src/lib/dashboard-types.ts` — UPDATED
   - `ContactMessage` extended with `productId`, `status`, `stage`, `tags`, `notes`, `updatedAt`
   - `DashboardData` extended with `byStatus`, `byStage`, `byProduct` arrays
   - Added `MessageStatus` and `MessageStage` union types
   - Existing `SUBJECT_COLORS` map preserved

2. `src/components/dashboard/login-view.tsx` — CREATED (Feature #26)
   - Centered login card on a navy→sky-blue gradient background, HMC logo in header
   - Password input with lock icon, "Se connecter" button (loading state via Loader2)
   - Calls `POST /api/auth/login` with `{password}`
   - Shows inline error from API response (e.g. "Mot de passe incorrect")
   - On success calls `onSuccess` (which triggers `useAuth.reload`)
   - Password hint banner displays default password `hmc2024`
   - Framer-motion fade-in for the card and error message

3. `src/components/dashboard/funnel-chart.tsx` — CREATED (Feature #9)
   - Visual funnel of 4 stages: Reçu → Qualifié → Rendez-vous → Client signé (uses `STAGE_LABELS`)
   - Reads `byStage` data, ordered via `STAGE_ORDER` constant
   - Each row: numbered circle (navy→sky gradient through stages: `#003070`, `#1f5fa8`, `#3a93c8`, `#50b0e0`), label, count + percentage of total
   - Funnel effect: each subsequent bar max width is reduced by 8% AND scaled by count/maxCount
   - Animated via framer-motion (initial width: 0 → final width)
   - Footer row showing total count

4. `src/components/dashboard/product-stats.tsx` — CREATED (Feature #17)
   - Horizontal bar chart of messages by product, reads `byProduct` data
   - Resolves product name/icon via `getProductById(id)`; null/undefined productId → "Non spécifié" with `Package` icon
   - Sorted by count desc, "Non spécifié" pinned at bottom
   - Each row: icon (in product's accentHex tint), name, count, percentage of total
   - Bar color = `product.accentHex` (falls back to navy/sky alternation)
   - Animated bar fill, footer row showing total

5. `src/components/dashboard/messages-table.tsx` — UPDATED (Features #1, #5, #3, #9, #10)
   - Imports `STATUS_LABELS, STATUS_COLORS, STAGE_LABELS` from `@/lib/settings-types`
   - Imports `getProductById` from `@/lib/products-data`
   - New optional prop `onMessageUpdated?: (updated: ContactMessage) => void` for parent state sync
   - **Status column** (Feature #1): renders `StatusBadge` (color-coded pill from `STATUS_COLORS`)
   - **Status dropdown** (Feature #1): clicking the badge opens a `DropdownMenu` with the 4 status options; optimistic local update + revert on failure; calls `PATCH /api/messages/[id]` with `{status}`
   - **Status filter** (Feature #1): `Select` at the top right with options `Tous les statuts / Nouveau / En cours / Traité / Archivé`; filter applied via `useMemo` alongside text search
   - **Tags section** (Feature #5): in the detail dialog, shows existing tags as removable `Badge`s (X button), Input + "Ajouter" button; Enter key adds a tag; saves via `PATCH /api/messages/[id]` with `{tags: "tag1,tag2,..."}` (silent, no toast); shows spinner while saving
   - **Reply section** (Feature #3): textarea pre-filled with "Bonjour {firstName},"; "Envoyer la réponse" button calls `POST /api/messages/[id]/reply` with `{body}`; subject auto-set server-side to "Re: {original subject}"; loading state and success/error toast; secondary "Ouvrir dans le client mail" mailto button preserved
   - **Stage selector** (Feature #9): `Select` dropdown in the detail dialog showing all 4 stages; optimistic update + PATCH `{stage}`
   - **Internal notes** (Feature #10): `Textarea` for notes, auto-saves on blur via PATCH `{notes}` (silent); shows "Non enregistré" hint when local != server value; spinner while saving
   - Dialog widened to `max-w-2xl` to fit all sections; detail header still shows initials avatar

6. `src/components/dashboard/dashboard.tsx` — UPDATED (Features #26, #21, #22, layout)
   - Added `useAuth` hook (defined inline) that calls `GET /api/auth/me` on mount and returns `{state: "checking"|"authenticated"|"unauthenticated", reload}`
     - Note: the auth check inside the effect uses an IIFE pattern (`void (async () => {...})()`) to satisfy the `react-hooks/set-state-in-effect` lint rule
   - When `state === "checking"` → shows spinner overlay ("Vérification de la session…")
   - When `state === "unauthenticated"` → renders `<LoginView onSuccess={reloadAuth} />`
   - When `state === "authenticated"` → renders the full dashboard; `fetchData` checks for 401 and triggers `reloadAuth` (session expired)
   - **Logout button** in header (Feature #26): "Déconnexion" with `LogOut` icon; calls `POST /api/auth/logout` then `reloadAuth()`
   - **Export CSV button** (Feature #21): "Exporter CSV" with `Download` icon; fetches `/api/messages/export`, converts response to Blob, creates an object URL, programmatically clicks a hidden `<a download="hmc-messages.csv">`, then revokes the URL; loading spinner on the button; success/error toast
   - **Monthly report button** (Feature #22): "Rapport" with `FileText` icon; computes current month as `YYYY-MM` and calls `window.open('/api/messages/report?month=YYYY-MM', '_blank')`
   - Header button order matches spec: `[Bell] [Actualiser] [Exporter CSV] [Rapport] [Paramètres] [Déconnexion] [Site]`
   - **Layout** updated to the spec:
     - Stats cards (4)
     - Charts row 1: `MessagesAreaChart` (2/3) + `SubjectPieChart` (1/3)
     - Charts row 2 (NEW): `FunnelChart` (1/3) + `ProductStats` (1/3) + `DowBarChart` (1/3)
     - Latest message card (preserved from before, only rendered if there's a message)
     - `MessagesTable` with `onMessageUpdated={handleLocalUpdate}` so optimistic/patched messages propagate to parent state without a full refetch
   - `DashboardSkeleton` updated with 3 rows of placeholders to match new layout

### Notes / decisions:
- All shadcn/ui primitives reused (Badge, Button, Dialog, DropdownMenu, Input, Textarea, Label, Select, Skeleton, useToast)
- Status badge is implemented as a plain `<span>` (using `STATUS_COLORS` classes) rather than the shadcn `Badge` component because the color classes include both bg and text colors — the shadcn `Badge` variant system would override them
- Optimistic updates: status/stage changes update local state immediately and revert on API failure (with an error toast)
- Tags/notes save silently (no success toast) to avoid noise on every keystroke-blur; only errors surface a toast
- Reply "subject" is intentionally NOT shown as an input — the spec says it's auto-set to `Re: {original subject}`, which the API enforces. A small "Re: {subject}" hint is shown in the reply section header
- The "Ouvrir dans le client mail" mailto link is kept as a secondary option so users can still use their own mail client
- Auth gate is at the Dashboard component level (not in `view-switcher.tsx`) — the Dashboard mounts, calls `/api/auth/me`, and conditionally renders LoginView or the dashboard
- `useAuth` uses an IIFE pattern inside `useEffect` to avoid the React Compiler's `set-state-in-effect` lint error while still doing the initial session check on mount
- Existing notification bell, BackToTop component (still mounted at the page level outside the dashboard), and toast system are unchanged
- `LatestMessageCard` is kept but moved out of the `charts row 2` grid (now sits between the charts and the messages table) so the row 2 grid cleanly hosts the 3 charts specified in the layout

### Verification:
- `bun run lint` → passes with no errors (exit code 0)
- `bunx tsc --noEmit` → no errors in any dashboard, types, or lib file touched by this task (pre-existing unrelated errors in `src/lib/auth.ts`, `src/lib/email.ts`, `skills/`, `examples/` remain)
