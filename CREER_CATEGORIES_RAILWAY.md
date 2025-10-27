# 🎯 Créer les Catégories B2B sur Railway

Vous avez **3 options** pour créer les catégories sur votre backend Railway déployé.

---

## ✅ Option 1 : Via Admin Medusa (Le Plus Simple) 🖥️

### Étape 1 : Accédez à l'Admin

1. Ouvrez votre navigateur
2. Allez sur : `https://VOTRE-BACKEND.railway.app/app`
   - Trouvez l'URL dans Railway Dashboard > Backend > Settings > Domains
3. **Login** :
   - Email : `admin@medusa-test.com`
   - Password : `supersecret`

### Étape 2 : Vérifiez si les Catégories Existent

1. Dans le menu latéral : **Products** → **Categories**
2. Si vous voyez déjà les catégories, **c'est bon !** ✅
3. Sinon, passez à l'étape 3

### Étape 3 : Créer les Catégories Manuellement (si nécessaire)

**Option A : Import via Script**

Le seed se lance **automatiquement au démarrage** sur Railway.

Pour forcer un re-seed :
1. Railway Dashboard > Backend
2. Onglet **"Deployments"**
3. Cliquez sur **"Redeploy"**
4. Le seed se lancera automatiquement ✅

**Option B : Créer Manuellement** (si vous voulez tester)

Dans l'admin Medusa :
1. **Products** → **Categories** → **Create Category**
2. Créez la première catégorie principale :
   ```
   Name: Tech Grand Public
   Handle: tech
   Description: Produits tech grand public B2B
   ```
3. Puis créez une sous-catégorie :
   ```
   Name: Traqueurs & Find My
   Handle: trackers-find-my
   Parent Category: Tech Grand Public
   Description: Traqueurs Bluetooth et Find My Network
   ```

---

## ⚡ Option 2 : Via API Endpoint (Plus Rapide)

Vous avez un endpoint `/api/seed` qui lance le seed à distance.

### Prérequis

Trouvez dans Railway :
1. **BACKEND_URL** : Railway Dashboard > Backend > Settings > Domains
2. **INIT_SECRET** : Railway Dashboard > Backend > Variables > INIT_SECRET

### Commande

```bash
curl -X POST "https://VOTRE-BACKEND.railway.app/api/seed?token=VOTRE_INIT_SECRET"
```

**Exemple :**
```bash
curl -X POST "https://backend-production-abc123.up.railway.app/api/seed?token=mysecrettoken123"
```

### Réponse Attendue

```json
{
  "status": "success",
  "message": "✅ Database seeded successfully!",
  "publishable_key": "pk_...",
  "instructions": {
    "storefront": "Use this key for your Storefront:",
    "variable": "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_..."
  }
}
```

---

## 🚀 Option 3 : Via Railway CLI

Si vous avez Railway CLI configuré :

```bash
# 1. Connectez-vous à Railway (dans le navigateur)
railway login

# 2. Liez le projet
railway link
# Sélectionnez : srpB2B > Backend

# 3. Exécutez le seed
railway run npm run seed
```

---

## 🔍 Vérification

### 1. Dans l'Admin Medusa

```
https://VOTRE-BACKEND.railway.app/app
→ Products → Categories
```

Vous devriez voir :
```
📱 Tech Grand Public (tech)
  ├── 📍 Traqueurs & Find My (tech/trackers-find-my)
  ├── ⌚ Wearables & Montres Connectées (tech/wearables)
  ├── 🕶️ Lunettes AI & Smart Glasses (tech/lunettes-ai)
  └── 🎧 Audio Open-Ear & ANC (tech/audio)

🖼️ PLV Numérique & Signalétique (plv)
  ├── ✨ Hologrammes 3D (plv/hologrammes-3d)
  ├── 💡 Barres LED HDMI (plv/barres-led-hdmi)
  └── 🔆 Light Boxes (plv/light-boxes)

🚴 Mobilité & Sécurité (mobilite)
  ├── 🚲 Sécurité Vélo (mobilite/securite-velo)
  └── ✈️ Accessoires Voyage (mobilite/voyage-intelligent)

😁 Beauty & Smile Care (beauty)
  ├── ✨ Blanchiment Dentaire (beauty/blanchiment)
  └── 🦷 Brosses à Dents Électriques (beauty/appareils-dentaires)

+ 4 catégories legacy (Laptops, Accessories, Phones, Monitors)
```

**Total : 18 catégories** ✅

### 2. Dans le Storefront

Testez une URL de catégorie :
```
https://VOTRE-STOREFRONT.railway.app/fr/categories/tech/trackers-find-my
```

Vous devriez voir :
- 📍 Icône et titre
- Métadonnées B2B (MOQ, Prix, Délai, Certifications)
- Liste des produits

---

## 🐛 Troubleshooting

### Les catégories ne s'affichent pas

**Cause possible :** Le seed ne s'est pas exécuté au démarrage

**Solution :**
1. Railway Dashboard > Backend > Deployments
2. Cliquez sur **"Redeploy"**
3. Attendez 2-3 minutes
4. Vérifiez les logs : Railway Dashboard > Backend > Logs
5. Cherchez : `"Seeding product categories..."`

### Erreur 403 sur /api/seed

**Cause :** Token incorrect

**Solution :**
1. Vérifiez le INIT_SECRET dans Railway > Backend > Variables
2. Utilisez le bon token dans l'URL

### Les métadonnées B2B ne s'affichent pas

**Cause :** Storefront pas redéployé avec les nouveaux templates

**Solution :**
1. Railway Dashboard > Storefront > Deployments
2. Cliquez sur **"Redeploy"**
3. Le nouveau template avec métadonnées B2B sera déployé

---

## 📊 Résumé

| Méthode | Difficulté | Temps | Quand l'utiliser |
|---------|------------|-------|------------------|
| Admin Medusa | ⭐ Facile | 2 min | Vérification visuelle |
| API Endpoint | ⭐⭐ Moyen | 30 sec | Automatisation |
| Railway CLI | ⭐⭐⭐ Avancé | 1 min | Développement |
| Redeploy Auto | ⭐ Très Facile | 3 min | Première installation |

---

## 💡 Recommandation

**Pour la première fois :**
1. ✅ Allez dans l'Admin Medusa : `https://VOTRE-BACKEND.railway.app/app`
2. ✅ Vérifiez si les catégories existent déjà (seed auto au démarrage)
3. ✅ Si non, faites un **Redeploy** du backend

**Ensuite :**
- Utilisez l'Admin Medusa pour ajouter/modifier des catégories
- Ou créez un script custom avec l'Admin API

---

**Créé avec ❤️ pour ShowRoomPro B2B**
**Date : 27 Octobre 2025**
