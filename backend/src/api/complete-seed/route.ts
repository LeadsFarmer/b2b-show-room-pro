import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { exec } from "child_process"
import { promisify } from "util"
import { Client } from "pg"

const execAsync = promisify(exec)

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

    // Check what exists
    const checks = {
      regions: await client.query('SELECT COUNT(*) FROM region'),
      products: await client.query('SELECT COUNT(*) FROM product'),
      categories: await client.query('SELECT COUNT(*) FROM product_category'),
      collections: await client.query('SELECT COUNT(*) FROM product_collection'),
    }

    const status = {
      regions: parseInt(checks.regions.rows[0].count),
      products: parseInt(checks.products.rows[0].count),
      categories: parseInt(checks.categories.rows[0].count),
      collections: parseInt(checks.collections.rows[0].count),
    }

    await client.end()

    // If we have products, database is fully seeded
    if (status.products > 0) {
      return res.json({
        status: "already_seeded",
        message: "✅ Database already has products",
        data: status
      })
    }

    // If we have regions but no products, we need to clear regions and reseed
    if (status.regions > 0) {
      return res.json({
        status: "partial_seed_detected",
        message: "⚠️ Database has regions but no products. Need to reset regions first.",
        instructions: "Use /reset-regions endpoint first, then retry this endpoint",
        data: status
      })
    }

    // Run full seed
    const { stdout, stderr } = await execAsync("yarn seed", {
      cwd: "/app",
      env: process.env,
      timeout: 120000 // 2 minutes timeout
    })

    return res.json({
      status: "success",
      message: "✅ Database seeded successfully!",
      output: stdout.substring(0, 500),
      data: status
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Seed failed",
      error: error.message,
      stderr: error.stderr?.substring(0, 500)
    })
  }
}
