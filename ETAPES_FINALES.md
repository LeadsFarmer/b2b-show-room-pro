# 🎯 ÉTAPES FINALES - Déploiement Show Room Pro

## ✅ ÉTAT ACTUEL

- ✅ Repo GitHub : LeadsFarmer/b2b-show-room-pro
- ✅ Projet Railway : showroompro
- ✅ Backend : Connecté au repo
- ✅ Storefront : Connecté au repo
- ✅ Code personnalisé Show Room Pro : Uploadé

---

## 🎬 FINALISATION (4 étapes)

### **ÉTAPE 1 : Initialiser la base de données** ⏱️ 2 min

**Sur Railway.app :**

1. Projet **showroompro** → Service **Backend**
2. Cherchez l'onglet **"Shell"** ou **"Terminal"** ou **"..."** → **"Run Command"**
3. Dans le terminal qui s'ouvre, tapez :

```bash
yarn medusa db:migrate
```
⏳ Attendez la fin, puis :

```bash
yarn run seed
```
⏳ Attendez la fin, puis :

```bash
yarn medusa user -e admin@showroompro.com -p AdminPass123! -i admin
```

✅ **Base de données prête !**

---

### **ÉTAPE 2 : Récupérer la clé publique** ⏱️ 1 min

**Option A - Terminal Backend (si toujours ouvert) :**
```bash
yarn medusa exec "SELECT token FROM api_key WHERE type = 'publishable';"
```

**Option B - PostgreSQL :**
1. Service **PostgreSQL** → **Connect** → **psql**
2. Tapez :
```sql
SELECT token FROM api_key WHERE type = 'publishable';
```

**💾 COPIEZ la clé qui commence par `pk_01...`**

---

### **ÉTAPE 3 : Configurer le Storefront** ⏱️ 1 min

**Sur Railway.app :**

1. Service **Storefront** → **Variables**
2. Trouvez `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
3. **Remplacez** la valeur par la clé `pk_01...` que vous venez de copier
4. **Ajoutez** aussi ces variables (si pas déjà là) :

```bash
NEXT_PUBLIC_DEFAULT_REGION=us
NODE_ENV=production
```

5. **Save / Deploy**

✅ **Storefront va redéployer avec la vraie clé !**

---

### **ÉTAPE 4 : Mettre à jour les URLs (IMPORTANT)** ⏱️ 2 min

**Une fois Backend et Storefront déployés (🟢) :**

#### **Noter les URLs :**

1. Service **Backend** → **Settings** → **Domains**
   - Notez : `https://backend-production-XXXX.up.railway.app`

2. Service **Storefront** → **Settings** → **Domains**
   - Notez : `https://storefront-production-XXXX.up.railway.app`

#### **Mettre à jour Backend :**

Service **Backend** → **Variables** → Modifiez :

```bash
STORE_CORS=https://storefront-production-XXXX.up.railway.app
ADMIN_CORS=https://backend-production-XXXX.up.railway.app
AUTH_CORS=https://backend-production-XXXX.up.railway.app
```

#### **Mettre à jour Storefront :**

Service **Storefront** → **Variables** → Modifiez :

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend-production-XXXX.up.railway.app
NEXT_PUBLIC_BASE_URL=https://storefront-production-XXXX.up.railway.app
```

**Save** → Les services vont redéployer

✅ **Configuration complète !**

---

## 🧪 TESTS FINAUX

### **1. Tester le Backend API**

```bash
curl https://backend-production-XXXX.up.railway.app/health
```

Devrait retourner : `{"status":"ok"}`

### **2. Tester l'Admin**

Ouvrez : `https://backend-production-XXXX.up.railway.app/app`

Connectez-vous avec :
- Email : `admin@showroompro.com`
- Mot de passe : Celui que vous avez défini

### **3. Tester le Storefront**

Ouvrez : `https://storefront-production-XXXX.up.railway.app`

Vous devriez voir :
- ✅ Logo et titre "Show Room Pro"
- ✅ Navigation personnalisée
- ✅ Footer en français
- ✅ Produits et collections

---

## 🎨 VÉRIFIER LE BRANDING

Sur le Storefront, vérifiez :

### **Page d'accueil**
- Titre : "Show Room Pro - Votre plateforme B2B"
- Navigation : Lien "Show Room Pro"

### **Footer**
- Nom : "Show Room Pro"
- Copyright : "Show Room Pro. Tous droits réservés."

### **Pages produits**
- Titre : "[Nom Produit] | Show Room Pro"

### **Checkout**
- Textes en français
- Boutons traduits

---

## ✅ CHECKLIST FINALE

- [ ] Base de données initialisée (migrations + seed)
- [ ] Admin créé
- [ ] Clé publique récupérée et configurée
- [ ] Backend déployé (🟢)
- [ ] Storefront déployé (🟢)
- [ ] URLs CORS mises à jour
- [ ] URLs Backend/Storefront mises à jour
- [ ] API santé OK : `/health` retourne `{"status":"ok"}`
- [ ] Admin accessible et login fonctionne
- [ ] Storefront affiche le branding Show Room Pro
- [ ] Navigation fonctionne
- [ ] Produits visibles
- [ ] Checkout fonctionne

---

## 🎉 FÉLICITATIONS !

Votre application **Show Room Pro** est maintenant déployée sur Railway avec :

- ✅ Branding personnalisé "Show Room Pro"
- ✅ Interface en français
- ✅ Multi-régions (us, fr, gb, de, es, it)
- ✅ Backend Medusa opérationnel
- ✅ Storefront Next.js performant
- ✅ Base de données PostgreSQL
- ✅ Admin Dashboard fonctionnel

---

## 📝 URLs DE VOTRE APPLICATION

**Backend API** : `https://backend-production-XXXX.up.railway.app`  
**Admin Dashboard** : `https://backend-production-XXXX.up.railway.app/app`  
**Storefront B2B** : `https://storefront-production-XXXX.up.railway.app`

---

## 🔄 PROCHAINES AMÉLIORATIONS

1. **Nom de domaine personnalisé**
   - Railway → Settings → Custom Domain

2. **Configuration email (SMTP)**
   - Pour les notifications et réinitialisation mot de passe

3. **Paiements**
   - Configurer Stripe ou autre provider

4. **Redis (optionnel)**
   - Pour améliorer les performances

5. **Backup base de données**
   - Configurer des backups automatiques

---

**🚀 Votre plateforme Show Room Pro est opérationnelle !**
