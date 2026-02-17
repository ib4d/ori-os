# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Check if we need to install libc6-compat for some binaries
RUN apk add --no-cache libc6-compat

# Copy root configs
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
# Copy app and package configs
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/db/package.json ./packages/db/

# Install root dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client (required for auth and other features)
RUN npm run db:generate

# Build the Web app
RUN npx turbo build --filter=@ori-os/web...

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
# We use output: 'standalone' in next.config.ts
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/web/server.js"]
