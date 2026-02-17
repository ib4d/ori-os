# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for node-gyp or prisma
RUN apk add --no-cache libc6-compat

# Copy root configs
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
# Copy app and package configs
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/

# Install root dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client with correct binary targets for Alpine
RUN npm run db:generate

# Build the API
RUN npx turbo build --filter=@ori-os/api...

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built API
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

# Copy node_modules (this is large, but ensures all deps including prisma are there)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/db ./packages/db

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "dist/main.js"]
