# Configuration des Variables d'Environnement Railway

## 🎯 Problème Actuel

- **Région par défaut** : Le site redirige vers `/dk` (Danemark) au lieu de `/fr-fr` (France)
- **Cause** : Variable `NEXT_PUBLIC_DEFAULT_REGION` non définie sur Railway

---

## ✅ Solution : Ajouter les Variables d'Environnement

### 1. **Accédez à votre Storefront sur Railway**

```
Railway Dashboard > Projet srpB2B > Service Storefront > Variables
```

### 2. **Ajoutez/Vérifiez ces Variables**

#### **Variable Cruciale** (Résout le problème de région)
```bash
NEXT_PUBLIC_DEFAULT_REGION=fr
```

#### **Variables Complètes à Vérifier**
```bash
# Backend URL (remplacez par votre URL backend)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend-production-xxxx.up.railway.app

# Publishable API Key (récupérez depuis le backend)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxx

# Storefront URL (remplacez par votre URL storefront)
NEXT_PUBLIC_BASE_URL=https://storefront-production-xxxx.up.railway.app

# Région par défaut (IMPORTANT !)
NEXT_PUBLIC_DEFAULT_REGION=fr

# Next.js Revalidation Secret
REVALIDATE_SECRET=votre_secret_fort_ici

# Environment
NODE_ENV=production
```

### 3. **Sauvegardez et Redéployez**

Une fois les variables ajoutées, Railway redéploiera automatiquement le storefront.

---

## 🔍 Comment Récupérer les Valeurs

### **NEXT_PUBLIC_MEDUSA_BACKEND_URL**
```
Railway > Backend Service > Settings > Public Networking
→ Copiez l'URL (ex: https://backend-production-xxxx.up.railway.app)
```

### **NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY**

Option 1 - Via Admin Medusa :
```
1. Allez sur https://backend-production-xxxx.up.railway.app/app
2. Connectez-vous avec admin@medusa-test.com / supersecret
3. Settings > Publishable API Keys
4. Copiez la clé (commence par pk_)
```

Option 2 - Via les logs backend :
```
Railway > Backend Service > Logs
→ Cherchez "publishable" dans les logs de seed
```

### **NEXT_PUBLIC_BASE_URL**
```
Railway > Storefront Service > Settings > Public Networking
→ Copiez l'URL (ex: https://storefront-production-xxxx.up.railway.app)
```

---

## 📊 Vérification Post-Déploiement

### Teste la Région par Défaut
```
1. Visitez : https://storefront-production-xxxx.up.railway.app
2. Vous devriez être redirigé vers /fr-fr automatiquement
3. Plus de redirection vers /dk
```

### Teste les Pages
```
✅ Homepage : /fr-fr
✅ Store : /fr-fr/store
✅ Recherche : /fr-fr/search (page temporaire)
✅ Admin Backend : /app
```

---

## 🚨 Notes Importantes

### **Ordre de Priorité du Middleware**
Le middleware Medusa détermine la région dans cet ordre :

1. **URL** : Si `/fr-fr` est dans l'URL → utilise "fr"
2. **Vercel Header** : Si `x-vercel-ip-country: FR` → utilise "fr"
3. **Variable d'environnement** : Si `NEXT_PUBLIC_DEFAULT_REGION=fr` → utilise "fr"
4. **Premier code pays disponible** : Prend le premier de regionMap (peut être "dk")

**Solution** : Définir `NEXT_PUBLIC_DEFAULT_REGION=fr` garantit que même sans header Vercel, la région sera "fr".

### **Codes Pays Disponibles**
Selon votre seed backend, les régions disponibles sont probablement :
- `fr` : France
- `dk` : Danemark
- `us` : États-Unis
- etc.

Pour vérifier les régions dans votre backend :
```bash
curl https://backend-production-xxxx.up.railway.app/store/regions \
  -H "x-publishable-api-key: pk_xxxxx"
```

---

## 🎯 Résultat Attendu

Après avoir ajouté `NEXT_PUBLIC_DEFAULT_REGION=fr` et redéployé :

```
✅ https://storefront-production-xxxx.up.railway.app
   → Redirige vers /fr-fr

✅ https://storefront-production-xxxx.up.railway.app/search
   → Redirige vers /fr-fr/search

✅ https://storefront-production-xxxx.up.railway.app/store
   → Redirige vers /fr-fr/store
```

Plus aucune redirection vers `/dk` ! 🎉
