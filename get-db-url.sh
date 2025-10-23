#!/bin/bash

echo "🔍 Récupération de l'URL PostgreSQL Railway"
echo "==========================================="
echo ""

# Essayer de récupérer l'URL
echo "📊 Tentative de récupération..."
echo ""

# Méthode 1: Via variables
railway variables 2>/dev/null | grep -i database

echo ""
echo "════════════════════════════════════════════"
echo ""
echo "📝 INSTRUCTIONS:"
echo ""
echo "1. Allez sur Railway.app"
echo "2. Projet: showroompro"
echo "3. Service: PostgreSQL"
echo "4. Onglet: Variables OU Connect"
echo "5. Copiez l'URL qui ressemble à:"
echo "   postgresql://postgres:xxx@xxx.railway.app:5432/railway"
echo ""
echo "6. Puis exécutez dans le terminal:"
echo '   export DATABASE_URL="postgresql://..."'
echo ""
echo "7. Ensuite exécutez ces commandes:"
echo "   cd backend"
echo "   yarn medusa db:migrate"
echo "   yarn run seed"
echo "   yarn medusa user -e admin@showroompro.com -p Pass123! -i admin"
echo ""
echo "════════════════════════════════════════════"
