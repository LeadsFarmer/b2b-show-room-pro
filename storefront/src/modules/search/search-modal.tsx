"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InstantSearch, SearchBox, Hits, Highlight, Configure } from "react-instantsearch"
import { searchClient, indexName } from "@/lib/meilisearch-client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  countryCode: string
}

function Hit({ hit, countryCode }: { hit: any; countryCode: string }) {
  return (
    <Link
      href={`/${countryCode}/products/${hit.handle}`}
      className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
    >
      {hit.thumbnail && (
        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
          <Image
            src={hit.thumbnail}
            alt={hit.title}
            fill
            className="object-cover rounded"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm mb-1">
          <Highlight attribute="title" hit={hit} />
        </h3>
        {hit.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            <Highlight attribute="description" hit={hit} />
          </p>
        )}
        {hit.categories && hit.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {hit.categories.slice(0, 2).map((cat: any) => (
              <span
                key={cat.id}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

function NoResults() {
  return (
    <div className="text-center py-8">
      <p className="text-gray-600 mb-2">Aucun résultat trouvé</p>
      <p className="text-sm text-gray-500">
        Essayez avec d&apos;autres mots-clés
      </p>
    </div>
  )
}

export function SearchModal({ open, onOpenChange, countryCode }: SearchModalProps) {
  const [searchState, setSearchState] = useState<any>({})

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Rechercher des produits</DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          <InstantSearch
            searchClient={searchClient}
            indexName={indexName}
            onStateChange={({ uiState, setUiState }) => {
              setSearchState(uiState)
              setUiState(uiState)
            }}
          >
            <Configure hitsPerPage={8} />
            
            <SearchBox
              placeholder="Rechercher un produit..."
              classNames={{
                root: "mb-6",
                form: "relative",
                input:
                  "w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                submit: "absolute left-3 top-1/2 -translate-y-1/2",
                reset: "absolute right-3 top-1/2 -translate-y-1/2",
                loadingIndicator: "absolute right-3 top-1/2 -translate-y-1/2",
              }}
            />

            <div className="overflow-y-auto max-h-[50vh]">
              <Hits
                hitComponent={({ hit }) => (
                  <Hit hit={hit} countryCode={countryCode} />
                )}
                classNames={{
                  root: "space-y-2",
                  list: "space-y-2",
                  item: "list-none",
                }}
              />
              
              {searchState[indexName]?.query && (
                <NoResults />
              )}
            </div>
          </InstantSearch>
        </div>
      </DialogContent>
    </Dialog>
  )
}
