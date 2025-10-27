import CategoryBreadcrumb from "@/modules/categories/category-breadcrumb"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@/modules/store/components/refinement-list"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@/modules/store/templates/paginated-products"
import { ArrowUturnLeft } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Text } from "@medusajs/ui"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export default function CategoryTemplate({
  categories,
  currentCategory,
  sortBy,
  page,
  countryCode,
}: {
  categories: HttpTypes.StoreProductCategory[]
  currentCategory: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!currentCategory || !countryCode) notFound()

  // Récupération des métadonnées B2B
  const b2bMetadata = currentCategory.metadata?.b2b as any
  const icon = currentCategory.metadata?.icon as string
  const hasB2BData = b2bMetadata && Object.keys(b2bMetadata).length > 0

  return (
    <div className="bg-neutral-100">
      <div
        className="flex flex-col py-6 content-container gap-4"
        data-testid="category-container"
      >
        <CategoryBreadcrumb
          categories={categories}
          category={currentCategory}
        />

        {/* En-tête avec icône et métadonnées B2B */}
        {hasB2BData && (
          <Container className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <div className="flex items-start gap-4 p-6">
              {icon && (
                <span className="text-5xl flex-shrink-0" aria-hidden="true">
                  {icon}
                </span>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-neutral-950 mb-2">
                  {currentCategory.name}
                </h1>
                {currentCategory.description && (
                  <p className="text-neutral-600 mb-4">
                    {currentCategory.description}
                  </p>
                )}

                {/* Informations générales de la catégorie */}
                <div className="grid grid-cols-1 small:grid-cols-2 gap-4 mt-4">
                  {b2bMetadata.customization && b2bMetadata.customization.length > 0 && (
                    <div className="bg-white/50 backdrop-blur rounded-lg p-3 border border-blue-100">
                      <h3 className="text-sm font-semibold text-neutral-950 mb-2 flex items-center gap-2">
                        🎨 Personnalisation Disponible
                      </h3>
                      <ul className="text-xs text-neutral-700 space-y-1">
                        {b2bMetadata.customization.map((option: string) => (
                          <li key={option} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {b2bMetadata.target_markets && b2bMetadata.target_markets.length > 0 && (
                    <div className="bg-white/50 backdrop-blur rounded-lg p-3 border border-blue-100">
                      <h3 className="text-sm font-semibold text-neutral-950 mb-2 flex items-center gap-2">
                        🎯 Marchés Cibles
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {b2bMetadata.target_markets.map((market: string) => (
                          <span
                            key={market}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {market}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Container>
        )}

        <div className="flex flex-col small:flex-row small:items-start gap-3">
          <RefinementList
            sortBy={sort}
            categories={categories}
            currentCategory={currentCategory}
            listName={currentCategory.name}
            data-testid="sort-by-container"
          />
          <div className="w-full">
            {currentCategory.products?.length === 0 ? (
              <Container className="flex flex-col gap-2 justify-center text-center items-center text-sm text-neutral-500">
                <Text className="font-medium">
                  Aucun produit trouvé pour cette catégorie.
                </Text>
                <LocalizedClientLink
                  href="/store"
                  className="flex gap-2 items-center"
                >
                  <Button variant="secondary">
                    Retour à tous les produits
                    <ArrowUturnLeft className="w-4 h-4" />
                  </Button>
                </LocalizedClientLink>
              </Container>
            ) : (
              <Suspense
                fallback={
                  <SkeletonProductGrid
                    count={currentCategory.products?.length}
                  />
                }
              >
                <PaginatedProducts
                  sortBy={sort}
                  page={pageNumber}
                  categoryId={currentCategory.id}
                  countryCode={countryCode}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
