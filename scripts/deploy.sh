#!/bin/bash
set -e

echo "=== ORI-OS Deploy ==="
echo "Pulling latest changes..."
git pull origin main

echo "Building containers..."
docker compose -f docker-compose.prod.yml build

echo "Restarting services..."
docker compose -f docker-compose.prod.yml up -d

echo "Running migrations..."
docker compose -f docker-compose.prod.yml exec -T api npx prisma migrate deploy

echo "=== Deploy complete ==="
docker compose -f docker-compose.prod.yml ps
