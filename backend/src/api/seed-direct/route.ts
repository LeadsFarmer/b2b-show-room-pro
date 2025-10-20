import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

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

    // Execute seed with lazy loading
    // Use absolute path from working directory
    const seedPath = `file://${process.cwd()}/.medusa/server/scripts/seed.js`
    const seedModule = await import(seedPath) as any
    await seedModule.default({ container: req.scope, args: [] })

    return res.json({
      status: "success",
      message: "✅ Database seeded successfully!",
      next_step: "You can now access the storefront with demo data"
    })
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: "Seed failed",
      error: error.message,
      stack: error.stack?.substring(0, 500)
    })
  }
}
