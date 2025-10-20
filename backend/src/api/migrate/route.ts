import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { promisify } from "util"
import { exec } from "child_process"

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

    // Run migrations
    const { stdout, stderr } = await execAsync("yarn medusa db:migrate", {
      cwd: "/app",
      env: process.env,
      timeout: 60000 // 1 minute timeout
    })

    return res.json({
      status: "success",
      message: "✅ Migrations executed successfully!",
      output: stdout.substring(0, 500),
      next_step: "Now you can run /seed-safe to populate the database"
    })
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: "Migration failed",
      error: error.message,
      stderr: error.stderr?.substring(0, 500)
    })
  }
}
