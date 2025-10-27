# 🔍 Intégration Meilisearch - Méthode Officielle Medusa

## ✅ Configuration Complétée

L'intégration Meilisearch suit maintenant la méthode officielle recommandée par Medusa :
- Module custom créé dans `backend/src/modules/meilisearch/`
- Service Meilisearch avec fonctions CRUD
- Configuration correcte dans `medusa-config.ts`

---

## 📁 Structure Créée

```
backend/
├── src/modules/meilisearch/
│   ├── index.ts      # Définition du module
│   └── service.ts    # Service Meilisearch
└── medusa-config.ts  # Configuration module
```

---

## 🔧 Fonctionnalités du Module

### Service Meilisearch (`service.ts`)

```typescript
- addProducts(products)       // Ajouter des produits
- updateProducts(products)    // Mettre à jour des produits
- deleteProducts(productIds)  // Supprimer des produits
- search(query, options)      // Rechercher
- reindexProducts(products)   // Réindexer tous les produits
```

---

## ⚙️ Variables d'Environnement Nécessaires

### 🔹 Backend Railway (Service "backend")

```bash
MEILISEARCH_HOST=https://xxxxx.railway.app
MEILISEARCH_API_KEY=<MEILI_MASTER_KEY>
MEILISEARCH_PRODUCT_INDEX_NAME=products
```

#### Comment les trouver :

**1. MEILISEARCH_HOST**
```
Railway > Service Meilisearch > Settings > Public Networking
Format: https://xxxxx.railway.app
```

**2. MEILISEARCH_API_KEY**
```
Railway > Service Meilisearch > Variables
Chercher: MEILI_MASTER_KEY
Copier la valeur
```

**3. MEILISEARCH_PRODUCT_INDEX_NAME**
```
Nom de l'index (par défaut: "products")
```

---

### 🔹 Storefront Railway (Service "storefront")

```bash
NEXT_PUBLIC_MEILISEARCH_HOST=https://xxxxx.railway.app
NEXT_PUBLIC_MEILISEARCH_API_KEY=<MEILI_SEARCH_KEY>
NEXT_PUBLIC_MEILISEARCH_INDEX_NAME=products
```

**Note :** Pour le storefront, utilisez une clé API avec **permissions de recherche uniquement** (pas la Master Key).

---

## 🚀 Installation & Déploiement

### 1. Les Packages Sont Déjà Ajoutés

**Backend** (`backend/package.json`) :
```json
"meilisearch": "^0.44.1"
```

**Storefront** (`storefront/package.json`) :
```json
"@meilisearch/instant-meilisearch": "à ajouter",
"react-instantsearch": "à ajouter"
```

### 2. Ajouter les Variables sur Railway

1. Aller sur Railway Dashboard
2. Projet **srpB2B**
3. Service **Backend** > Variables > Ajouter les 3 variables ci-dessus
4. Service **Storefront** > Variables > Ajouter les 3 variables ci-dessus
5. Les services redémarreront automatiquement

### 3. Vérifier le Déploiement

```bash
# Backend logs
railway logs -s backend -f

# Chercher
✅ "Meilisearch module loaded successfully"
✅ "Connected to Meilisearch at https://..."
```

---

## 🔄 Prochaines Étapes

### Étape 1 : Subscribers (Auto-indexation)

Créer des subscribers pour indexer automatiquement lors :
- Création de produit
- Mise à jour de produit
- Suppression de produit

**Fichiers à créer :**
```
backend/src/subscribers/product-created.ts
backend/src/subscribers/product-updated.ts
backend/src/subscribers/product-deleted.ts
```

### Étape 2 : API Route Manuelle

Créer un endpoint pour réindexation manuelle depuis Admin :
```
backend/src/api/admin/meilisearch/reindex/route.ts
```

### Étape 3 : UI Admin

Ajouter un bouton dans Admin pour déclencher la réindexation.

### Étape 4 : Storefront Search

Intégrer la recherche dans le storefront avec `react-instantsearch`.

---

## 📚 Documentation Officielle

Guide complet : https://docs.medusajs.com/resources/integrations/guides/meilisearch

---

## ⚡ Action Immédiate

**Pour activer Meilisearch maintenant :**

1. **Aller sur Railway Dashboard**
2. **Ajouter les variables backend** (3 variables)
3. **Attendre redémarrage** (~2-3 min)
4. **Tester** : Le module sera chargé

Une fois actif, vous pourrez ajouter les subscribers et le storefront search !
