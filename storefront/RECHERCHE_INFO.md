# 🔍 Moteur de Recherche - ShowRoomPro B2B

## ❓ Pourquoi la Recherche est Désactivée

Le champ de recherche affiche actuellement :
```
"Installer un fournisseur de recherche pour activer la recherche de produits"
```

**Raison** : Medusa nécessite un **provider de recherche externe** pour fonctionner.

---

## 🛠️ Solutions Disponibles

### 1. **Meilisearch** (Recommandé pour B2B)
```
✅ Open-source
✅ Gratuit
✅ Rapide et puissant
✅ Facile à héberger
✅ Support typo-tolérant
```

**Installation** :
```bash
# Backend
cd backend
npm install medusa-plugin-meilisearch

# Ajouter dans medusa-config.js
plugins: [
  {
    resolve: "medusa-plugin-meilisearch",
    options: {
      config: {
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY,
      },
      settings: {
        products: {
          indexSettings: {
            searchableAttributes: ["title", "description", "variant_sku"],
            displayedAttributes: ["title", "description", "thumbnail", "handle"],
          },
        },
      },
    },
  },
]
```

### 2. **Algolia** (Solution Cloud)
```
✅ Très performant
✅ UI/UX excellent
✅ Dashboard complet
❌ Payant au-delà de 10k recherches/mois
```

### 3. **Recherche Simple Locale** (Temporaire)
Pour tester rapidement sans provider externe, on peut créer une recherche simple côté client.

---

## 🚀 Activation Temporaire (Recherche Locale)

En attendant l'installation d'un provider de recherche professionnel, voici une solution temporaire :

**Étape 1** : Activer le champ
```typescript
// Dans showroompro-nav.tsx
<input
  type="text"
  placeholder="Rechercher..."
  className="bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2 rounded-full text-sm w-48"
  onChange={(e) => {
    // Redirection vers page de recherche
    if (e.target.value.length > 2) {
      window.location.href = `/search?q=${e.target.value}`
    }
  }}
/>
```

**Étape 2** : Créer une page de recherche simple qui filtre les produits côté client.

---

## 📊 Recommandation

Pour un projet B2B professionnel comme ShowRoomPro :

**👉 Installer Meilisearch**
- Gratuit et open-source
- Performance excellente
- Peut être hébergé sur Railway
- Indexation automatique des produits
- Support de la recherche par SKU (important en B2B)

**Coût estimé** : 0€ (auto-hébergé) ou ~$5-10/mois (hébergement dédié)

---

## 🔄 Prochaines Étapes

1. **Temporaire** : Laisser désactivé (pas critique pour le MVP)
2. **Court terme** : Installer Meilisearch sur Railway
3. **Optimisation** : Configurer les filtres B2B (MOQ, catégories, etc.)

---

## ℹ️ Note

Le champ de recherche est visible mais désactivé pour montrer qu'il existe.
Une fois le provider configuré, il s'activera automatiquement.
