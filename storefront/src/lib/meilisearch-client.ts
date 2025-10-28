import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"

const MEILISEARCH_HOST =
  process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "http://localhost:7700"
const MEILISEARCH_API_KEY =
  process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || ""
const MEILISEARCH_INDEX_NAME =
  process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME || "products"

export const searchClient = instantMeiliSearch(
  MEILISEARCH_HOST,
  MEILISEARCH_API_KEY,
  {
    primaryKey: "id",
    placeholderSearch: true,
    keepZeroFacets: true,
  }
)

export const indexName = MEILISEARCH_INDEX_NAME
