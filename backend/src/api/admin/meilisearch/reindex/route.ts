import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const productModuleService = req.scope.resolve(Modules.PRODUCT)
    const meilisearchService: any = req.scope.resolve("meilisearchService")

    // Récupérer tous les produits
    const products = await productModuleService.listProducts(
      {},
      {
        relations: ["variants", "categories", "images"],
      }
    )

    if (!products || products.length === 0) {
      res.json({
        success: true,
        message: "No products to index",
        count: 0,
      })
      return
    }

    // Transformer les produits pour Meilisearch
    const searchableProducts = products.map((product: any) => ({
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
    }))

    // Réindexer tous les produits
    await meilisearchService.reindexProducts(searchableProducts)

    res.json({
      success: true,
      message: `Successfully reindexed ${searchableProducts.length} products`,
      count: searchableProducts.length,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error reindexing products",
      error: error.message,
    })
  }
}
