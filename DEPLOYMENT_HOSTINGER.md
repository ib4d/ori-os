# Deploying Ori-OS 2.0 to Hostinger VPS (Ubuntu 24.04)

This guide walks you through deploying the full Ori-OS stack to a production VPS using Docker Compose.

## Prerequisites

*   A Hostinger VPS running **Ubuntu 24.04**.
*   SSH access to the VPS.
*   A domain name pointed to your VPS IP:
    *   `ori-os.yourdomain.com` (for the dashboard)
    *   `api.ori-os.yourdomain.com` (for the backend)

## 1. Initial VPS Setup

SSH into your VPS:

```bash
ssh root@your_vps_ip
```

Update system packages:

```bash
apt update && apt upgrade -y
```

## 2. Install Docker & Docker Compose

Run the official installation script:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

Verify installation:

```bash
docker --version
docker compose version
```

## 3. Clone the Repository

Navigate to `/opt` and clone your repo:

```bash
cd /opt
git clone https://github.com/ib4d/ori-os.git
cd ori-os
```

## 4. Configuration

### Create Production Environment File

Copy the example file:

```bash
cp .env.production.example .env.production
```

**CRITICAL:** Edit `.env.production` and fill in ALL secrets!

```bash
nano .env.production
```

*   Set `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`).
*   Set `S3_SECRET_KEY` and `MEILI_MASTER_KEY`.
*   Update `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_API_URL` to your actual domains.
*   Ensure `ORI_AUTH_BYPASS=false`.

### Create Docker Network

Create the private network for your services:

```bash
docker network create ori_network
```

## 5. Start the Application

Build and start the services:

```bash
npm run prod:up
# OR manually:
docker compose -f docker-compose.prod.yml up -d --build
```

Check logs to ensure everything started:

```bash
npm run prod:logs
```

## 6. Database Migration

Once the API container is running (check logs), apply the database schema:

```bash
npm run prod:migrate
# OR manually:
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

## 7. Reverse Proxy Setup (Nginx Proxy Manager)

We recommend running Nginx Proxy Manager (NPM) to handle SSL and routing.

1.  **Install NPM** (if not already installed) in a separate Docker stack on the same network (`ori_network`).
2.  **Login to NPM Admin** (usually port 81).
3.  **Add Proxy Hosts**:

    **Dashboard**:
    *   Domain: `ori-os.yourdomain.com`
    *   Scheme: `http`
    *   Forward Hostname: `ori-os-web` (Container Name)
    *   Forward Port: `3000`
    *   Block Common Exploits: Yes
    *   SSL: Request a new Let's Encrypt Certificate (Force SSL).

    **API**:
    *   Domain: `api.ori-os.yourdomain.com`
    *   Scheme: `http`
    *   Forward Hostname: `ori-os-api` (Container Name)
    *   Forward Port: `4000`
    *   Block Common Exploits: Yes
    *   SSL: Request a new Let's Encrypt Certificate (Force SSL).

## 8. Verification

1.  Visit `https://api.ori-os.yourdomain.com/health` (or just the root) to verify API connectivity.
2.  Visit `https://ori-os.yourdomain.com` to access the dashboard.
3.  Login and verify that the app works.

## Troubleshooting

*   **Logs:** `npm run prod:logs`
*   **Restart:** `npm run prod:down && npm run prod:up`
*   **Prisma Errors:** Ensure `linux-musl` is in `schema.prisma` binaryTargets (it should be already).
