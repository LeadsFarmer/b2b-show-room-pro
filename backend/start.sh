#!/bin/bash
set -e

echo "🔨 Building Medusa admin..."
yarn build

echo "🚀 Starting Medusa server..."
exec yarn medusa start
