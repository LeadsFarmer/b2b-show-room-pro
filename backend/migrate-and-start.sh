#!/bin/bash
set -e

echo "🚀 Show Room Pro - Initialisation et démarrage"
echo "=============================================="
echo ""

# Vérifier si la DB est accessible
echo "📊 Vérification de la connexion PostgreSQL..."
if ! yarn medusa db:status 2>/dev/null; then
    echo "⚠️  DB status check failed, continuing anyway..."
fi

# Exécuter les migrations
echo ""
echo "🔄 Exécution des migrations..."
yarn medusa db:migrate

# Vérifier si des données existent déjà
echo ""
echo "🌱 Vérification des données..."

# Seed seulement si pas déjà fait
if yarn run seed 2>&1 | grep -q "already"; then
    echo "✅ Données déjà présentes"
else
    echo "✅ Données seed insérées"
fi

# Créer l'admin seulement s'il n'existe pas
echo ""
echo "👤 Vérification de l'admin..."
yarn medusa user -e admin@showroompro.com -p ShowRoom2025! -i admin 2>/dev/null || echo "✅ Admin déjà créé"

# Afficher la clé publique
echo ""
echo "🔑 Clé publique disponible dans les logs"
echo "   (Consultez les logs Railway pour la récupérer)"

# Démarrer le serveur
echo ""
echo "🚀 Démarrage du serveur Medusa..."
exec yarn start
