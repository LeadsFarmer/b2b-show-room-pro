import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function productCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const productModuleService = container.resolve(Modules.PRODUCT)
  const meilisearchService = container.resolve("meilisearchService")

  // Récupérer le produit complet avec ses variantes et catégories
  const product = await productModuleService.retrieveProduct(data.id, {
    relations: ["variants", "categories", "images"],
  })

  if (!product) {
    return
  }

  // Transformer le produit pour Meilisearch
  const searchableProduct = {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description || "",
    thumbnail: product.thumbnail || "",
    categories: product.categories?.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      handle: cat.handle,
    })) || [],
    variants: product.variants?.map((variant: any) => ({
      id: variant.id,
      title: variant.title,
      sku: variant.sku,
      prices: variant.prices || [],
    })) || [],
    status: product.status,
    created_at: product.created_at,
    updated_at: product.updated_at,
  }

  // Ajouter à Meilisearch
  await meilisearchService.addProducts([searchableProduct])

  console.log(`✅ Product ${product.title} indexed in Meilisearch`)
}

export const config: SubscriberConfig = {
  event: "product.created",
}
