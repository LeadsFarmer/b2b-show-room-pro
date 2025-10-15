# 🎯 COMMENCEZ ICI - Déploiement Railway

## ⚡ Démarrage ultra-rapide

### 1️⃣ Depuis ce répertoire, lancez :

```bash
cd /Users/hichamrouabhi/CascadeProjects/show\ room\ pro/b2b-starter-medusa
./railway-deploy.sh
```

---

## 📋 Ordre de déploiement

### Phase 1 : Créer les services sur Railway.app

1. **Allez sur** : https://railway.app/new
2. **Créez** un projet vide : `show-room-pro`
3. **Ajoutez PostgreSQL** : Click "+ New" → Database → PostgreSQL
4. **Créez le service backend** :
   - Click "+ New" → Empty Service
   - Nom : `backend`
   - Settings → Root Directory : `backend`
   - Variables : Voir ci-dessous ⬇️
5. **Créez le service storefront** :
   - Click "+ New" → Empty Service
   - Nom : `storefront`
   - Settings → Root Directory : `storefront`
   - Variables : Voir ci-dessous ⬇️

---

### Variables Backend (Railway → backend → Variables)

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<générer avec: openssl rand -base64 32>
COOKIE_SECRET=<générer avec: openssl rand -base64 32>
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000
PORT=9000
NODE_ENV=production
```

### Variables Storefront (Railway → storefront → Variables)

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://votre-backend.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_<à récupérer après init DB>
NEXT_PUBLIC_BASE_URL=https://votre-storefront.railway.app
NEXT_PUBLIC_DEFAULT_REGION=us
REVALIDATE_SECRET=<générer avec: openssl rand -base64 32>
NODE_ENV=production
```

---

### Phase 2 : Utiliser le script

```bash
./railway-deploy.sh
```

**Menu :**
1. Lier le projet (première fois)
2. Initialiser la DB (après déploiement backend)
3. Récupérer la clé publique
4-5. Voir les logs
6. Ouvrir Railway

---

### Phase 3 : Finaliser

1. **Copiez la clé publique** (option 3 du script)
2. **Ajoutez-la** dans les variables du storefront
3. **Mettez à jour CORS** dans le backend avec les vraies URLs Railway
4. **Testez !**

---

## 🎉 URLs finales

- **Admin** : `https://votre-backend.railway.app/app`
- **Storefront** : `https://votre-storefront.railway.app`

---

## 📚 Aide

- **Guide détaillé** : `DEPLOY_GUIDE.md`
- **Script** : `./railway-deploy.sh`
- **Erreur ?** : Vérifiez les logs avec l'option 4 ou 5 du script

---

**C'est parti ! 🚀**
