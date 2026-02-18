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

*   Docker & Docker Compose
*   Node.js >= 20 (for local scripting, though everything runs in Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/ib4d/ori-os.git
cd ori-os
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

### 3. Start Development Environment

Start all services (Web, API, Worker, DB, Redis, MinIO, MeiliSearch) in Docker:

```bash
npm run dev:up
```

Access the application:
*   **Web Dashboard:** [http://localhost:3000](http://localhost:3000)
*   **API:** [http://localhost:4000](http://localhost:4000)
*   **MinIO Console:** [http://localhost:9001](http://localhost:9001)
*   **Mailpit/Inbucket (if configured):** Check docker-compose.dev.yml

To stop the environment:

```bash
npm run dev:down
```

## 🚀 Production Deployment

We support a fully Dockerized production deployment suitable for VPS providers like Hostinger, DigitalOcean, or AWS EC2.

**[Read the Full Deployment Guide](DEPLOYMENT_HOSTINGER.md)**

### Quick Summary

1.  **Clone Repo** on your VPS.
2.  **Configure `.env.production`** with real secrets.
3.  **Start Services:**
    ```bash
    npm run prod:up
    ```
4.  **Migrate Database:**
    ```bash
    npm run prod:migrate
    ```
5.  **Set up Nginx Proxy Manager** to handle SSL and routing to ports 3000 (Web) and 4000 (API).

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

[MIT](LICENSE)
