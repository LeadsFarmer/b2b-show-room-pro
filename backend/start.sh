#!/bin/sh
set -e

echo "🔍 Checking build directory..."
ls -la .medusa/ || echo "❌ .medusa directory not found!"

echo "🔍 Looking for admin files..."
find .medusa -name "index.html" -type f || echo "❌ No index.html found!"

if [ -f ".medusa/server/public/admin/index.html" ]; then
  echo "✅ Admin build found!"
else
  echo "❌ Admin build NOT found - running build now..."
  yarn build
fi

echo "🚀 Starting Medusa server..."
exec yarn medusa start
