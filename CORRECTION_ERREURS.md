# 🔧 CORRECTION DES ERREURS DE DÉPLOIEMENT

## ❌ PROBLÈMES IDENTIFIÉS

### 1. Storefront : Variable manquante
```
Error: Missing required environment variables
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
```

### 2. Backend : Healthcheck continu
```
Starting Healthcheck
Path: /health
Retry window: 12m0s
```

---

## ✅ SOLUTIONS

### **ACTION 1 : Ajouter la clé temporaire (Storefront)**

**Sur Railway.app :**

1. Projet **showroompro** → Service **Storefront**
2. Onglet **Variables**
3. Cliquez **"New Variable"**
4. Ajoutez :
   ```
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_01JYPQRSTUVWXYZ0123456789ABC
   ```
   *(Valeur temporaire, on la remplacera après)*

5. Le storefront va redéployer automatiquement

---

### **ACTION 2 : Initialiser la base de données (Backend)**

**Sur Railway.app :**

1. Projet **showroompro** → Service **Backend**
2. Onglet **Shell** ou **Terminal** (en haut)
3. **Exécutez ces commandes UNE PAR UNE** :

```bash
# 1. Migrations de la base de données
yarn medusa db:migrate
```

Attendez que ça termine, puis :

```bash
# 2. Seed des données initiales
yarn run seed
```

Attendez que ça termine, puis :

```bash
# 3. Créer l'utilisateur admin
yarn medusa user -e admin@showroompro.com -p VotreMotDePasse123! -i admin
```

---

### **ACTION 3 : Récupérer la VRAIE clé publique**

**Option A - Via le shell Backend :**

Dans le shell Backend :
```bash
yarn medusa exec "SELECT token FROM api_key WHERE type = 'publishable';"
```

**Option B - Via PostgreSQL :**

1. Service **PostgreSQL** → **Connect**
2. Choisissez **"psql"**
3. Dans le shell :
```sql
SELECT token FROM api_key WHERE type = 'publishable';
```

**💾 COPIEZ la clé qui commence par `pk_...`**

---

### **ACTION 4 : Remplacer la clé temporaire**

1. Service **Storefront** → **Variables**
2. Modifiez `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
3. Collez la vraie clé : `pk_01...` (celle que vous venez de copier)
4. Sauvegarder

Le storefront va redéployer avec la bonne clé.

---

### **ACTION 5 : Mettre à jour les URLs CORS**

Une fois tout déployé, notez vos URLs :

**Backend URL** : `https://backend-production-xxxx.up.railway.app`  
**Storefront URL** : `https://storefront-production-xxxx.up.railway.app`

**Mettez à jour les variables Backend :**

```bash
STORE_CORS=https://storefront-production-xxxx.up.railway.app
ADMIN_CORS=https://backend-production-xxxx.up.railway.app
AUTH_CORS=https://backend-production-xxxx.up.railway.app
```

**Mettez à jour les variables Storefront :**

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend-production-xxxx.up.railway.app
NEXT_PUBLIC_BASE_URL=https://storefront-production-xxxx.up.railway.app
```

---

## 📊 ORDRE CORRECT

```
1️⃣  Ajouter clé temporaire au Storefront → Déploiement OK
2️⃣  Backend se déploie → Healthcheck OK  
3️⃣  Initialiser la DB (migrations + seed) → Données OK
4️⃣  Créer l'admin → Admin OK
5️⃣  Récupérer la vraie clé publique → Clé OK
6️⃣  Remplacer la clé dans Storefront → Redéploiement OK
7️⃣  Mettre à jour les CORS et URLs → Config finale OK
8️⃣  Tester ! → Application opérationnelle ✅
```

---

## ✅ CHECKLIST

- [ ] Clé temporaire ajoutée au Storefront
- [ ] Storefront déployé (🟢)
- [ ] Backend déployé (🟢)
- [ ] Migrations exécutées
- [ ] Seed effectué
- [ ] Admin créé
- [ ] Vraie clé publique récupérée
- [ ] Clé mise à jour dans Storefront
- [ ] URLs CORS mises à jour
- [ ] Variables URLs mises à jour
- [ ] Test Backend API : https://backend-xxx/health
- [ ] Test Admin : https://backend-xxx/app
- [ ] Test Storefront : https://storefront-xxx/

---

## 🎯 RÉSULTAT FINAL

✅ Backend opérationnel avec base de données  
✅ Admin accessible  
✅ Storefront avec branding Show Room Pro  
✅ Application complète fonctionnelle !

---

**Suivez les actions dans l'ordre et tout fonctionnera ! 🚀**
