# ============================================================
# HMC Consulting — Coolify Deployment Guide
# ============================================================

## 1. Prerequisites
- Coolify instance running (v4+)
- Domain name configured (e.g., hmc-consulting.pro)

## 2. Coolify Project Setup

### Option A: Deploy via Git Repository
1. In Coolify, go to **Projects** → **Add New Project**
2. Click **Add New Resource** → **Public Repository** (or Private with deploy key)
3. Set:
   - **Repository URL**: `https://github.com/topmuch/Hmc-consulting`
   - **Branch**: `main`
4. Coolify will auto-detect the Dockerfile

### Option B: Deploy via Docker Compose
1. Same as above, but Coolify detects `docker-compose.yml` automatically

## 3. Configuration

### Container Settings
| Setting | Value |
|---------|-------|
| **Port** | 3000 |
| **Health Check Path** | /api/health |
| **Health Check Interval** | 30s |

### Environment Variables
Set these in Coolify's **Environment** tab:

```env
DATABASE_URL=file:./data/hmc.db
ADMIN_PASSWORD=<your-secure-password>
NEXT_PUBLIC_SITE_URL=https://hmc-consulting.pro
NODE_ENV=production
PORT=3000
```

### Persistent Volume
Add a **Persistent Volume** to keep SQLite data across deployments:
- **Mount Path**: `/app/data`
- **Size**: 1GB (adjust as needed)

## 4. Domain & SSL
1. Go to **Configuration** → **Domains**
2. Set your domain: `hmc-consulting.pro`
3. Enable **HTTPS** / **Let's Encrypt**
4. Coolify auto-generates SSL certificates

## 5. Deploy
Click **Deploy** — Coolify will:
1. Pull the repository
2. Build the Docker image (multi-stage, ~60s first time)
3. Run Prisma migrations (via `postinstall`)
4. Start the container on port 3000
5. Route traffic through Traefik reverse proxy

## 6. Post-Deploy
1. Visit `https://hmc-consulting.pro/api/health` to verify
2. Login to dashboard at `https://hmc-consulting.pro/?view=dashboard`
3. Default password: `hmc2024` (change immediately!)
4. Configure SMTP in **Settings > Email** for contact form notifications

## 7. Upgrades
- Push changes to the `main` branch
- In Coolify, click **Redeploy** (or enable auto-deploy on push)
- SQLite volume persists across redeployments

## 8. Backup
The SQLite database lives at `/app/data/hmc.db` inside the container.
To backup:
```bash
docker cp hmc-consulting:/app/data/hmc.db ./backup-$(date +%F).db
```

## Architecture
```
Internet → Coolify Traefik (HTTPS) → Container (port 3000) → Next.js standalone
                                                       ↕
                                              SQLite (/app/data/hmc.db)
```
