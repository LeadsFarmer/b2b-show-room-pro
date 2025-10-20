import { sdk } from "@/lib/config"
import { getAuthHeaders } from "@/lib/data/cookies"
import { getProductByHandle } from "@/lib/data/products"
import { getRegion, listRegions } from "@/lib/data/regions"
import ProductTemplate from "@/modules/products/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'
export const dynamicParams = true

type Props = {
  params: { countryCode: string; handle: string }
}

export async function generateStaticParams() {
  // Return empty array to force all rendering to be dynamic
  return []
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await getProductByHandle(handle, region.id)

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Show Room Pro`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Show Room Pro`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await getProductByHandle(params.handle, region.id)
  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
    />
  )
}
