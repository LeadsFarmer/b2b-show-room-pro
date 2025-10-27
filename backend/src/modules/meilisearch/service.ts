import { MeiliSearch } from "meilisearch"

type ModuleOptions = {
  host: string
  apiKey: string
  productIndexName: string
}

export default class MeilisearchModuleService {
  private client_: MeiliSearch
  private productIndexName_: string

  constructor(container: any, options: ModuleOptions) {
    this.client_ = new MeiliSearch({
      host: options.host,
      apiKey: options.apiKey,
    })
    this.productIndexName_ = options.productIndexName
  }

  async addProducts(products: any[]) {
    const index = this.client_.index(this.productIndexName_)
    return await index.addDocuments(products)
  }

  async updateProducts(products: any[]) {
    const index = this.client_.index(this.productIndexName_)
    return await index.updateDocuments(products)
  }

  async deleteProducts(productIds: string[]) {
    const index = this.client_.index(this.productIndexName_)
    return await index.deleteDocuments(productIds)
  }

  async search(query: string, options?: any) {
    const index = this.client_.index(this.productIndexName_)
    return await index.search(query, options)
  }

  async reindexProducts(products: any[]) {
    const index = this.client_.index(this.productIndexName_)
    
    // Delete all existing documents first
    await index.deleteAllDocuments()
    
    // Add all products
    if (products.length > 0) {
      return await index.addDocuments(products)
    }
    
    return { taskUid: null }
  }
}
