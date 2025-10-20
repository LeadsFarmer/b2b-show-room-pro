import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // Check secret token
    const token = req.query.token
    if (token !== process.env.INIT_SECRET) {
      return res.status(403).json({ message: "Invalid token" })
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    
    // Check if already initialized
    const { data: keys } = await query.graph({
      entity: "publishable_api_key",
      fields: ["id"],
    })

    if (keys && keys.length > 0) {
      return res.json({
        message: "✅ Database already initialized",
        publishable_key: keys[0].id,
        note: "Use this key for your storefront: NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY"
      })
    }

    return res.json({
      message: "❌ Database not initialized yet",
      instructions: "Run: railway run bash scripts/init-db.sh OR initialize via seed manually",
      note: "Publishable key will be generated after seeding"
    })
  } catch (error) {
    return res.status(500).json({
      message: "Error checking database",
      error: error.message,
    })
  }
}
