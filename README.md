# HMC — Horizon Management Consulting

> Cabinet de conseil et de management dédié aux entreprises.

Site vitrine + Dashboard CRM + Produits QR code, construit avec Next.js 16, TypeScript, Tailwind CSS 4 et shadcn/ui.

## 🚀 Stack technique

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript 5
- **Styling** : Tailwind CSS 4 + shadcn/ui
- **Base de données** : Prisma ORM (SQLite)
- **Auth** : Cookie-based session
- **Email** : Nodemailer (SMTP configurable)
- **Charts** : Recharts
- **Animations** : Framer Motion

## 📋 Fonctionnalités

### Site vitrine
- Page d'accueil avec hero et cartes de navigation
- 7 pages dédiées : À propos, Valeurs, Services, Expérience, Produits, Expertise, Contact
- 6 produits QR code avec pages détaillées : QRbags, QRtags, QRtags Entreprise, QRtrans, VerifScan, MyRest
- Formulaire de contact avec dropdown produit + accusé de réception automatique
- SEO dynamique (titre, description, mots-clés configurables)
- Design responsive, couleurs harmonisées avec le logo (bleu navy + sky)

### Dashboard (protégé par mot de passe)
- **Authentification** : login avec mot de passe (défaut : `hmc2024`)
- **Sidebar bleue** avec navigation
- **Vue d'ensemble** : KPI multicolores, graphiques (aire, donut, barres), funnel de conversion, stats par produit
- **Messages** : tous les messages du formulaire, statuts, tags, notes, réponse par email
- **Leads** : CRUD complet, gestion des prospects
- **Clients** : CRUD complet, gestion clients/prospects/partenaires
- **Utilisateurs** : CRUD complet, rôles (admin/manager/agent)
- **Rapports** : vue agrégée, export CSV, rapport mensuel PDF
- **Notifications** : cloche avec badge temps réel

### Paramètres (6 onglets)
- Général, SEO, Notifications, Email & SMTP, Sécurité, Réseaux sociaux

## 🛠️ Installation

```bash
# Installer les dépendances
bun install

# Configurer la base de données
cp .env.example .env
bun run db:push

# (Optionnel) Insérer des données d'exemple
bun run scripts/seed-messages.ts

# Démarrer le serveur de développement
bun run dev
```

## 🔑 Accès

- **Site** : http://localhost:3000
- **Dashboard** : http://localhost:3000/?view=dashboard
- **Mot de passe par défaut** : `hmc2024` (configurable dans Paramètres → Sécurité)

## 📁 Structure

```
src/
├── app/                    # Routes Next.js (App Router)
│   ├── api/                # API routes
│   │   ├── auth/           # Login, logout, me
│   │   ├── clients/        # CRUD clients
│   │   ├── contact/        # Formulaire de contact
│   │   ├── leads/          # CRUD leads
│   │   ├── messages/       # Messages + export + report
│   │   ├── notifications/  # Notifications
│   │   ├── reports/        # Overview
│   │   ├── settings/       # Paramètres
│   │   └── users/          # CRUD utilisateurs
│   ├── globals.css
│   ├── layout.tsx          # SEO dynamique via generateMetadata
│   └── page.tsx            # View switcher
├── components/
│   ├── dashboard/          # Dashboard + views
│   ├── pages/              # Pages du site
│   ├── sections/           # Sections du site
│   └── ui/                 # shadcn/ui
└── lib/
    ├── auth.ts             # Auth (cookie session)
    ├── db.ts               # Prisma client
    ├── email.ts            # SMTP + auto-reply
    ├── products-data.ts    # 6 produits QR code
    └── site-data.ts        # Contenu du site
```

## 📧 Contact

- **Email** : contact@hmc-consulting.pro
- **Téléphone** : +221 77 455 11 36
- **Zone** : Afrique & Océan Indien

## 📄 Licence

© 2025 Horizon Management Consulting. Tous droits réservés.
