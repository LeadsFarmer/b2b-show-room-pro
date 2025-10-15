#!/bin/bash
set -e

echo "🗄️  Initialisation de la base de données"
echo "========================================"
echo ""

# Se placer sur le service backend
railway service backend

echo "🔨 Création de la base de données..."
railway run yarn medusa db:create 2>/dev/null || echo "   Base existe déjà"

echo ""
echo "🔄 Exécution des migrations..."
railway run yarn medusa db:migrate

echo ""
echo "🌱 Seed des données initiales..."
railway run yarn run seed

echo ""
echo "✅ Base de données initialisée !"
echo ""
echo "👤 Création de l'utilisateur admin..."
echo ""
read -p "Email admin (ex: admin@showroompro.com): " ADMIN_EMAIL
read -sp "Mot de passe: " ADMIN_PASSWORD
echo ""

railway run yarn medusa user -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD" -i admin

echo ""
echo "✅ Admin créé !"
echo "   Email: $ADMIN_EMAIL"
echo ""
echo "🔑 Récupération de la clé publique..."
echo ""
echo "Exécutez cette commande SQL:"
echo "  SELECT token FROM api_key WHERE type = 'publishable';"
echo ""
read -p "Appuyez sur ENTRÉE pour ouvrir psql..."

railway connect postgres

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║         ✅ BASE DE DONNÉES PRÊTE !            ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo "📝 N'oubliez pas de:"
echo "   1. Copier la clé publique (pk_...)"
echo "   2. La mettre dans les variables du storefront"
echo "   3. Mettre à jour les URLs CORS dans le backend"
echo ""
