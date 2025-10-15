#!/bin/bash
set -e

echo "🚀 Déploiement automatique complet sur Railway"
echo "=============================================="
echo ""

# Variables
PROJECT_DIR="/Users/hichamrouabhi/CascadeProjects/show room pro/b2b-starter-medusa"

# Étape 1: Commit tout
echo "📦 Commit des fichiers..."
cd "$PROJECT_DIR"
git add -A
git commit -m "Configuration Railway - Show Room Pro" || echo "Déjà commité"

# Étape 2: Status
echo ""
echo "📊 Status Railway..."
railway status

# Étape 3: Créer un fichier .env pour le backend
echo ""
echo "🔧 Configuration backend..."
cd "$PROJECT_DIR/backend"

# Créer le .env avec les bonnes variables
cat > .env << 'ENVEOF'
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=zB0cBGOv6ZosVsdqiCqMRnlJlJalpSwqdRf3DcKcuZI=
COOKIE_SECRET=i5+4dsUzQpkE5P7rHMDZvgcuGiR/iigmuKZ0DMkpCHM=
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000
PORT=9000
NODE_ENV=production
ENVEOF

echo "✅ Variables backend configurées"

# Étape 4: Déployer le backend
echo ""
echo "🚀 Déploiement du backend..."
echo "   (Cela va créer un service 'backend' automatiquement)"
railway up --detach --service backend 2>/dev/null || railway up --detach

echo ""
echo "✅ Backend en cours de déploiement..."

# Étape 5: Configuration storefront
echo ""
echo "🔧 Configuration storefront..."
cd "$PROJECT_DIR/storefront"

cat > .env << 'ENVEOF'
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_temp
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_REGION=us
REVALIDATE_SECRET=rMTxQNkTbCexsMqXmpGBW0xga77kmT6FpScZz+Ku6ak=
NODE_ENV=production
ENVEOF

echo "✅ Variables storefront configurées"

# Étape 6: Déployer le storefront
echo ""
echo "🚀 Déploiement du storefront..."
railway up --detach --service storefront 2>/dev/null || railway up --detach

echo ""
echo "✅ Storefront en cours de déploiement..."

# Revenir à la racine
cd "$PROJECT_DIR"

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║         🎉 DÉPLOIEMENTS LANCÉS !              ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo "📊 Vérifiez le statut avec:"
echo "   railway status"
echo ""
echo "🌐 Ou ouvrez Railway:"
echo "   railway open"
echo ""
echo "⏳ Attendez 3-5 minutes que les builds se terminent"
echo ""
echo "📝 Ensuite, initialisez la DB avec:"
echo "   ./init-database.sh"
echo ""
