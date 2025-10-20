import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { exec } from "child_process"
import { promisify } from "util"

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

    // Run safe seed
    const { stdout, stderr } = await execAsync("yarn seed:safe", {
      cwd: "/app",
      env: process.env,
      timeout: 180000 // 3 minutes timeout
    })

    return res.json({
      status: "success",
      message: "✅ Safe seed completed successfully!",
      output: stdout.substring(stdout.length - 1000), // Last 1000 chars
      note: "Check backend logs for full output"
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Safe seed failed",
      error: error.message,
      stderr: error.stderr?.substring(0, 1000)
    })
  }
}
