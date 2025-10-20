import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Client } from "pg"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    // Check secret token
    const token = req.query.token
    if (token !== process.env.INIT_SECRET) {
      return res.status(403).json({ message: "❌ Invalid token. Check INIT_SECRET on Railway." })
    }

    await client.connect()
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      LIMIT 5
    `)

    if (!tablesResult.rows || tablesResult.rows.length === 0) {
      await client.end()
      return res.json({
        status: "not_initialized",
        message: "❌ Database is empty - no tables found",
        action_required: "Run migrations first",
        hint: "Open terminal and run: railway connect postgres, then run migrations manually"
      })
    }

    // Try to get publishable key
    try {
      const keyResult = await client.query(`
        SELECT id, created_at 
        FROM publishable_api_key 
        LIMIT 1
      `)

      if (keyResult.rows && keyResult.rows.length > 0) {
        await client.end()
        return res.json({
          status: "success",
          message: "✅ Database initialized!",
          publishable_key: keyResult.rows[0].id,
          created_at: keyResult.rows[0].created_at,
          instructions: {
            storefront: "Add this to your Storefront environment variables:",
            variable: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=" + keyResult.rows[0].id
          }
        })
      }
    } catch (e) {
      // Table doesn't exist yet
    }

    await client.end()
    return res.json({
      status: "partially_initialized",
      message: "⚠️ Tables exist but no publishable key found",
      tables_found: tablesResult.rows.length,
      action_required: "Run seed to create publishable key",
      hint: "The database has tables but needs seeding"
    })
  } catch (error) {
    try {
      await client.end()
    } catch (e) {
      // ignore
    }
    return res.status(500).json({
      status: "error",
      message: "Error checking database",
      error: error.message
    })
  }
}

// Seed database when called with token
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const token = req.query.token as string
    
    if (token !== process.env.INIT_SECRET) {
      return res.json({
        status: "ok",
        message: "Setup endpoint is working",
        note: "Use GET with ?token=YOUR_TOKEN to retrieve publishable key"
      })
    }

    // Execute seed using medusa exec command
    const { stdout, stderr } = await execAsync("medusa exec ./src/scripts/seed.ts", {
      cwd: process.cwd(),
      env: process.env,
      timeout: 120000 // 2 minutes timeout
    })

    return res.json({
      status: "success",
      message: "✅ Database seeded successfully!",
      output: stdout.substring(0, 500),
      stderr: stderr ? stderr.substring(0, 300) : undefined,
      next_step: "You can now access the storefront with demo data"
    })
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: "Seed failed",
      error: error.message,
      stderr: error.stderr?.substring(0, 500),
      stdout: error.stdout?.substring(0, 500),
      stack: error.stack?.substring(0, 300)
    })
  }
}
