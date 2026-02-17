
# Hostinger VPS Deployment Guide

This guide outlines the steps to deploy ORI-OS 2.0 on a Hostinger VPS (Ubuntu 22.04+).

## 1. Server Preparation
Ensure your VPS is up to date and has basic dependencies.
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose git -y
```

## 2. Clone and Configure
Clone the repository and set up environment variables.
```bash
git clone <your-repo-url>
cd ORI-OS
cp prod.env.example .env
# Edit .env with your production values (Postgres, Redis, JWT_SECRET)
```

## 3. Production Build
Build the Docker images for the complete stack.
```bash
docker-compose -f docker-compose.prod.yml build
```

## 4. Database Setup
Run migrations against the production database.
```bash
docker-compose -f docker-compose.prod.yml run api npx prisma migrate deploy
```

## 5. Launch
Start all services in detached mode.
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 6. Access
- **Web Interface**: `http://your-vps-ip:3000`
- **Backend API**: `http://your-vps-ip:4000`

## Maintenance
To view logs for specific services:
```bash
docker-compose logs -f worker
docker-compose logs -f api
```
