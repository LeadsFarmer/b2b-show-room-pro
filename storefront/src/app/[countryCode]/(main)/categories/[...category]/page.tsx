import { getCategoryByHandle, listCategories } from "@/lib/data/categories"
import { listRegions } from "@/lib/data/regions"
import CategoryTemplate from "@/modules/categories/templates"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import { Metadata } from "next"
import { notFound } from "next/navigation"

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'
export const dynamicParams = true

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  try {
    const product_category = await getCategoryByHandle(params.category)

    const title = product_category.name

    const description = product_category.description ?? `${title} category.`

    return {
      title: `${title} | Show Room Pro`,
      description,
      alternates: {
        canonical: `${params.category.join("/")}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export async function generateStaticParams() {
  // Return empty array to force all rendering to be dynamic
  return []
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const categories = await listCategories()

  const currentCategory = categories.find(
    (category) => category.handle === params.category.join("/")
  )

  if (!currentCategory) {
    notFound()
  }

  return (
    <CategoryTemplate
      categories={categories}
      currentCategory={currentCategory}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
