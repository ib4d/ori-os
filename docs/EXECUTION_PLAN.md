# Execution Plan

Detailed instructions for running and testing Ori-OS 2.0.

## Local Development (Windows / Host)

### 1. Prerequisites
- Docker Desktop (for infrastructure)
- Node.js 20.x
- VSCode

### 2. Startup Command Sequence
Run these in separate terminal tabs at the repo root:

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start Infrastructure (Postgres, Redis, Meilisearch, MinIO)
docker compose up -d

# Generate Database Client
npx turbo run db:generate

# Start Services
npm run dev:api     # Backend (Port 4000)
npm run dev:web     # Frontend (Port 3000)
npm run dev:worker  # Background Workers
```

### 3. Verification & Smoke Tests
- **API Health**: `GET http://localhost:4000/health`
- **Dashboard**: `http://localhost:3000/dashboard`
- **Billing Stubs**: Verify these don't 404:
    - `http://localhost:3000/api/billing/status`
    - `http://localhost:3000/api/billing/usage`

## Staging & Production Readiness

### Pre-Deployment Checklist
- [ ] `npm run build` completes without errors.
- [ ] `ORI_AUTH_BYPASS` is set to `false`.
- [ ] `S3_ENDPOINT` points to the internal Docker service.
- [ ] `NEXTAUTH_URL` matches the production domain.

### Production Push
Follow the instructions in `DEPLOYMENT_HOSTINGER.md`.
