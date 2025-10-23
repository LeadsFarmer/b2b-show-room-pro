#!/bin/bash
set -e

echo "🚀 Initialisation automatique de la base de données via Railway"
echo "==============================================================="
echo ""

cd backend

echo "📝 Les commandes suivantes vont s'exécuter sur Railway..."
echo ""

# Créer un fichier de commandes à exécuter
cat > /tmp/railway-init.sh << 'SCRIPT'
#!/bin/bash
set -e

echo "1️⃣ Migrations de la base de données..."
yarn medusa db:migrate

echo ""
echo "2️⃣ Seed des données..."
yarn run seed

echo ""
echo "3️⃣ Création de l'admin..."
yarn medusa user -e admin@showroompro.com -p ShowRoom2025! -i admin

echo ""
echo "✅ Base de données initialisée !"
echo ""
echo "🔑 Récupération de la clé publique..."
yarn medusa exec "SELECT token FROM api_key WHERE type = 'publishable';"

echo ""
echo "💾 Copiez la clé ci-dessus (pk_...)"
SCRIPT

chmod +x /tmp/railway-init.sh

echo "🚀 Ouverture du shell Railway..."
echo ""
echo "📝 Une fois dans le shell, tapez:"
echo "   bash /tmp/railway-init.sh"
echo ""
echo "OU exécutez les commandes manuellement:"
echo "   yarn medusa db:migrate"
echo "   yarn run seed"
echo "   yarn medusa user -e admin@showroompro.com -p ShowRoom2025! -i admin"
echo ""

railway shell
