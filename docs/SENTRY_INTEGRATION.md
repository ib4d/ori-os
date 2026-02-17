# Sentry Integration Guide

## Overview
Sentry provides real-time error tracking and performance monitoring for production applications.

## Installation

### API (NestJS)
```bash
npm install @sentry/node @sentry/profiling-node --workspace=@ori-os/api
```

### Web (Next.js)
```bash
npm install @sentry/nextjs --workspace=@ori-os/web
```

## Configuration

### 1. Environment Variables
Add to `.env`:
```bash
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
```

### 2. API Setup
Create `apps/api/src/sentry.ts`:
```typescript
import * as Sentry from '@sentry/node';

export function initSentry() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT || 'development',
      tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    });
  }
}
```

Update `apps/api/src/main.ts`:
```typescript
import { initSentry } from './sentry';

async function bootstrap() {
  initSentry(); // Add this line
  // ... rest of bootstrap
}
```

### 3. Web Setup
Run Sentry wizard:
```bash
npx @sentry/wizard@latest -i nextjs
```

This will automatically create:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`

## Usage

### Capturing Errors
```typescript
import * as Sentry from '@sentry/node';

try {
  // risky operation
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

### Adding Context
```typescript
Sentry.setUser({ id: user.id, email: user.email });
Sentry.setTag('feature', 'billing');
Sentry.addBreadcrumb({
  message: 'User upgraded to Pro',
  level: 'info',
});
```

## Notes
- Sentry is optional for development but **highly recommended** for production
- Free tier includes 5,000 errors/month
- Consider implementing after initial launch if budget is constrained
