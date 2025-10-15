# 🚂 Show Room Pro - Déploiement Railway

## 🎯 Vue d'ensemble

Ce projet est **prêt pour le déploiement sur Railway** avec une configuration spécifique pour Show Room Pro, une plateforme B2B e-commerce basée sur Medusa.js et Next.js.

---

## 🏗️ Architecture

```
Show Room Pro (Railway Project)
│
├── 📊 PostgreSQL Database
│   └── Base de données principale
│
├── 🔧 Backend Service (Medusa)
│   ├── Port: 9000
│   ├── Root: backend/
│   └── API + Admin Dashboard
│
└── 🌐 Storefront Service (Next.js)
    ├── Port: 8000
    ├── Root: storefront/
    └── Frontend B2B
```

---

## ⚡ Démarrage rapide

### Option 1 : Script automatisé (Recommandé)

```bash
./deploy-railway.sh
```

### Option 2 : Commandes manuelles

```bash
# 1. Se connecter
railway login

# 2. Initialiser le projet
railway init

# 3. Ajouter PostgreSQL
railway add --database postgres

# 4. Suivre le guide complet
cat RAILWAY_DEPLOYMENT.md
```

---

## 📁 Fichiers de configuration

| Fichier | Description |
|---------|-------------|
| `railway.json` | Configuration globale Railway |
| `backend/nixpacks.toml` | Build config backend |
| `storefront/nixpacks.toml` | Build config storefront |
| `backend/.env.railway.example` | Variables backend |
| `storefront/.env.railway.example` | Variables storefront |
| `deploy-railway.sh` | Script de déploiement |

---

## 📚 Documentation disponible

1. **`RAILWAY_DEPLOYMENT.md`** - Guide complet détaillé (LIRE EN PREMIER)
2. **`QUICK_START_RAILWAY.md`** - Guide de démarrage rapide
3. **`CHANGELOG_RAILWAY.md`** - Historique des modifications
4. **`README_RAILWAY.md`** - Ce fichier

---

## ✅ Checklist avant déploiement

- [ ] Railway CLI installé (`railway --version`)
- [ ] Compte Railway créé et connecté
- [ ] Secrets générés (JWT_SECRET, COOKIE_SECRET)
- [ ] Code commité sur Git
- [ ] Documentation lue (RAILWAY_DEPLOYMENT.md)

---

## 🔑 Variables d'environnement requises

### Backend minimum
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<générer>
COOKIE_SECRET=<générer>
STORE_CORS=<url-storefront>
ADMIN_CORS=<url-backend>
AUTH_CORS=<url-backend>
```

### Storefront minimum
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=<url-backend>
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<depuis-db>
NEXT_PUBLIC_BASE_URL=<url-storefront>
NEXT_PUBLIC_DEFAULT_REGION=us
```

---

## 🚀 Ordre de déploiement

1. ✅ **PostgreSQL** (via Railway)
2. ✅ **Backend** → Migrations → Seed → Récupérer clé publique
3. ✅ **Storefront** → Configurer avec clé publique
4. ✅ **CORS** → Mettre à jour avec vraies URLs

---

## 🛠️ Commandes utiles

```bash
# Status du projet
railway status

# Voir les logs
railway logs --service backend
railway logs --service storefront

# Shell interactif
railway shell --service backend

# Connexion DB
railway connect postgres

# Exécuter une commande
railway run <commande>

# Ouvrir Railway web
railway open
```

---

## 📞 Support

### Problèmes courants
- **CORS errors** → Vérifier `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`
- **Invalid key** → Récupérer clé publique depuis DB
- **Build fails** → Vérifier logs avec `railway logs`

### Documentation complète
Consultez `RAILWAY_DEPLOYMENT.md` pour le guide complet avec troubleshooting.

---

## 🎉 Après déploiement

Vos URLs seront :
- **Backend API**: `https://backend-production-xxxx.railway.app`
- **Admin**: `https://backend-production-xxxx.railway.app/app`
- **Storefront**: `https://storefront-production-xxxx.railway.app`

---

## 🌟 Personnalisation Show Room Pro

Le projet est déjà personnalisé avec :
- ✅ Branding "Show Room Pro"
- ✅ Textes en français
- ✅ Footer personnalisé
- ✅ Métadonnées SEO
- ✅ Structure multi-régions (us, fr, gb, de, es, it...)

---

**Prêt à déployer ? Lancez `./deploy-railway.sh` ! 🚀**
