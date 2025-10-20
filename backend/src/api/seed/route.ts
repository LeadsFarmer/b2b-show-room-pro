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
    const token = req.query.token || req.body?.token
    if (token !== process.env.INIT_SECRET) {
      return res.status(403).json({ message: "❌ Invalid token" })
    }

    // Run seed
    res.write('{"status":"running","message":"🌱 Starting seed process..."}')
    
    const { stdout, stderr } = await execAsync("yarn seed", {
      cwd: "/app",
      env: process.env
    })

    // Check if key was created
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    })
    
    await client.connect()
    const keyResult = await client.query(`SELECT id FROM publishable_api_key LIMIT 1`)
    await client.end()

    if (keyResult.rows && keyResult.rows.length > 0) {
      return res.json({
        status: "success",
        message: "✅ Database seeded successfully!",
        publishable_key: keyResult.rows[0].id,
        output: stdout,
        instructions: {
          storefront: "Use this key for your Storefront:",
          variable: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=" + keyResult.rows[0].id
        }
      })
    }

    return res.json({
      status: "completed",
      message: "Seed ran but no key found",
      output: stdout,
      error: stderr
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Seed failed",
      error: error.message,
      stderr: error.stderr
    })
  }
}
