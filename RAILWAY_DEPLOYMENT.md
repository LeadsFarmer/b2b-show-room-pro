# 🚂 Guide de déploiement Railway - Show Room Pro

## 📋 Prérequis

- ✅ Railway CLI installé (`railway --version` = 4.10.0)
- ✅ Compte Railway actif
- ✅ Git configuré et commit initial effectué

---

## 🎯 Architecture du déploiement

Le projet sera déployé en **3 services séparés** sur Railway :

1. **PostgreSQL Database** - Base de données
2. **Backend Medusa** - API et Admin
3. **Storefront Next.js** - Site frontend

---

## 🚀 Étapes de déploiement

### **Étape 1 : Se connecter à Railway**

```bash
railway login
```

### **Étape 2 : Créer un nouveau projet Railway**

```bash
cd /Users/hichamrouabhi/CascadeProjects/show\ room\ pro/b2b-starter-medusa
railway init
```

Choisissez :
- **Create a new project**
- Donnez un nom : `show-room-pro`

### **Étape 3 : Ajouter PostgreSQL**

Dans le terminal ou via l'interface Railway :

```bash
railway add --database postgres
```

Ou via l'interface web :
1. Allez sur votre projet Railway
2. Cliquez sur **"New"** → **"Database"** → **"Add PostgreSQL"**

---

## 🔧 Configuration du Backend

### **Étape 4 : Créer le service Backend**

1. Dans Railway, cliquez sur **"New"** → **"GitHub Repo"** ou **"Empty Service"**
2. Nommez le service : `backend`
3. Configurez le **Root Directory** : `backend`

### **Étape 5 : Variables d'environnement Backend**

Allez dans **Settings → Variables** du service backend et ajoutez :

#### Variables essentielles

```bash
# Database (sera automatiquement rempli si vous liez PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT & Secrets (générez des secrets forts !)
JWT_SECRET=<générez-un-secret-fort-32-caractères>
COOKIE_SECRET=<générez-un-secret-fort-32-caractères>

# CORS - IMPORTANT : Mettre les vraies URLs après déploiement
STORE_CORS=https://your-storefront-url.railway.app
ADMIN_CORS=https://your-backend-url.railway.app
AUTH_CORS=https://your-backend-url.railway.app

# Redis (optionnel mais recommandé pour production)
# REDIS_URL=redis://redis-service-url:6379

# Port
PORT=9000
```

#### Générer des secrets forts

```bash
# Générez des secrets pour JWT_SECRET et COOKIE_SECRET
openssl rand -base64 32
openssl rand -base64 32
```

### **Étape 6 : Build & Deploy Backend**

Dans Railway, le backend va :
1. Installer les dépendances (`yarn install`)
2. Builder le projet (`yarn build`)
3. Démarrer le serveur (`yarn start`)

**Note importante** : Après le premier déploiement, vous devrez exécuter les migrations et le seed.

---

## 🌐 Configuration du Storefront

### **Étape 7 : Créer le service Storefront**

1. Dans Railway, cliquez sur **"New"** → **"GitHub Repo"** ou **"Empty Service"**
2. Nommez le service : `storefront`
3. Configurez le **Root Directory** : `storefront`

### **Étape 8 : Variables d'environnement Storefront**

Allez dans **Settings → Variables** du service storefront :

```bash
# URL du backend (sera disponible après déploiement du backend)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend-url.railway.app

# Clé publique (vous l'obtiendrez après avoir seedé la base de données)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxxxxx

# URL du storefront
NEXT_PUBLIC_BASE_URL=https://your-storefront-url.railway.app

# Région par défaut
NEXT_PUBLIC_DEFAULT_REGION=us

# Secret de revalidation Next.js
REVALIDATE_SECRET=<générez-un-secret-fort>

# Build
NODE_ENV=production
```

---

## 🗄️ Initialisation de la base de données

### **Étape 9 : Exécuter les migrations et seed**

Une fois le backend déployé, connectez-vous via Railway CLI :

```bash
# Listez vos services
railway status

# Liez-vous au service backend
railway link

# Ou spécifiez directement
railway service backend
```

#### Option 1 : Via Railway CLI

```bash
# Créer la base de données
railway run yarn medusa db:create

# Exécuter les migrations
railway run yarn medusa db:migrate

# Seed les données
railway run yarn run seed

# Créer l'utilisateur admin
railway run yarn medusa user -e admin@showroompro.com -p VotreMotDePasseSecurise -i admin
```

#### Option 2 : Via l'interface Railway (Railway Shell)

1. Allez dans votre service **backend**
2. Cliquez sur **"Shell"** ou **"Terminal"**
3. Exécutez les commandes une par une :

```bash
yarn medusa db:create
yarn medusa db:migrate
yarn run seed
yarn medusa user -e admin@showroompro.com -p VotreMotDePasseSecurise -i admin
```

---

## 🔑 Récupérer la clé publique

Après avoir seedé la base de données, récupérez la clé publique :

```bash
railway run node -e "
const sdk = require('@medusajs/js-sdk');
const client = new sdk.default({
  baseUrl: process.env.DATABASE_URL.includes('localhost') ? 'http://localhost:9000' : 'https://your-backend-url.railway.app',
  apiKey: 'admin-token'
});
// Alternativement, connectez-vous à la DB et requêtez directement
"
```

Ou connectez-vous directement à la base PostgreSQL :

```bash
railway connect postgres

# Dans le shell PostgreSQL
SELECT token FROM api_key WHERE type = 'publishable';
```

Copiez la clé `pk_...` et mettez-la dans les variables d'environnement du storefront :

```bash
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxxxxx
```

---

## 🔗 Lier les services

### **Étape 10 : Mettre à jour les CORS**

Une fois tous les services déployés, vous aurez les URLs Railway :

- Backend : `https://backend-production-xxxx.up.railway.app`
- Storefront : `https://storefront-production-xxxx.up.railway.app`

**Mettez à jour les variables d'environnement du backend** :

```bash
STORE_CORS=https://storefront-production-xxxx.up.railway.app
ADMIN_CORS=https://backend-production-xxxx.up.railway.app
AUTH_CORS=https://backend-production-xxxx.up.railway.app
```

**Et du storefront** :

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend-production-xxxx.up.railway.app
NEXT_PUBLIC_BASE_URL=https://storefront-production-xxxx.up.railway.app
```

Redéployez les services après ces modifications.

---

## 📦 Déploiement depuis le dépôt GitHub (Recommandé)

### **Option Alternative : Déploiement automatique via GitHub**

1. Poussez votre code sur GitHub :

```bash
git add .
git commit -m "Configuration Railway"
git push origin main
```

2. Dans Railway :
   - Créez un nouveau projet
   - Connectez votre dépôt GitHub
   - Railway détectera automatiquement le monorepo
   - Créez un service pour `backend/` et un pour `storefront/`

3. Railway construira et déploiera automatiquement à chaque push !

---

## ✅ Checklist de déploiement

### Avant le déploiement
- [ ] Code commité sur Git
- [ ] Railway CLI installé et connecté
- [ ] Secrets générés (JWT_SECRET, COOKIE_SECRET, etc.)

### Backend
- [ ] Service backend créé
- [ ] PostgreSQL ajouté et lié
- [ ] Variables d'environnement configurées
- [ ] Migrations exécutées
- [ ] Seed des données effectué
- [ ] Utilisateur admin créé
- [ ] Clé publique récupérée

### Storefront
- [ ] Service storefront créé
- [ ] Variables d'environnement configurées
- [ ] Clé publique ajoutée (NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)
- [ ] URL du backend configurée

### Final
- [ ] CORS mis à jour avec les vraies URLs
- [ ] Test de connexion backend
- [ ] Test de connexion storefront
- [ ] Test de l'admin Medusa
- [ ] Test du checkout

---

## 🐛 Debugging

### Voir les logs

```bash
# Backend logs
railway logs --service backend

# Storefront logs
railway logs --service storefront
```

### Se connecter au shell

```bash
# Backend shell
railway shell --service backend

# Base de données
railway connect postgres
```

### Problèmes courants

#### ❌ "Connection refused" sur le backend
- Vérifiez que `DATABASE_URL` est bien configuré
- Assurez-vous que PostgreSQL est lié au backend

#### ❌ "Invalid publishable key" sur le storefront
- Récupérez la vraie clé depuis la base de données
- Vérifiez que le seed a bien été exécuté

#### ❌ Erreurs CORS
- Mettez à jour `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` avec les vraies URLs Railway
- Redéployez le backend après modification

---

## 🎉 URLs finales

Après déploiement réussi :

- **Backend API** : `https://backend-production-xxxx.up.railway.app`
- **Admin Medusa** : `https://backend-production-xxxx.up.railway.app/app`
- **Storefront** : `https://storefront-production-xxxx.up.railway.app`

### Connexion Admin
- Email : `admin@showroompro.com`
- Mot de passe : Celui défini lors de la création

---

## 📚 Ressources

- [Railway Documentation](https://docs.railway.app/)
- [Medusa Documentation](https://docs.medusajs.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🔄 Commandes utiles

```bash
# Lister les projets
railway list

# Status du projet
railway status

# Lier un service
railway service <nom-du-service>

# Exécuter une commande sur Railway
railway run <commande>

# Ouvrir l'interface web
railway open
```

---

**Bon déploiement ! 🚀**
