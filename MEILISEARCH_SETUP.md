# 🔍 Activation Meilisearch sur Railway

## ✅ Configuration Ajoutée

La configuration Meilisearch est maintenant dans `backend/medusa-config.ts` !

---

## 🚀 Variables d'Environnement Railway

### Sur le service **Backend** Railway, ajouter :

```bash
MEILISEARCH_HOST=<URL_MEILISEARCH_RAILWAY>
MEILISEARCH_API_KEY=<MASTER_KEY_MEILISEARCH>
```

### Trouver les Valeurs :

1. **MEILISEARCH_HOST**
   ```
   Dans Railway > Service Meilisearch > Settings > Public Networking
   Format: https://xxxxx.railway.app
   ```

2. **MEILISEARCH_API_KEY**
   ```
   Dans Railway > Service Meilisearch > Variables
   Chercher: MEILI_MASTER_KEY
   Copier la valeur
   ```

---

## 📋 Étapes Complètes

### 1. Dans Railway Dashboard

```
1. Ouvrir projet "srpB2B"
2. Aller dans service "Backend"
3. Onglet "Variables"
4. Ajouter les 2 variables d'environnement
5. Sauvegarder (redéploiement automatique)
```

### 2. Vérifier Meilisearch

```
Aller sur: https://VOTRE_MEILISEARCH_HOST.railway.app/health

Devrait retourner:
{
  "status": "available"
}
```

### 3. Tester la Recherche

Une fois le backend redéployé avec les variables :

```
1. Les produits seront automatiquement indexés
2. Le champ de recherche sera actif
3. Cliquer dessus redirigera vers /search
4. La recherche fonctionnera !
```

---

## 🔧 Configuration Actuelle

```typescript
// backend/medusa-config.ts
[Modules.INDEX]: {
  resolve: "@medusajs/medusa/search",
  options: {
    provider: "meilisearch",
    options: {
      config: {
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY,
      },
      settings: {
        products: {
          indexSettings: {
            searchableAttributes: [
              "title",          // Nom du produit
              "description",    // Description
              "variant_sku",    // SKU (important B2B!)
            ],
            displayedAttributes: [
              "title",
              "description",
              "thumbnail",
              "handle",
            ],
          },
        },
      },
    },
  },
}
```

---

## ✨ Fonctionnalités Activées

Après configuration :

```
✅ Recherche en temps réel
✅ Recherche typo-tolérante
✅ Recherche par titre
✅ Recherche par description
✅ Recherche par SKU (important B2B)
✅ Résultats instantanés
✅ Auto-indexation des nouveaux produits
```

---

## 🐛 Dépannage

### Si la recherche ne marche pas :

1. **Vérifier les variables**
   ```bash
   railway logs -s backend | grep MEILISEARCH
   ```

2. **Vérifier Meilisearch**
   ```bash
   curl https://VOTRE_MEILISEARCH_HOST/health
   ```

3. **Réindexer manuellement**
   ```bash
   # Dans Medusa Admin
   # Settings > Search > Reindex Products
   ```

4. **Vérifier les logs**
   ```bash
   railway logs -s backend -f
   ```

---

## 📊 Résultat Attendu

Avant configuration :
```
🔍 [Champ grisé, non cliquable]
```

Après configuration :
```
🔍 [Champ actif] → Clic → Page /search
    ↓
    Recherche instantanée sur tous les produits
```

---

## ⚡ Actions Immédiates

1. **Aller sur Railway Dashboard**
2. **Ajouter les 2 variables au service Backend**
3. **Attendre le redéploiement (~2-3 min)**
4. **Tester la recherche !**

Les produits seront automatiquement indexés au démarrage du backend. 🚀
