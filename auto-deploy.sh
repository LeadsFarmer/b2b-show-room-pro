#!/bin/bash

# Déploiement automatique Railway - Show Room Pro
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo "╔══════════════════════════════════════════════════╗"
echo "║   🚂 AUTO-DEPLOY RAILWAY - SHOW ROOM PRO        ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Étape 1: Vérifier le projet
echo -e "${BLUE}📡 Vérification du projet Railway...${NC}"
railway status
echo ""

# Étape 2: Ouvrir Railway pour configuration manuelle
echo -e "${YELLOW}🌐 Ouverture de Railway dans le navigateur...${NC}"
railway open
sleep 2

# Étape 3: Afficher les instructions
echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║         📋 CONFIGURATION RAPIDE RAILWAY          ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo -e "${YELLOW}Sur Railway (qui vient de s'ouvrir):${NC}"
echo ""
echo "1️⃣  SERVICE BACKEND:"
echo "   - Cliquez '+ New' → 'Empty Service'"
echo "   - Nom: backend"
echo "   - Settings → Root Directory: backend"
echo "   - Variables → Raw Editor → Copiez:"
echo ""
echo -e "${GREEN}DATABASE_URL=\${{Postgres.DATABASE_URL}}"
echo "JWT_SECRET=zB0cBGOv6ZosVsdqiCqMRnlJlJalpSwqdRf3DcKcuZI="
echo "COOKIE_SECRET=i5+4dsUzQpkE5P7rHMDZvgcuGiR/iigmuKZ0DMkpCHM="
echo "STORE_CORS=http://localhost:8000"
echo "ADMIN_CORS=http://localhost:9000"
echo "AUTH_CORS=http://localhost:9000"
echo "PORT=9000"
echo -e "NODE_ENV=production${NC}"
echo ""
echo "2️⃣  SERVICE STOREFRONT:"
echo "   - Cliquez '+ New' → 'Empty Service'"
echo "   - Nom: storefront"
echo "   - Settings → Root Directory: storefront"
echo "   - Variables → Raw Editor → Copiez:"
echo ""
echo -e "${GREEN}NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000"
echo "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_temp"
echo "NEXT_PUBLIC_BASE_URL=http://localhost:8000"
echo "NEXT_PUBLIC_DEFAULT_REGION=us"
echo "REVALIDATE_SECRET=rMTxQNkTbCexsMqXmpGBW0xga77kmT6FpScZz+Ku6ak="
echo -e "NODE_ENV=production${NC}"
echo ""
echo "════════════════════════════════════════════════════"
echo ""
read -p "Appuyez sur ENTRÉE quand la configuration est terminée..."

# Étape 4: Attendre que les services soient prêts
echo ""
echo -e "${BLUE}⏳ Attente du déploiement des services...${NC}"
echo "   (Cela peut prendre 3-5 minutes)"
echo ""
read -p "Appuyez sur ENTRÉE quand le backend est déployé (vert)..."

# Étape 5: Initialiser la base de données
echo ""
echo -e "${BLUE}🗄️  Initialisation de la base de données...${NC}"
echo ""

echo "📊 Sélection du service backend..."
railway service backend

echo ""
echo "🔨 Création de la base de données..."
railway run yarn medusa db:create || echo "DB existe déjà"

echo ""
echo "🔄 Exécution des migrations..."
railway run yarn medusa db:migrate

echo ""
echo "🌱 Seed des données..."
railway run yarn run seed

echo ""
echo -e "${GREEN}✅ Base de données initialisée !${NC}"

# Étape 6: Créer l'admin
echo ""
echo -e "${BLUE}👤 Création de l'utilisateur admin...${NC}"
echo ""
read -p "Email admin (ex: admin@showroompro.com): " admin_email
read -sp "Mot de passe: " admin_password
echo ""

railway run yarn medusa user -e "$admin_email" -p "$admin_password" -i admin

echo ""
echo -e "${GREEN}✅ Admin créé !${NC}"
echo "   Email: $admin_email"

# Étape 7: Récupérer la clé publique
echo ""
echo -e "${BLUE}🔑 Récupération de la clé publique...${NC}"
echo ""
echo "Exécutez cette commande dans le shell PostgreSQL:"
echo -e "${YELLOW}SELECT token FROM api_key WHERE type = 'publishable';${NC}"
echo ""
read -p "Appuyez sur ENTRÉE pour ouvrir le shell PostgreSQL..."

railway connect postgres

# Étape 8: Instructions finales
echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║            🎉 PRESQUE TERMINÉ !                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo -e "${YELLOW}Dernières étapes sur Railway:${NC}"
echo ""
echo "1. Copiez la clé publique (pk_...)"
echo "2. Allez dans service 'storefront' → Variables"
echo "3. Modifiez NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY avec la vraie clé"
echo "4. Notez les URLs des services déployés"
echo "5. Mettez à jour STORE_CORS, ADMIN_CORS, AUTH_CORS dans le backend"
echo "6. Mettez à jour NEXT_PUBLIC_MEDUSA_BACKEND_URL et NEXT_PUBLIC_BASE_URL"
echo ""
echo -e "${GREEN}✅ Votre application Show Room Pro sera déployée !${NC}"
echo ""
