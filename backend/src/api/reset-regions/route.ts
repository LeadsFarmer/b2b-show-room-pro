import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Client } from "pg"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // Check secret token
    const token = req.query.token as string
    if (token !== process.env.INIT_SECRET) {
      return res.status(403).json({ message: "❌ Invalid token" })
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    })
    
    await client.connect()

    // Delete regions (cascade will handle related data)
    const result = await client.query('DELETE FROM region')
    
    await client.end()

    return res.json({
      status: "success",
      message: "✅ Regions deleted successfully!",
      deleted_count: result.rowCount,
      next_step: "Now call /complete-seed to run full seed"
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to delete regions",
      error: error.message
    })
  }
}
