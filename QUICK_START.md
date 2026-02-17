
# ORI-OS 2.0 Quick Start Guide

Welcome to ORI-OS 2.0, the production-ready outreach and intelligence platform.

## Prerequisites
- **Node.js**: v18 or higher
- **Docker**: For running Redis, PostgreSQL, Meilisearch, and MinIO.
- **npm**: v9 or higher

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```

3. **Start Infrastructure**
   Launch the required services using Docker Compose.
   ```bash
   docker-compose up -d
   ```

4. **Database Initialization**
   Push the schema and seed the database with initial data.
   ```bash
   npx turbo run db:push --workspace=@ori-os/db
   npx ts-node packages/db/prisma/seed.ts
   ```

5. **Run Development Mode**
   Start the API, Web, and Worker services simultaneously.
   ```bash
   npm run dev
   ```

## Architecture Overview
- **`apps/api`**: NestJS backend for business logic and data.
- **`apps/web`**: Next.js 16 frontend for the dashboard and interaction.
- **`apps/worker`**: Background processing for email dispatch and enrichment.
- **`packages/db`**: Shared Prisma schema and client.

## Core Features
- **Deliverability**: Setup domains and mailboxes with DNS verification.
- **Intelligence**: AI-driven lead discovery and ICP profiling.
- **Engagement**: Multi-step outreach sequences with automated wait steps.
