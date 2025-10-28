import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

// ⚠️ ENDPOINT DE DEV UNIQUEMENT - SANS AUTHENTIFICATION
// À SUPPRIMER EN PRODUCTION !

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const productModuleService = req.scope.resolve(Modules.PRODUCT)
    const meilisearchService: any = req.scope.resolve("meilisearchService")

    console.log("🔍 Starting Meilisearch reindexation...")

    // Récupérer tous les produits
    const products = await productModuleService.listProducts(
      {},
      {
        relations: ["variants", "categories", "images"],
      }
    )

    console.log(`📦 Found ${products.length} products to index`)

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

    console.log(`✅ Successfully reindexed ${searchableProducts.length} products in Meilisearch`)

    res.json({
      success: true,
      message: `Successfully reindexed ${searchableProducts.length} products`,
      count: searchableProducts.length,
      products: searchableProducts.map(p => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
      })),
    })
  } catch (error: any) {
    console.error("❌ Meilisearch reindex error:", error)
    res.status(500).json({
      success: false,
      message: "Error reindexing products",
      error: error.message,
      stack: error.stack,
    })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  return GET(req, res)
}
