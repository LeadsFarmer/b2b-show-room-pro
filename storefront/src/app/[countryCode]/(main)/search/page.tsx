import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recherche",
  description: "Rechercher des produits",
}

export default function SearchPage() {
  return (
    <div className="content-container py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Recherche de produits</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2 text-blue-900">
            🚧 Fonctionnalité en développement
          </h2>
          <p className="text-blue-800 mb-4">
            La recherche avec Meilisearch est en cours d'intégration. Cette page sera bientôt opérationnelle avec :
          </p>
          <ul className="list-disc list-inside text-blue-800 space-y-2">
            <li>Recherche instantanée dans le catalogue</li>
            <li>Filtres par catégorie, prix, disponibilité</li>
            <li>Suggestions automatiques</li>
            <li>Résultats pertinents et rapides</li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold mb-3">En attendant, vous pouvez :</h3>
          <div className="space-y-2">
            <a 
              href="/fr-fr/store" 
              className="block text-blue-600 hover:text-blue-800 hover:underline"
            >
              → Parcourir tous les produits
            </a>
            <a 
              href="/fr-fr/categories" 
              className="block text-blue-600 hover:text-blue-800 hover:underline"
            >
              → Explorer les catégories
            </a>
            <a 
              href="/fr-fr/collections" 
              className="block text-blue-600 hover:text-blue-800 hover:underline"
            >
              → Découvrir les collections
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
