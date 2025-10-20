import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { readdir } from "fs/promises"
import { join } from "path"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const token = req.query.token as string
    if (token !== process.env.INIT_SECRET) {
      return res.status(403).json({ message: "❌ Invalid token" })
    }

    const cwd = process.cwd()
    
    // List directories
    const rootFiles = await readdir(cwd).catch(() => [])
    const medusaFiles = await readdir(join(cwd, ".medusa")).catch(() => [])
    const serverFiles = await readdir(join(cwd, ".medusa/server")).catch(() => [])
    const srcFiles = await readdir(join(cwd, "src")).catch(() => [])
    
    return res.json({
      cwd,
      structure: {
        root: rootFiles,
        ".medusa": medusaFiles,
        ".medusa/server": serverFiles,
        "src": srcFiles
      }
    })
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack?.substring(0, 300)
    })
  }
}
