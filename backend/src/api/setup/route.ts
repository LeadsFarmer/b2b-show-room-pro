import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaModule } from "@medusajs/framework/modules-sdk"

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

    // Access database directly
    const manager = req.scope.resolve("manager") as any
    
    // Check if tables exist
    const tablesQuery = await manager.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      LIMIT 5
    `)

    if (!tablesQuery || tablesQuery.length === 0) {
      return res.json({
        status: "not_initialized",
        message: "❌ Database is empty - no tables found",
        action_required: "Run migrations first",
        command: "railway run bash scripts/init-db.sh"
      })
    }

    // Try to get publishable key
    try {
      const keyQuery = await manager.query(`
        SELECT id, created_at 
        FROM publishable_api_key 
        LIMIT 1
      `)

      if (keyQuery && keyQuery.length > 0) {
        return res.json({
          status: "success",
          message: "✅ Database initialized!",
          publishable_key: keyQuery[0].id,
          created_at: keyQuery[0].created_at,
          instructions: {
            storefront: "Add this to your Storefront environment variables:",
            variable: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=" + keyQuery[0].id
          }
        })
      }
    } catch (e) {
      // Table doesn't exist yet
    }

    return res.json({
      status: "partially_initialized",
      message: "⚠️ Tables exist but no publishable key found",
      tables_found: tablesQuery.length,
      action_required: "Run seed to create publishable key",
      command: "railway run bash scripts/init-db.sh"
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error checking database",
      error: error.message,
      stack: error.stack
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
