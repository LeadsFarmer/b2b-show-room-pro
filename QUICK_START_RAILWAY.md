# 🚀 Démarrage rapide - Déploiement Railway

## Option 1 : Script automatisé (Recommandé)

```bash
./deploy-railway.sh
```

Suivez le menu interactif pour :
1. Initialiser le projet Railway
2. Déployer les services
3. Configurer la base de données

---

## Option 2 : Commandes manuelles

### 1️⃣ Connexion et initialisation

```bash
railway login
railway init
```

### 2️⃣ Ajouter PostgreSQL

```bash
railway add --database postgres
```

Ou via l'interface web Railway.

### 3️⃣ Déployer le backend

```bash
# Depuis la racine du projet
cd backend
railway up
```

**Configurez les variables d'environnement** (voir `backend/.env.railway.example`)

### 4️⃣ Initialiser la base de données

```bash
railway run yarn medusa db:create
railway run yarn medusa db:migrate
railway run yarn run seed
railway run yarn medusa user -e admin@showroompro.com -p VotreMotDePasse -i admin
```

### 5️⃣ Récupérer la clé publique

```bash
railway connect postgres
# Dans le shell PostgreSQL :
SELECT token FROM api_key WHERE type = 'publishable';
```

Copiez la clé `pk_...`

### 6️⃣ Déployer le storefront

```bash
cd ../storefront
railway up
```

**Configurez les variables d'environnement** (voir `storefront/.env.railway.example`)

**N'oubliez pas d'ajouter la clé publique dans :**
```
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_votre_cle_ici
```

### 7️⃣ Mettre à jour les CORS

Une fois les URLs Railway générées, mettez à jour dans le backend :

```bash
STORE_CORS=https://votre-storefront.railway.app
ADMIN_CORS=https://votre-backend.railway.app
AUTH_CORS=https://votre-backend.railway.app
```

---

## 📋 Checklist

- [ ] Railway CLI installé
- [ ] Projet Railway créé
- [ ] PostgreSQL ajouté
- [ ] Backend déployé
- [ ] Variables backend configurées
- [ ] Migrations exécutées
- [ ] Seed effectué
- [ ] Admin créé
- [ ] Clé publique récupérée
- [ ] Storefront déployé
- [ ] Variables storefront configurées (avec clé publique)
- [ ] CORS mis à jour

---

## 🆘 Besoin d'aide ?

Consultez le guide complet : **`RAILWAY_DEPLOYMENT.md`**

## 📚 Ressources

- [Railway Docs](https://docs.railway.app/)
- [Medusa Docs](https://docs.medusajs.com/)

---

**Bon déploiement ! 🎉**
