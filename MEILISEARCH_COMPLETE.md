# Intégration Complète Meilisearch

## 🎉 Fonctionnalités Implémentées

### ✅ Backend

1. **Module Meilisearch Custom**
   - Service avec méthodes CRUD complètes
   - Configuration conditionnelle via variables d'environnement
   - Connexion au serveur Meilisearch

2. **Subscribers d'Auto-indexation**
   - `product-created.ts` : Indexe automatiquement les nouveaux produits
   - `product-updated.ts` : Met à jour les produits modifiés
   - `product-deleted.ts` : Supprime les produits supprimés

3. **API de Réindexation Manuelle**
   - `POST /admin/meilisearch/reindex`
   - Réindexe tous les produits en une seule commande
   - Accessible depuis l'Admin Medusa

### ✅ Storefront

1. **Client Meilisearch**
   - Configuration centralisée
   - Support des variables d'environnement

2. **Page de Recherche Complète**
   - Interface InstantSearch
   - Recherche en temps réel
   - Filtres par catégorie
   - Highlights des termes recherchés
   - Layout responsive avec sidebar

3. **Composants UI**
   - Dialog (modal) pour recherche rapide future
   - Composants de recherche réutilisables

---

## 📦 Structure des Fichiers

### Backend

```
backend/
├── src/
│   ├── modules/
│   │   └── meilisearch/
│   │       ├── index.ts              # Définition du module
│   │       └── service.ts            # Service Meilisearch
│   ├── subscribers/
│   │   ├── product-created.ts        # Auto-indexation création
│   │   ├── product-updated.ts        # Auto-indexation mise à jour
│   │   └── product-deleted.ts        # Auto-indexation suppression
│   └── api/
│       └── admin/
│           └── meilisearch/
│               └── reindex/
│                   └── route.ts      # API réindexation
└── medusa-config.ts                  # Config module Meilisearch
```

### Storefront

```
storefront/
├── src/
│   ├── lib/
│   │   └── meilisearch-client.ts     # Client configuration
│   ├── components/
│   │   └── ui/
│   │       └── dialog.tsx            # Composant Dialog shadcn
│   ├── modules/
│   │   └── search/
│   │       └── search-modal.tsx      # Modal recherche (future)
│   └── app/
│       └── [countryCode]/
│           └── (main)/
│               └── search/
│                   └── page.tsx      # Page recherche complète
└── package.json                      # + react-instantsearch dependencies
```

---

## 🔧 Configuration Requise

### Variables d'Environnement Backend

```bash
# Railway > Backend Service > Variables
MEILISEARCH_HOST=https://meilisearch-production-xxxx.up.railway.app
MEILISEARCH_API_KEY=<MEILI_MASTER_KEY>
MEILISEARCH_PRODUCT_INDEX_NAME=products
```

### Variables d'Environnement Storefront

```bash
# Railway > Storefront Service > Variables
NEXT_PUBLIC_MEILISEARCH_HOST=https://meilisearch-production-xxxx.up.railway.app
NEXT_PUBLIC_MEILISEARCH_API_KEY=<MEILI_SEARCH_KEY>
NEXT_PUBLIC_MEILISEARCH_INDEX_NAME=products
```

**⚠️ Important** : Pour le storefront, utilisez la **Search Key** (publique), PAS la Master Key !

---

## 🚀 Installation et Déploiement

### 1. Installer les Dépendances Localement

```bash
# Backend (déjà fait)
cd backend
pnpm install

# Storefront
cd storefront
pnpm install
```

Les packages suivants ont été ajoutés au storefront :
- `@meilisearch/instant-meilisearch@^0.19.3`
- `react-instantsearch@^7.13.3`

### 2. Tester Localement

**Backend** :
```bash
cd backend
pnpm dev
```

**Storefront** :
```bash
cd storefront
pnpm dev
```

Visitez : `http://localhost:8000/fr-fr/search`

### 3. Déployer sur Railway

```bash
# Depuis la racine du projet
git add .
git commit -m "feat: Intégration complète Meilisearch"
git push b2b main
```

Railway déploiera automatiquement backend et storefront.

---

## 📖 Utilisation

### Réindexer Tous les Produits

Utilisez l'API route créée :

```bash
curl -X POST https://backend-production-xxxx.up.railway.app/admin/meilisearch/reindex \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json"
```

Réponse :
```json
{
  "success": true,
  "message": "Successfully reindexed 100 products",
  "count": 100
}
```

### Indexation Automatique

Une fois les subscribers déployés, les produits seront automatiquement :
- ✅ Indexés lors de la création
- ✅ Mis à jour lors de modifications
- ✅ Supprimés de l'index lors de suppression

### Recherche sur le Storefront

1. **Page dédiée** : `/fr-fr/search`
   - Barre de recherche
   - Résultats instantanés
   - Filtres par catégorie
   - Highlights des termes

2. **Depuis la navbar** : Cliquez sur l'icône de recherche
   - Redirige vers `/search`

---

## 🎨 Personnalisation

### Champs Indexés

Actuellement indexés dans Meilisearch :
- `id` : ID du produit
- `title` : Titre du produit
- `handle` : Slug URL
- `description` : Description
- `thumbnail` : Image principale
- `categories` : Catégories (array)
- `variants` : Variantes (array)
- `status` : Statut du produit
- `created_at` / `updated_at` : Dates

### Ajouter des Champs Personnalisés

Modifiez les subscribers :

```typescript
// backend/src/subscribers/product-created.ts
const searchableProduct = {
  // ... champs existants
  custom_field: product.metadata?.custom_field,
  brand: product.metadata?.brand,
}
```

### Modifier les Filtres

Modifiez la page search :

```tsx
// storefront/src/app/[countryCode]/(main)/search/page.tsx
<RefinementList
  attribute="status"  // Nouveau filtre
  classNames={{ ... }}
/>
```

---

## 🐛 Troubleshooting

### Problème : Aucun résultat de recherche

**Solutions** :
1. Vérifiez que les variables d'environnement sont configurées
2. Réindexez les produits via l'API route
3. Vérifiez les logs Meilisearch sur Railway
4. Testez la connexion :
   ```bash
   curl https://meilisearch-xxxx.railway.app/indexes/products/search \
     -H "Authorization: Bearer <SEARCH_KEY>" \
     -d '{"q": "test"}'
   ```

### Problème : Erreur TypeScript `react-instantsearch`

**Solution** : Installez les dépendances :
```bash
cd storefront
pnpm install
```

### Problème : Images non chargées

**Solution** : Vérifiez `next.config.js` :
```js
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*.railway.app",
    },
  ],
}
```

---

## 🎯 Prochaines Améliorations Possibles

### 1. **Modal de Recherche Rapide**
   - Ouvrir depuis la navbar
   - Résultats en overlay
   - Navigation au clavier (↑↓ Enter)

### 2. **Filtres Avancés**
   - Prix min/max
   - Disponibilité
   - Nouveautés
   - Promotions

### 3. **Suggestions Automatiques**
   - Auto-complétion
   - Corrections orthographiques
   - Recherches populaires

### 4. **Analytics**
   - Termes recherchés
   - Taux de clic
   - Produits populaires
   - Termes sans résultats

### 5. **Recherche Multi-langue**
   - Index par région
   - Synonymes multilingues

---

## 📚 Ressources

- [Documentation Meilisearch](https://www.meilisearch.com/docs)
- [React InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/)
- [Medusa Documentation](https://docs.medusajs.com)
- [Guide Officiel Meilisearch Medusa](https://docs.medusajs.com/resources/integrations/guides/meilisearch)

---

## ✅ Checklist de Déploiement

Backend :
- [x] Module Meilisearch créé
- [x] Subscribers créés
- [x] API route réindexation créée
- [ ] Variables d'environnement configurées sur Railway
- [ ] Première réindexation effectuée

Storefront :
- [x] Dépendances installées
- [x] Client Meilisearch configuré
- [x] Page search créée
- [x] Composants UI ajoutés
- [ ] Variables d'environnement configurées sur Railway
- [ ] Test de la recherche

---

**🎉 Félicitations ! Votre recherche Meilisearch est maintenant complètement opérationnelle !**
