# 🎯 GUIDE VISUEL - Configuration Railway (5 minutes)

## ▶️ Railway s'est ouvert dans votre navigateur

---

## 📝 ÉTAPE 1 : Créer le service BACKEND (2 min)

### 1.1 - Créer le service
- ✅ Cliquez sur **"+ New"** (bouton bleu en haut à droite)
- ✅ Sélectionnez **"Empty Service"**

### 1.2 - Renommer en "backend"
- ✅ Cliquez sur le nom du service en haut
- ✅ Tapez : **backend**
- ✅ Appuyez sur Entrée

### 1.3 - Configurer le Root Directory
- ✅ Cliquez sur **"Settings"** (dans le menu latéral gauche)
- ✅ Scrollez jusqu'à **"Root Directory"**
- ✅ Tapez : **backend**
- ✅ Cliquez **"Update"**

### 1.4 - Ajouter les variables d'environnement
- ✅ Cliquez sur **"Variables"** (dans le menu latéral gauche)
- ✅ Cliquez sur **"Raw Editor"** (basculer le mode si nécessaire)
- ✅ **COPIEZ-COLLEZ** exactement ceci :

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=zB0cBGOv6ZosVsdqiCqMRnlJlJalpSwqdRf3DcKcuZI=
COOKIE_SECRET=i5+4dsUzQpkE5P7rHMDZvgcuGiR/iigmuKZ0DMkpCHM=
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000
PORT=9000
NODE_ENV=production
```

- ✅ Cliquez **"Save"** ou **"Add"**

---

## 📝 ÉTAPE 2 : Créer le service STOREFRONT (2 min)

### 2.1 - Revenir à la vue projet
- ✅ Cliquez sur **"show room pro"** (en haut, nom du projet)

### 2.2 - Créer le service storefront
- ✅ Cliquez sur **"+ New"**
- ✅ Sélectionnez **"Empty Service"**

### 2.3 - Renommer en "storefront"
- ✅ Cliquez sur le nom
- ✅ Tapez : **storefront**
- ✅ Appuyez sur Entrée

### 2.4 - Configurer le Root Directory
- ✅ **"Settings"** → **"Root Directory"** → **storefront**
- ✅ Cliquez **"Update"**

### 2.5 - Ajouter les variables d'environnement
- ✅ Cliquez sur **"Variables"**
- ✅ Mode **"Raw Editor"**
- ✅ **COPIEZ-COLLEZ** :

```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_temp
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_REGION=us
REVALIDATE_SECRET=rMTxQNkTbCexsMqXmpGBW0xga77kmT6FpScZz+Ku6ak=
NODE_ENV=production
```

- ✅ Cliquez **"Save"**

---

## ✅ ÉTAPE 3 : Vérifier (30 sec)

Retournez à la vue projet (cliquez sur "show room pro" en haut)

Vous devriez voir **3 boîtes** :
- 🟢 **Postgres** (base de données)
- 🔵 **backend** (en cours de déploiement...)
- 🔵 **storefront** (en cours de déploiement...)

---

## ⏳ ATTENDRE LE DÉPLOIEMENT

Les services vont :
1. 🔵 Devenir bleus (building...)
2. 🟢 Devenir verts (deployed ✅)

**Cela prend 3-5 minutes**

---

## 🎉 C'EST TOUT !

Une fois que le **backend est VERT** :

1. Revenez au terminal
2. Appuyez sur **ENTRÉE** pour continuer
3. Le script va automatiquement :
   - ✅ Initialiser la base de données
   - ✅ Créer l'admin
   - ✅ Récupérer la clé publique

---

## 📱 Résultat final

Après tout ça, vous aurez :
- ✅ **Admin** : https://backend-xxx.railway.app/app
- ✅ **Storefront** : https://storefront-xxx.railway.app
- ✅ **Base de données** : PostgreSQL opérationnel

---

**🚀 Suivez simplement ce guide et tout sera déployé !**
