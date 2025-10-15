#!/bin/bash

# Script de déploiement Railway - Show Room Pro
# Version simplifiée

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo "╔════════════════════════════════════════╗"
echo "║   🚂 Railway Deployment - Show Room Pro  ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Vérifier Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI n'est pas installé${NC}"
    echo "Installez-le avec: brew install railway"
    exit 1
fi

echo -e "${GREEN}✓ Railway CLI installé ($(railway --version))${NC}"

# Vérifier connexion
if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Pas connecté à Railway${NC}"
    echo "Connexion en cours..."
    railway login
fi

USER=$(railway whoami)
echo -e "${GREEN}✓ Connecté: $USER${NC}"
echo ""

# Menu principal
echo "╔════════════════════════════════════════╗"
echo "║           MENU PRINCIPAL                ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "1️⃣  Lier ce projet à Railway (première fois)"
echo "2️⃣  Initialiser la base de données (après déploiement backend)"
echo "3️⃣  Récupérer la clé publique"
echo "4️⃣  Voir les logs backend"
echo "5️⃣  Voir les logs storefront"
echo "6️⃣  Ouvrir Railway dans le navigateur"
echo "7️⃣  Voir le guide complet"
echo "0️⃣  Quitter"
echo ""
read -p "Votre choix: " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}📡 Liaison du projet à Railway...${NC}"
        echo ""
        railway link
        echo ""
        echo -e "${GREEN}✓ Projet lié !${NC}"
        echo ""
        echo -e "${YELLOW}Prochaines étapes :${NC}"
        echo "1. Créez les services sur Railway (voir DEPLOY_GUIDE.md)"
        echo "2. Configurez les variables d'environnement"
        echo "3. Revenez ici pour initialiser la DB (option 2)"
        ;;
    
    2)
        echo ""
        echo -e "${BLUE}🗄️  Initialisation de la base de données...${NC}"
        echo ""
        
        # Sélectionner le service backend
        railway service backend
        
        echo "Création de la base de données..."
        railway run yarn medusa db:create || echo "La DB existe peut-être déjà"
        
        echo ""
        echo "Exécution des migrations..."
        railway run yarn medusa db:migrate
        
        echo ""
        echo "Seed des données..."
        railway run yarn run seed
        
        echo ""
        echo -e "${GREEN}✓ Base de données initialisée !${NC}"
        echo ""
        
        read -p "Voulez-vous créer un utilisateur admin maintenant ? (o/n): " create_admin
        
        if [[ $create_admin == "o" || $create_admin == "O" ]]; then
            echo ""
            read -p "Email admin: " admin_email
            read -sp "Mot de passe: " admin_password
            echo ""
            
            railway run yarn medusa user -e "$admin_email" -p "$admin_password" -i admin
            
            echo ""
            echo -e "${GREEN}✓ Admin créé !${NC}"
            echo "Email: $admin_email"
        fi
        
        echo ""
        echo -e "${YELLOW}Prochaine étape : Récupérez la clé publique (option 3)${NC}"
        ;;
    
    3)
        echo ""
        echo -e "${BLUE}🔑 Récupération de la clé publique...${NC}"
        echo ""
        echo "Connexion à PostgreSQL..."
        echo "Tapez cette commande dans le shell PostgreSQL:"
        echo ""
        echo -e "${YELLOW}SELECT token FROM api_key WHERE type = 'publishable';${NC}"
        echo ""
        echo "Puis tapez \\q pour quitter"
        echo ""
        read -p "Appuyez sur Entrée pour continuer..."
        
        railway service backend
        railway connect postgres
        
        echo ""
        echo -e "${GREEN}💾 Copiez la clé pk_... et ajoutez-la dans les variables du storefront${NC}"
        ;;
    
    4)
        echo ""
        echo -e "${BLUE}📊 Logs du backend...${NC}"
        echo ""
        railway logs --service backend
        ;;
    
    5)
        echo ""
        echo -e "${BLUE}📊 Logs du storefront...${NC}"
        echo ""
        railway logs --service storefront
        ;;
    
    6)
        echo ""
        echo -e "${BLUE}🌐 Ouverture de Railway...${NC}"
        railway open
        ;;
    
    7)
        echo ""
        echo -e "${BLUE}📚 Guide de déploiement complet${NC}"
        echo ""
        if [ -f "DEPLOY_GUIDE.md" ]; then
            cat DEPLOY_GUIDE.md | head -100
            echo ""
            echo -e "${YELLOW}... (voir DEPLOY_GUIDE.md pour le guide complet)${NC}"
        else
            echo "Consultez DEPLOY_GUIDE.md pour le guide détaillé"
        fi
        ;;
    
    0)
        echo ""
        echo "Au revoir ! 👋"
        exit 0
        ;;
    
    *)
        echo ""
        echo -e "${RED}❌ Choix invalide${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Terminé !${NC}"
echo ""
echo "📚 Consultez DEPLOY_GUIDE.md pour plus d'informations"
echo ""
