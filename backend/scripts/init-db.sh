#!/bin/bash
set -e

echo "🗄️  Running database migrations..."
yarn medusa db:migrate

echo "🌱 Seeding database..."
yarn seed

echo "👤 Creating admin user..."
yarn medusa user -e admin@showroompro.com -p Admin123!

echo "🔑 Getting publishable key..."
yarn medusa exec ./src/scripts/get-publishable-key.ts

echo "✅ Database initialization complete!"
