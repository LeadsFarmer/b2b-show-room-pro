#!/bin/bash
set -e

echo "🔧 Correction et initialisation du Backend Railway"
echo "=================================================="
echo ""

echo "1️⃣ Liaison au projet showroompro..."
railway link --project showroompro || railway link

echo ""
echo "2️⃣ Sélection du service backend..."
railway service backend

echo ""
echo "3️⃣ Exécution des migrations..."
railway run yarn medusa db:migrate

echo ""
echo "4️⃣ Seed des données..."
railway run yarn run seed

echo ""
echo "5️⃣ Création de l'admin..."
echo "   Email: admin@showroompro.com"
read -sp "   Mot de passe: " ADMIN_PASSWORD
echo ""

railway run yarn medusa user -e admin@showroompro.com -p "$ADMIN_PASSWORD" -i admin

echo ""
echo "✅ Base de données initialisée !"
echo ""
echo "6️⃣ Récupération de la clé publique..."
echo ""

# Connexion à la DB pour récupérer la clé
echo "📝 Connectez-vous à PostgreSQL pour récupérer la clé:"
echo "   Commande SQL: SELECT token FROM api_key WHERE type = 'publishable';"
echo ""
read -p "Appuyez sur ENTRÉE pour ouvrir le shell PostgreSQL..."

railway connect postgres

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║         ✅ BACKEND CONFIGURÉ !                ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo "📝 Maintenant:"
echo "   1. Copiez la clé pk_... que vous venez de voir"
echo "   2. Allez sur Railway → Storefront → Variables"
echo "   3. Mettez à jour: NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY"
echo ""
