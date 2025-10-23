# 🔗 Connexion GitHub → Railway "showroompro"

## ✅ Ce qui est prêt

- ✅ Projet Railway "showroompro" créé avec le template
- ✅ Repo GitHub : https://github.com/LeadsFarmer/b2b-show-room-pro.git
- ✅ Code Show Room Pro personnalisé déjà dans le repo

---

## 🎯 ÉTAPES DE CONNEXION

### **Option 1 : Via l'interface Railway (RECOMMANDÉ)**

#### 1️⃣ Connecter le repo GitHub aux services

1. **Allez sur** : https://railway.app/project/showroompro
2. **Cliquez sur le service Backend**
3. **Allez dans Settings**
4. **Section "Source"** ou "GitHub Repo"
5. **Cliquez "Connect Repo"**
6. **Sélectionnez** : `LeadsFarmer/b2b-show-room-pro`
7. **Root Directory** : `backend`
8. **Branch** : `main`

#### 2️⃣ Faire pareil pour le Storefront

1. **Cliquez sur le service Storefront**
2. **Settings → Source**
3. **Connect Repo** : `LeadsFarmer/b2b-show-room-pro`
4. **Root Directory** : `storefront`
5. **Branch** : `main`

#### 3️⃣ Railway va automatiquement

- ✅ Détecter les changements
- ✅ Redéployer avec votre code Show Room Pro
- ✅ Appliquer le branding personnalisé
- ✅ Utiliser les configurations nixpacks.toml

---

### **Option 2 : Via Railway CLI (après liaison)**

Dans le terminal, sélectionnez le projet "showroompro" quand demandé, puis :

```bash
# Vérifier la liaison
railway status

# Connecter le backend au repo GitHub
railway service backend
# Puis configurez sur l'interface web

# Connecter le storefront
railway service storefront  
# Puis configurez sur l'interface web
```

---

## 🔧 Configuration des variables (si nécessaire)

### Variables Backend déjà dans le template :
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<déjà configuré>
COOKIE_SECRET=<déjà configuré>
STORE_CORS=<URL du storefront>
ADMIN_CORS=<URL du backend>
PORT=9000
NODE_ENV=production
```

### Variables Storefront à mettre à jour :
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=<URL du backend Railway>
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<à récupérer après seed>
NEXT_PUBLIC_BASE_URL=<URL du storefront Railway>
NEXT_PUBLIC_DEFAULT_REGION=us
NODE_ENV=production
```

---

## 📊 Après connexion GitHub

Railway va :
1. 🔄 Détecter le repo GitHub
2. 📥 Cloner le code Show Room Pro
3. 🔨 Builder avec vos configurations (nixpacks.toml)
4. 🚀 Redéployer automatiquement
5. ✅ Appliquer le branding Show Room Pro

**Temps estimé** : 3-5 minutes

---

## 🎯 Résultat final

Vous aurez le template Medusa avec :
- ✅ **Branding Show Room Pro** appliqué
- ✅ **Navigation personnalisée**
- ✅ **Footer en français**
- ✅ **Métadonnées SEO**
- ✅ **Multi-régions** (us, fr, gb, de, es, it)

---

## 📝 Vérification

Une fois connecté, vérifiez :
```bash
railway status
```

Vous devriez voir :
- Project: showroompro
- Services: backend, storefront, postgres
- Source: github.com/LeadsFarmer/b2b-show-room-pro

---

## 🐛 Si besoin de relancer

Si vous voulez forcer un redéploiement :
```bash
railway service backend
railway up

railway service storefront
railway up
```

---

**👉 Commencez par l'Option 1 (interface web) - c'est le plus simple !**
