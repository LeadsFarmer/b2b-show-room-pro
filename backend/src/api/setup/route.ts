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
      return res.status(403).json({ message: "❌ Invalid token. Check INIT_SECRET on Railway." })
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    
    // Get publishable key
    const { data: keys } = await query.graph({
      entity: "publishable_api_key",
      fields: ["id", "created_at"],
    })

    if (keys && keys.length > 0) {
      return res.json({
        status: "success",
        message: "✅ Database already initialized",
        publishable_key: keys[0].id,
        created_at: keys[0].created_at,
        instructions: {
          storefront: "Add this to your Storefront environment variables:",
          variable: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=" + keys[0].id
        }
      })
    }

    return res.json({
      status: "not_initialized",
      message: "❌ No publishable key found",
      instructions: "Database needs to be seeded. Contact support or run migrations manually.",
      hint: "The seed script should create a default publishable key"
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error checking database",
      error: error.message,
    })
  }
}

// Health check without token
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  return res.json({
    status: "ok",
    message: "Setup endpoint is working",
    note: "Use GET with ?token=YOUR_TOKEN to retrieve publishable key"
  })
}
