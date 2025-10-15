#!/bin/bash

# 🚂 Script de déploiement Railway - Show Room Pro
# Ce script aide à déployer le projet sur Railway

set -e  # Arrêter en cas d'erreur

echo "🚂 Déploiement Show Room Pro sur Railway"
echo "=========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier si Railway CLI est installé
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI n'est pas installé${NC}"
    echo "Installez-le avec: brew install railway"
    exit 1
fi

echo -e "${GREEN}✓ Railway CLI détecté ($(railway --version))${NC}"
echo ""

# Menu principal
echo "Que voulez-vous faire ?"
echo "1) Initialiser un nouveau projet Railway"
echo "2) Déployer le backend"
echo "3) Déployer le storefront"
echo "4) Exécuter les migrations et seed (backend)"
echo "5) Récupérer la clé publique"
echo "6) Voir les logs"
echo "7) Ouvrir l'interface Railway"
echo "0) Quitter"
echo ""
read -p "Votre choix : " choice

case $choice in
    1)
        echo -e "${BLUE}📝 Initialisation d'un nouveau projet Railway...${NC}"
        railway login
        railway init
        echo -e "${GREEN}✓ Projet créé !${NC}"
        echo ""
        echo -e "${YELLOW}Prochaines étapes :${NC}"
        echo "1. Ajoutez PostgreSQL dans l'interface Railway"
        echo "2. Créez un service pour le backend (root: backend/)"
        echo "3. Créez un service pour le storefront (root: storefront/)"
        echo "4. Configurez les variables d'environnement (voir RAILWAY_DEPLOYMENT.md)"
        ;;
    
    2)
        echo -e "${BLUE}🚀 Déploiement du backend...${NC}"
        railway service backend
        railway up
        echo -e "${GREEN}✓ Backend déployé !${NC}"
        echo ""
        echo -e "${YELLOW}N'oubliez pas de :${NC}"
        echo "1. Configurer les variables d'environnement"
        echo "2. Exécuter les migrations (option 4 de ce script)"
        ;;
    
    3)
        echo -e "${BLUE}🚀 Déploiement du storefront...${NC}"
        railway service storefront
        railway up
        echo -e "${GREEN}✓ Storefront déployé !${NC}"
        echo ""
        echo -e "${YELLOW}N'oubliez pas de configurer :${NC}"
        echo "- NEXT_PUBLIC_MEDUSA_BACKEND_URL"
        echo "- NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY"
        ;;
    
    4)
        echo -e "${BLUE}🗄️ Exécution des migrations et seed...${NC}"
        railway service backend
        
        echo "Création de la base de données..."
        railway run yarn medusa db:create || echo "DB existe déjà"
        
        echo "Exécution des migrations..."
        railway run yarn medusa db:migrate
        
        echo "Seed des données..."
        railway run yarn run seed
        
        echo ""
        read -p "Email admin (ex: admin@showroompro.com): " admin_email
        read -sp "Mot de passe admin: " admin_password
        echo ""
        
        echo "Création de l'utilisateur admin..."
        railway run yarn medusa user -e "$admin_email" -p "$admin_password" -i admin
        
        echo -e "${GREEN}✓ Base de données initialisée !${NC}"
        echo ""
        echo -e "${YELLOW}Prochaine étape : Récupérez la clé publique (option 5)${NC}"
        ;;
    
    5)
        echo -e "${BLUE}🔑 Récupération de la clé publique...${NC}"
        railway service backend
        railway connect postgres -c "SELECT token FROM api_key WHERE type = 'publishable';"
        echo ""
        echo -e "${YELLOW}Copiez la clé pk_... et ajoutez-la dans les variables du storefront${NC}"
        ;;
    
    6)
        echo "Quel service ?"
        echo "1) Backend"
        echo "2) Storefront"
        read -p "Votre choix : " log_choice
        
        if [ "$log_choice" = "1" ]; then
            railway logs --service backend
        elif [ "$log_choice" = "2" ]; then
            railway logs --service storefront
        fi
        ;;
    
    7)
        echo -e "${BLUE}🌐 Ouverture de l'interface Railway...${NC}"
        railway open
        ;;
    
    0)
        echo "Au revoir ! 👋"
        exit 0
        ;;
    
    *)
        echo -e "${RED}❌ Choix invalide${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Opération terminée !${NC}"
echo ""
echo "📚 Pour plus d'informations, consultez RAILWAY_DEPLOYMENT.md"
