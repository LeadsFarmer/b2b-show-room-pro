import { MagnifyingGlassMini } from "@medusajs/icons"

const SearchInResults = ({ listName }: { listName?: string }) => {
  const placeholder = listName ? `Rechercher dans ${listName}` : "Rechercher dans les produits"

  return (
    <div className="group relative text-sm focus-within:border-neutral-500 rounded-t-lg focus-within:outline focus-within:outline-neutral-500">
      <input
        placeholder={placeholder}
        disabled
        className="w-full p-2 pr-8 focus:outline-none rounded-lg hover:cursor-not-allowed"
        title="Installez un fournisseur de recherche pour activer la recherche de produits"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <MagnifyingGlassMini className="w-4 h-4 text-neutral-500" />
      </div>
    </div>
  )
}

export default SearchInResults
