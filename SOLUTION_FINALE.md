# 🎯 SOLUTION FINALE - Initialisation DB

## ❌ PROBLÈME

Les commandes `railway run` ne fonctionnent pas car :
1. La base de données PostgreSQL est sur Railway (pas en local)
2. Les variables d'environnement ne sont pas accessibles localement

## ✅ SOLUTION : Utiliser Railway Web Terminal

### **ÉTAPE 1 : Aller sur Railway.app**

1. Ouvrez : https://railway.app/project/showroompro
2. Cliquez sur le service **Backend**
3. En haut, cherchez l'onglet **"Logs"** ou les **3 points (...)**
4. Cherchez l'option **"Shell"**, **"Terminal"** ou **"Run Command"**

### **ÉTAPE 2 : Dans le terminal web Railway**

Exécutez ces commandes **UNE PAR UNE** :

```bash
# 1. Migrations
yarn medusa db:migrate
```

Attendez que ça finisse ✅, puis :

```bash
# 2. Seed
yarn run seed
```

Attendez que ça finisse ✅, puis :

```bash
# 3. Créer l'admin
yarn medusa user -e admin@showroompro.com -p VotreMotDePasse123! -i admin
```

### **ÉTAPE 3 : Récupérer la clé publique**

Toujours dans le terminal web OU dans PostgreSQL :

**Option A - Terminal Backend :**
```bash
yarn medusa exec "SELECT token FROM api_key WHERE type = 'publishable';"
```

**Option B - PostgreSQL :**
1. Cliquez sur service **PostgreSQL**
2. Onglet **"Connect"**
3. Choisissez **"psql"** ou **"Query"**
4. Exécutez :
```sql
SELECT token FROM api_key WHERE type = 'publishable';
```

**💾 COPIEZ la clé `pk_...`**

### **ÉTAPE 4 : Mettre la clé dans Storefront**

1. Service **Storefront** → **Variables**
2. Modifiez `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
3. Collez la clé `pk_...`
4. **Save**

---

## 🔍 OÙ TROUVER LE TERMINAL SUR RAILWAY ?

Railway peut avoir différentes interfaces selon la version :

### **Interface récente :**
- Service Backend → Onglet **"Shell"** en haut
- OU cliquez sur les **3 points (...)** → **"Run Command"**

### **Interface classique :**
- Service Backend → Section **"Terminal"**
- OU bouton **"Open Shell"**

### **Si vous ne trouvez pas le terminal :**
On peut aussi exécuter via **Railway CLI avec le bon contexte** :

```bash
cd backend
railway service backend
railway shell
```

Puis dans le shell qui s'ouvre :
```bash
yarn medusa db:migrate
yarn run seed
yarn medusa user -e admin@showroompro.com -p Pass123! -i admin
```

---

## 📊 ALTERNATIVE : One-shot deploy

Si vraiment aucune solution ne fonctionne, on peut créer un script de déploiement qui s'exécute automatiquement au démarrage du backend.

---

## ✅ RÉSUMÉ

**La clé : Exécuter les commandes SUR Railway, pas en local !**

1. Railway.app → Backend → Terminal/Shell
2. Migrations + Seed + Admin
3. Récupérer clé publique
4. Mettre dans Storefront
5. ✅ Tout fonctionne !

---

**Essayez d'abord la méthode du terminal web Railway ! 🚀**
