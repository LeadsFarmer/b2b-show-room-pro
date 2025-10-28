import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"

export default async function productDeletedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const meilisearchService: any = container.resolve("meilisearchService")

  // Supprimer de Meilisearch
  await meilisearchService.deleteProducts([data.id])

  console.log(`✅ Product ${data.id} deleted from Meilisearch`)
}

export const config: SubscriberConfig = {
  event: "product.deleted",
}
