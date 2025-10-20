import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // Check if already initialized
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    
    const { data: keys } = await query.graph({
      entity: "publishable_api_key",
      fields: ["id"],
    })

    if (keys && keys.length > 0) {
      return res.json({
        message: "Database already initialized",
        publishable_key: keys[0].id,
      })
    }

    // Run migrations
    await execAsync("yarn medusa db:migrate")
    
    // Seed database
    await execAsync("yarn seed")

    // Get publishable key
    const { data: newKeys } = await query.graph({
      entity: "publishable_api_key",
      fields: ["id"],
    })

    return res.json({
      message: "Database initialized successfully!",
      publishable_key: newKeys[0]?.id || "No key found",
    })
  } catch (error) {
    return res.status(500).json({
      message: "Initialization failed",
      error: error.message,
    })
  }
}
