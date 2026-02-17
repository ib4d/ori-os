# Ori-OS 2.0

Ori-OS 2.0 is a comprehensive, production-ready operating system for modern businesses. It integrates Marketing, CRM, Engagement, and Analytics into a unified, high-performance platform. Built with a modern tech stack, it is designed for scalability, performance, and developer experience.

## 🚀 Features

*   **Unified Dashboard:** A central hub for managing all business operations.
*   **Marketing Automation:** Create and manage campaigns, automations, and tracking.
*   **CRM:** Manage contacts, companies, deals, and activities with ease.
*   **Engagement:** Email sequences, inbox management, and templates.
*   **Analytics:** Deep insights into performance across all modules.
*   **SEO Studio:** Advanced tools for keyword tracking, site audits, and content analysis.
*   **Intelligence:** AI-powered enrichment for contacts and companies.
*   **Modern UI:** A beautiful, responsive interface built with Tailwind CSS and Shadcn/UI.

## 🛠️ Technology Stack

*   **Monorepo:** Managed with [TurboRepo](https://turbo.build/).
*   **Frontend:** [Next.js 15](https://nextjs.org/) (App Router), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/).
*   **Backend:** [NestJS](https://nestjs.com/), [Node.js](https://nodejs.org/).
*   **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/).
*   **Queue/Background Jobs:** [BullMQ](https://docs.bullmq.io/) with [Redis](https://redis.io/).
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/).
*   **Deployment:** Docker & Docker Compose ready.

## 📂 Project Structure

The project follows a monorepo structure:

```
ori-os/
├── apps/
│   ├── api/          # NestJS Backend API
│   ├── web/          # Next.js Frontend Dashboard & Marketing Site
│   └── worker/       # Background Worker for Jobs (BullMQ)
├── packages/
│   ├── db/           # Shared Prisma Database Client & Schema
│   ├── ui/           # Shared UI Components (if applicable)
│   └── config/       # Shared Configurations (ESLint, TSConfig)
├── docker-compose.yml # Local development infrastructure (Postgres, Redis)
└── package.json      # Root dependencies and scripts
```

## 📦 Installation & Setup

### Prerequisites

*   Node.js >= 20
*   npm or pnpm
*   Docker & Docker Compose

### 1. Clone the Repository

```bash
git clone https://github.com/ib4d/ori-os.git
cd ori-os
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Ensure your `.env` file has valid credentials for:
*   Database (PostgreSQL)
*   Redis
*   Authentication Secrets
*   API Keys (OpenAI, SendGrid, etc.)

### 4. Infrastructure Setup

Start the database and Redis containers:

```bash
docker-compose up -d
```

### 5. Database Setup

Push the schema to the database:

```bash
npm run db:push
```

(Optional) Seed the database:

```bash
npm run seed --workspace=apps/api
```

### 6. Start Development Servers

You can start all services at once or individually.

**Start All:**

```bash
npm run dev
```

**Start Individual Services:**

*   **API:** `npm run dev:api` (Runs on port 3001)
*   **Web:** `npm run dev:web` (Runs on port 3000)
*   **Worker:** `npm run dev:worker`

## 🚀 Production Guide

### Building for Production

To build all apps and packages:

```bash
npm run build
```

This will run the build command for `web`, `api`, and `worker` via TurboRepo.

### Deployment

The project includes `Dockerfile`s for each application. You can deploy it using Docker or any cloud provider that supports Node.js.

**Deployment Strategy:**

1.  **Database:** Managed PostgreSQL (AWS RDS, Supabase, Neon).
2.  **Redis:** Managed Redis (Upstash, AWS ElastiCache).
3.  **API & Worker:** Deploy as Node.js services (AWS ECS, DigitalOcean App Platform, Railway).
4.  **Web:** Deploy to Vercel or as a containerized Node.js app.

Ensure all environment variables are correctly set in your production environment.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

[MIT](LICENSE)
