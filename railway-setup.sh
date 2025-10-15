#!/bin/bash

# Script de configuration Railway automatique
set -e

echo "🚂 Configuration Railway - Show Room Pro"
echo "========================================"
echo ""

# Variables d'environnement Backend
echo "📝 Configuration des variables Backend..."

cat > /tmp/backend-vars.txt << 'EOF'
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=zB0cBGOv6ZosVsdqiCqMRnlJlJalpSwqdRf3DcKcuZI=
COOKIE_SECRET=i5+4dsUzQpkE5P7rHMDZvgcuGiR/iigmuKZ0DMkpCHM=
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000
PORT=9000
NODE_ENV=production
EOF

# Variables d'environnement Storefront
cat > /tmp/storefront-vars.txt << 'EOF'
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_temp
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_REGION=us
REVALIDATE_SECRET=rMTxQNkTbCexsMqXmpGBW0xga77kmT6FpScZz+Ku6ak=
NODE_ENV=production
EOF

echo "✅ Fichiers de configuration créés:"
echo "   - /tmp/backend-vars.txt"
echo "   - /tmp/storefront-vars.txt"
echo ""
echo "📋 Variables Backend:"
cat /tmp/backend-vars.txt
echo ""
echo "📋 Variables Storefront:"
cat /tmp/storefront-vars.txt
echo ""
echo "✅ Configuration prête!"
echo ""
echo "🎯 Prochaines étapes:"
echo "1. Allez sur: https://railway.app/project/show-room-pro"
echo "2. Créez un service 'backend' avec Root Directory: backend"
echo "3. Créez un service 'storefront' avec Root Directory: storefront"
echo "4. Copiez les variables ci-dessus dans chaque service"
