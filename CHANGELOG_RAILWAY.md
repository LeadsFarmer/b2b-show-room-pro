# 📝 Changelog - Configuration Railway

## 🎯 Objectif

Préparer le projet Show Room Pro pour le déploiement sur Railway avec une configuration spécifique adaptée à notre projet B2B.

---

## 📦 Fichiers ajoutés

### Configuration Railway

1. **`railway.json`** - Configuration globale du projet
   - Builder: Nixpacks
   - Politique de redémarrage
   - Nombre de replicas

2. **`backend/nixpacks.toml`** - Configuration build backend
   - Node.js 22
   - Yarn package manager
   - Commandes de build et start

3. **`storefront/nixpacks.toml`** - Configuration build storefront
   - Node.js 22
   - Yarn package manager
   - Build Next.js optimisé

### Documentation

4. **`RAILWAY_DEPLOYMENT.md`** - Guide complet de déploiement
   - Architecture des services
   - Configuration étape par étape
   - Variables d'environnement
   - Troubleshooting

5. **`QUICK_START_RAILWAY.md`** - Guide de démarrage rapide
   - Commandes essentielles
   - Checklist de déploiement

6. **`CHANGELOG_RAILWAY.md`** - Ce fichier
   - Historique des modifications

### Scripts

7. **`deploy-railway.sh`** - Script interactif de déploiement
   - Menu interactif
   - Automatisation des commandes Railway
   - Gestion des services

### Exemples de configuration

8. **`backend/.env.railway.example`** - Variables backend pour Railway
   - Database URL
   - JWT/Cookie secrets
   - CORS configuration
   - Redis (optionnel)

9. **`storefront/.env.railway.example`** - Variables storefront pour Railway
   - Backend URL
   - Publishable key
   - Default region
   - Revalidation secret

---

## 🔧 Modifications apportées au projet

### Backend

- ✅ Configuration Nixpacks pour Node.js 22
- ✅ Template de variables d'environnement Railway
- ✅ Scripts de build et démarrage optimisés

### Storefront

- ✅ Configuration Nixpacks pour Next.js
- ✅ Template de variables d'environnement Railway
- ✅ Build optimisé pour production

### Documentation

- ✅ Guide complet de déploiement
- ✅ Guide de démarrage rapide
- ✅ Script de déploiement automatisé
- ✅ Exemples de configuration

---

## 🚀 Services Railway à créer

Le projet nécessite **3 services** sur Railway :

### 1. PostgreSQL Database
- Type: Database
- Service Railway natif
- Lié automatiquement au backend

### 2. Backend Medusa
- Root directory: `backend/`
- Port: 9000
- Variables: Voir `.env.railway.example`
- Commandes post-déploiement requises:
  - Migrations
  - Seed
  - Création admin

### 3. Storefront Next.js
- Root directory: `storefront/`
- Port: 8000 (ou auto)
- Variables: Voir `.env.railway.example`
- Dépend de: Backend déployé

---

## 📋 Variables d'environnement critiques

### Backend (Minimum requis)
```bash
DATABASE_URL              # Auto depuis PostgreSQL
JWT_SECRET               # Générer: openssl rand -base64 32
COOKIE_SECRET            # Générer: openssl rand -base64 32
STORE_CORS               # URL du storefront
ADMIN_CORS               # URL du backend
AUTH_CORS                # URL du backend
```

### Storefront (Minimum requis)
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL        # URL du backend Railway
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY    # De la DB après seed
NEXT_PUBLIC_BASE_URL                  # URL du storefront
NEXT_PUBLIC_DEFAULT_REGION            # us, fr, etc.
```

---

## ⚙️ Workflow de déploiement

### Phase 1 : Setup initial
1. ✅ Connexion à Railway (`railway login`)
2. ✅ Création du projet (`railway init`)
3. ✅ Ajout PostgreSQL (`railway add --database postgres`)

### Phase 2 : Backend
1. ✅ Création service backend
2. ✅ Configuration variables d'environnement
3. ✅ Premier déploiement
4. ✅ Exécution migrations/seed
5. ✅ Récupération clé publique

### Phase 3 : Storefront
1. ✅ Création service storefront
2. ✅ Configuration variables (avec clé publique)
3. ✅ Déploiement

### Phase 4 : Configuration finale
1. ✅ Mise à jour CORS avec vraies URLs
2. ✅ Redéploiement backend
3. ✅ Tests de bout en bout

---

## 🎨 Personnalisations Show Room Pro

### Branding déjà effectué
- ✅ Nom : "Show Room Pro" (au lieu de "Medusa Store")
- ✅ Footer personnalisé
- ✅ Navigation personnalisée
- ✅ Métadonnées SEO
- ✅ Messages en français

### À configurer sur Railway
- [ ] Nom de domaine personnalisé
- [ ] Certificat SSL (auto via Railway)
- [ ] Variables d'environnement de production
- [ ] Monitoring et logs

---

## 🔐 Sécurité

### Secrets à générer avant déploiement

```bash
# JWT Secret
openssl rand -base64 32

# Cookie Secret
openssl rand -base64 32

# Revalidate Secret
openssl rand -base64 32
```

### Variables sensibles
- ⚠️ Ne jamais committer les vraies valeurs
- ✅ Utiliser Railway Variables pour production
- ✅ Fichiers `.env` ajoutés au `.gitignore`

---

## 📊 Ressources Railway estimées

### Backend
- **CPU**: Variable selon trafic
- **RAM**: ~512MB minimum recommandé
- **Database**: PostgreSQL (shared ou dédié)

### Storefront
- **CPU**: Variable selon trafic
- **RAM**: ~512MB minimum recommandé

### Coûts estimés
- **Starter Plan**: ~$5/mois par service
- **PostgreSQL**: Selon usage
- **Total estimé**: ~$15-20/mois (pour démarrer)

---

## 🐛 Problèmes connus et solutions

### Build failures
- **Solution**: Vérifier `nixpacks.toml` et `package.json`
- **Logs**: `railway logs --service <nom>`

### CORS errors
- **Solution**: Mettre à jour avec vraies URLs Railway
- **Redéployer**: Après modification des variables

### Database connection
- **Solution**: Vérifier que PostgreSQL est bien lié
- **Variable**: `DATABASE_URL` doit être définie

---

## 📚 Prochaines étapes après déploiement

1. [ ] Configurer un nom de domaine personnalisé
2. [ ] Activer les backups de base de données
3. [ ] Configurer les webhooks (si nécessaire)
4. [ ] Mettre en place un monitoring
5. [ ] Tester le workflow complet (commande → paiement)
6. [ ] Configurer les emails (SMTP)
7. [ ] Ajouter Redis pour production (recommandé)

---

## 🔗 Liens utiles

- [Railway Dashboard](https://railway.app/dashboard)
- [Railway Documentation](https://docs.railway.app/)
- [Medusa Documentation](https://docs.medusajs.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Date**: 15 octobre 2025
**Version**: 1.0.0
**Projet**: Show Room Pro - Plateforme B2B E-commerce
