# 🚂 Guide de déploiement Railway - Show Room Pro
## Guide simplifié étape par étape

---

## 📋 Prérequis

✅ Railway CLI installé (v4.10.0)
✅ Connecté en tant que: hicham@leads-farmer.com
✅ Projet prêt avec configuration Railway

---

## 🚀 DÉPLOIEMENT - 3 SERVICES À CRÉER

### Vue d'ensemble

Vous allez créer **3 services** sur Railway :
1. **PostgreSQL** - Base de données
2. **Backend** - API Medusa (dossier `backend/`)
3. **Storefront** - Frontend Next.js (dossier `storefront/`)

---

## 📝 ÉTAPE 1 : Créer le projet sur Railway

### Via l'interface web Railway (RECOMMANDÉ)

1. **Allez sur** : https://railway.app/new
2. **Cliquez** : "Empty Project"
3. **Nommez** : `show-room-pro`

---

## 📝 ÉTAPE 2 : Ajouter PostgreSQL

### Dans votre projet Railway :

1. **Cliquez** : "+ New" (en haut à droite)
2. **Sélectionnez** : "Database" → "Add PostgreSQL"
3. **Attendez** que la base soit provisionnée (~30 secondes)

✅ PostgreSQL est maintenant disponible !

---

## 📝 ÉTAPE 3 : Déployer le BACKEND

### 3.1 - Lier le projet Railway localement

```bash
cd /Users/hichamrouabhi/CascadeProjects/show\ room\ pro/b2b-starter-medusa
railway link
```

Sélectionnez votre projet `show-room-pro`

### 3.2 - Créer le service backend via l'interface

1. **Dans Railway** : Cliquez "+ New"
2. **Sélectionnez** : "GitHub Repo" OU "Empty Service"

#### Si vous utilisez GitHub :
- Connectez votre repo
- Railway détectera automatiquement le monorepo

#### Si vous utilisez Empty Service :
- Nommez-le : `backend`
- Configurez **Root Directory** : `backend`
- Configurez **Build Command** : `yarn install && yarn build`
- Configurez **Start Command** : `yarn start`

### 3.3 - Configurer les variables d'environnement Backend

**Dans Railway → Service Backend → Variables**

Cliquez "New Variable" et ajoutez :

```bash
# Database (référence automatique à PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Secrets (GÉNÉREZ VOS PROPRES VALEURS)
JWT_SECRET=VotreSecretJWT32CaracteresMinimum
COOKIE_SECRET=VotreSecretCookie32CaracteresMin

# CORS (À METTRE À JOUR après avoir les URLs Railway)
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000

# Port
PORT=9000

# Environment
NODE_ENV=production
```

**💡 Astuce** : Pour générer des secrets forts :
```bash
openssl rand -base64 32
```

### 3.4 - Déployer le backend

Le déploiement se fera automatiquement après la configuration.

**Attendez** que le build se termine (~3-5 minutes)

### 3.5 - Initialiser la base de données

Une fois le backend déployé, exécutez :

```bash
# Liez le service backend
railway service backend

# Exécutez les migrations
railway run yarn medusa db:create
railway run yarn medusa db:migrate

# Seed les données
railway run yarn run seed

# Créez l'utilisateur admin
railway run yarn medusa user -e admin@showroompro.com -p VotreMotDePasseSecurise -i admin
```

### 3.6 - Récupérer la clé publique (IMPORTANT)

```bash
railway connect postgres
```

Dans le shell PostgreSQL :
```sql
SELECT token FROM api_key WHERE type = 'publishable';
```

**💾 COPIEZ la clé qui commence par `pk_...`** - vous en aurez besoin !

Tapez `\q` pour quitter.

---

## 📝 ÉTAPE 4 : Déployer le STOREFRONT

### 4.1 - Créer le service storefront

1. **Dans Railway** : Cliquez "+ New"
2. **Sélectionnez** : "GitHub Repo" OU "Empty Service"

#### Si vous utilisez Empty Service :
- Nommez-le : `storefront`
- Configurez **Root Directory** : `storefront`
- Configurez **Build Command** : `yarn install && yarn build`
- Configurez **Start Command** : `yarn start`

### 4.2 - Configurer les variables d'environnement Storefront

**Dans Railway → Service Storefront → Variables**

```bash
# Backend URL (remplacez par votre URL Railway backend)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend-production-xxxx.up.railway.app

# Clé publique (celle que vous avez copiée à l'étape 3.6)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_votre_cle_publique_ici

# Storefront URL (sera disponible après déploiement)
NEXT_PUBLIC_BASE_URL=https://storefront-production-xxxx.up.railway.app

# Région par défaut
NEXT_PUBLIC_DEFAULT_REGION=us

# Secret de revalidation
REVALIDATE_SECRET=VotreSecretRevalidation32Car

# Environment
NODE_ENV=production
```

### 4.3 - Déployer le storefront

Le déploiement se fera automatiquement.

**Attendez** que le build se termine (~3-5 minutes)

---

## 📝 ÉTAPE 5 : Mettre à jour les CORS

### Une fois tous les services déployés :

1. **Notez vos URLs Railway** :
   - Backend : `https://backend-production-xxxx.up.railway.app`
   - Storefront : `https://storefront-production-xxxx.up.railway.app`

2. **Retournez dans** : Railway → Service Backend → Variables

3. **Mettez à jour** :
   ```bash
   STORE_CORS=https://storefront-production-xxxx.up.railway.app
   ADMIN_CORS=https://backend-production-xxxx.up.railway.app
   AUTH_CORS=https://backend-production-xxxx.up.railway.app
   ```

4. **Le backend va redéployer** automatiquement

---

## ✅ VÉRIFICATION

### Testez vos URLs :

1. **Backend API** : `https://backend-xxx.railway.app/health`
2. **Admin Dashboard** : `https://backend-xxx.railway.app/app`
   - Email : `admin@showroompro.com`
   - Password : Celui que vous avez défini

3. **Storefront** : `https://storefront-xxx.railway.app`

---

## 🐛 Dépannage

### Problème : Build échoue

**Solution** :
```bash
railway logs --service backend
# ou
railway logs --service storefront
```

Vérifiez les erreurs dans les logs.

### Problème : CORS errors

**Solution** : Vérifiez que les URLs dans `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` correspondent exactement aux URLs Railway.

### Problème : "Invalid publishable key"

**Solution** : Récupérez la clé depuis la base de données :
```bash
railway connect postgres
SELECT token FROM api_key WHERE type = 'publishable';
```

---

## 📊 Commandes utiles

```bash
# Status général
railway status

# Logs en temps réel
railway logs --service backend
railway logs --service storefront

# Shell interactif
railway shell --service backend

# Ouvrir l'interface web
railway open
```

---

## 🎉 Félicitations !

Votre application Show Room Pro est déployée sur Railway ! 🚀

**URLs finales** :
- Admin : `https://backend-xxx.railway.app/app`
- Storefront : `https://storefront-xxx.railway.app`
