#!/bin/bash
set -e

echo "🚀 Déploiement complet automatique via Railway CLI"
echo "==================================================="
echo ""

# Variables
PROJECT_NAME="showroompro"

# Étape 1: Lier au projet showroompro
echo "🔗 Liaison au projet Railway '$PROJECT_NAME'..."
echo ""

# Essayer de lier sans interaction
railway link --project showroompro 2>/dev/null || railway link

echo ""
echo "✅ Projet lié !"

# Vérifier le statut
echo ""
echo "📊 Vérification du projet..."
railway status

# Étape 2: Liste des services
echo ""
echo "📋 Services disponibles..."
railway service

# Étape 3: Déployer le backend
echo ""
echo "🚀 Déploiement du BACKEND..."
echo "   (depuis le dossier backend/)"
cd backend

# Définir les variables d'environnement si nécessaire
railway variables set DATABASE_URL='${{Postgres.DATABASE_URL}}' --service backend 2>/dev/null || true
railway variables set JWT_SECRET='zB0cBGOv6ZosVsdqiCqMRnlJlJalpSwqdRf3DcKcuZI=' --service backend 2>/dev/null || true
railway variables set COOKIE_SECRET='i5+4dsUzQpkE5P7rHMDZvgcuGiR/iigmuKZ0DMkpCHM=' --service backend 2>/dev/null || true
railway variables set PORT='9000' --service backend 2>/dev/null || true
railway variables set NODE_ENV='production' --service backend 2>/dev/null || true

# Uploader et déployer
railway up --service backend --detach

cd ..
echo "✅ Backend en cours de déploiement..."

# Étape 4: Déployer le storefront
echo ""
echo "🚀 Déploiement du STOREFRONT..."
echo "   (depuis le dossier storefront/)"
cd storefront

# Variables storefront
railway variables set NEXT_PUBLIC_DEFAULT_REGION='us' --service storefront 2>/dev/null || true
railway variables set NODE_ENV='production' --service storefront 2>/dev/null || true

# Uploader et déployer
railway up --service storefront --detach

cd ..
echo "✅ Storefront en cours de déploiement..."

# Étape 5: Résumé
echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║         🎉 DÉPLOIEMENTS LANCÉS !              ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo "📊 Statut du projet:"
railway status

echo ""
echo "🌐 Ouvrir Railway:"
railway open

echo ""
echo "⏳ Les builds sont en cours (3-5 minutes)"
echo ""
echo "📝 Prochaines étapes:"
echo "   1. Attendez que les services soient verts"
echo "   2. Notez les URLs des services"
echo "   3. Mettez à jour les variables CORS et URLs"
echo "   4. Initialisez la DB avec: ./init-database.sh"
echo ""
