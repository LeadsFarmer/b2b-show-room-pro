import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import seedDemoData from "../../scripts/seed"

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

    // Execute seed directly
    await seedDemoData({ container: req.scope })

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
