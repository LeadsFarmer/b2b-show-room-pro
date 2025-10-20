import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createApiKeysWorkflow, linkSalesChannelsToApiKeyWorkflow } from "@medusajs/core-flows"
import { ISalesChannelModuleService } from "@medusajs/framework/types"
import { ModuleRegistrationName } from "@medusajs/framework/utils"

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

    const salesChannelModuleService: ISalesChannelModuleService =
      req.scope.resolve(ModuleRegistrationName.SALES_CHANNEL)

    // Get default sales channel
    const salesChannels = await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    })

    if (!salesChannels || salesChannels.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Default Sales Channel not found. Database needs full seed."
      })
    }

    // Create publishable API key
    const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
      req.scope
    ).run({
      input: {
        api_keys: [
          {
            title: "Webshop",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    })

    const publishableApiKey = publishableApiKeyResult[0]

    // Link to sales channel
    await linkSalesChannelsToApiKeyWorkflow(req.scope).run({
      input: {
        id: publishableApiKey.id,
        add: [salesChannels[0].id],
      },
    })

    return res.json({
      status: "success",
      message: "✅ Publishable API key created!",
      publishable_key: publishableApiKey.id,
      instructions: {
        storefront: "Add this to your Storefront:",
        variable: `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.id}`
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to create publishable key",
      error: error.message
    })
  }
}
