"use client"

import { Metadata } from "next"
import { InstantSearch, SearchBox, Hits, Highlight, Configure, RefinementList } from "react-instantsearch"
import { searchClient, indexName } from "@/lib/meilisearch-client"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

function Hit({ hit }: { hit: any }) {
  const params = useParams()
  const countryCode = params?.countryCode || "fr-fr"

  return (
    <Link
      href={`/${countryCode}/products/${hit.handle}`}
      className="group block bg-white rounded-lg border hover:border-blue-500 hover:shadow-lg transition-all p-4"
    >
      <div className="flex gap-4">
        {hit.thumbnail && (
          <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded">
            <Image
              src={hit.thumbnail}
              alt={hit.title}
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
            <Highlight attribute="title" hit={hit} />
          </h3>
          {hit.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              <Highlight attribute="description" hit={hit} />
            </p>
          )}
          {hit.categories && hit.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hit.categories.map((cat: any) => (
                <span
                  key={cat.id}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

function NoResults() {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <p className="text-gray-600 text-lg mb-2">Aucun résultat trouvé</p>
      <p className="text-sm text-gray-500">
        Essayez avec d&apos;autres mots-clés ou explorez nos catégories
      </p>
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="content-container py-8">
      <h1 className="text-3xl font-bold mb-8">Recherche de produits</h1>

      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-4 sticky top-4">
              <h2 className="font-semibold mb-4">Filtres</h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Catégories</h3>
                <RefinementList
                  attribute="categories.name"
                  classNames={{
                    list: "space-y-2",
                    item: "text-sm",
                    label: "flex items-center gap-2 cursor-pointer hover:text-blue-600",
                    checkbox: "rounded",
                    count: "ml-auto text-gray-500",
                  }}
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Configure hitsPerPage={12} />
            
            <SearchBox
              placeholder="Rechercher un produit, une catégorie..."
              classNames={{
                root: "mb-8",
                form: "relative",
                input:
                  "w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                submit: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
                reset: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
                loadingIndicator: "absolute right-3 top-1/2 -translate-y-1/2",
              }}
              autoFocus
            />

            <Hits
              hitComponent={Hit}
              classNames={{
                root: "",
                list: "grid grid-cols-1 gap-4",
                item: "list-none",
              }}
            />
            
            <NoResults />
          </main>
        </div>
      </InstantSearch>
    </div>
  )
}
