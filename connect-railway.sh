#!/bin/bash

echo "🔗 Connexion au Nouveau Projet Railway srpB2B"
echo "=============================================="
echo ""

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI non installé"
    echo "   Installation: npm install -g @railway/cli"
    exit 1
fi

# Check login
if ! railway whoami &> /dev/null; then
    echo "❌ Non connecté à Railway"
    echo "   Connexion: railway login"
    exit 1
fi

echo "✅ Railway CLI prêt"
echo "👤 $(railway whoami)"
echo ""

# List projects
echo "📋 Vos projets Railway :"
railway list
echo ""

# Link project
echo "🔗 Connexion au projet srpB2B..."
echo "   → Sélectionnez 'srpB2B' dans la liste"
echo ""

railway link

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Projet connecté avec succès !"
    echo ""
    
    # Show project info
    if [ -f .railway.json ]; then
        echo "📄 Configuration Railway créée"
        cat .railway.json
        echo ""
    fi
    
    echo "🎯 Prochaines étapes :"
    echo "   1. Vérifier les services : railway service list"
    echo "   2. Voir les variables : railway variables"
    echo "   3. Déployer : git push b2b main"
    echo ""
else
    echo "❌ Échec de la connexion"
    echo "   Réessayez avec : railway link"
fi
