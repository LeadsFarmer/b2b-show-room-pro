#!/bin/bash

echo "🚀 Exécution du seed sur Railway..."
echo ""

# Méthode 1 : Via Railway CLI
echo "📦 Option A : Railway CLI"
echo "railway run npm run seed"
echo ""

# Méthode 2 : Via API endpoint
echo "📡 Option B : API Endpoint"
echo "Trouvez votre BACKEND_URL dans Railway dashboard"
echo "curl -X POST 'https://VOTRE-BACKEND.railway.app/api/seed?token=VOTRE_INIT_SECRET'"
echo ""

# Méthode 3 : Via Admin Medusa
echo "🖥️  Option C : Admin Medusa"
echo "1. Accédez à https://VOTRE-BACKEND.railway.app/app"
echo "2. Login: admin@medusa-test.com / supersecret"
echo "3. Products → Categories → Create Category"
echo ""

echo "✅ Choisissez la méthode qui vous convient !"
