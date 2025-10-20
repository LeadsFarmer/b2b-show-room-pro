import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Client } from "pg"

export const GET = async (
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

    // Get comprehensive database status
    const queries = {
      regions: await client.query('SELECT id, name, currency_code FROM region LIMIT 5'),
      products: await client.query('SELECT id, title, status FROM product LIMIT 5'),
      categories: await client.query('SELECT id, name FROM product_category LIMIT 5'),
      collections: await client.query('SELECT id, title, handle FROM product_collection LIMIT 5'),
      sales_channels: await client.query('SELECT id, name FROM sales_channel LIMIT 5'),
      publishable_keys: await client.query('SELECT id, title, created_at FROM publishable_api_key'),
      key_channels: await client.query(`
        SELECT pak.id as key_id, pak.title, sc.id as channel_id, sc.name as channel_name
        FROM publishable_api_key pak
        LEFT JOIN publishable_api_key_sales_channel paksc ON pak.id = paksc.publishable_key_id
        LEFT JOIN sales_channel sc ON paksc.sales_channel_id = sc.id
      `),
    }

    await client.end()

    return res.json({
      status: "success",
      database: {
        regions: {
          count: queries.regions.rows.length,
          data: queries.regions.rows
        },
        products: {
          count: queries.products.rows.length,
          data: queries.products.rows
        },
        categories: {
          count: queries.categories.rows.length,
          data: queries.categories.rows
        },
        collections: {
          count: queries.collections.rows.length,
          data: queries.collections.rows
        },
        sales_channels: {
          count: queries.sales_channels.rows.length,
          data: queries.sales_channels.rows
        },
        publishable_keys: {
          count: queries.publishable_keys.rows.length,
          data: queries.publishable_keys.rows
        },
        key_channels_links: {
          count: queries.key_channels.rows.length,
          data: queries.key_channels.rows
        },
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to get database status",
      error: error.message
    })
  }
}
