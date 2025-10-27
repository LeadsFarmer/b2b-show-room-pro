const BACKEND_URL = "https://backend-production-288f.up.railway.app"
const ADMIN_EMAIL = "hicham@leads-farmer.com"
const ADMIN_PASSWORD = "vrah4oduq22qjzo1hf9oh6m0m1wbqate"
const NOTION_TOKEN = process.env.NOTION_TOKEN || "YOUR_NOTION_TOKEN"

// Mapping Notion → Medusa Categories
const CATEGORY_MAPPING = {
  "Tracker": "pcat_01K8JZ8PKF8YB9GS4A3T8FQY9X",
  "Smartwatch": "pcat_01K8JZ8PKF8YB9GS4A3T8FQY9X",
  "AI Glasses": "pcat_01K8JZ8PKF8YB9GS4A3T8FQY9X",
  "Earbuds": "pcat_01K8JZ8PKF8YB9GS4A3T8FQY9X",
  "Hologram": "pcat_01K8JZ8PNHGXEME252RD20A039",
  "Electric Toothbrush": "pcat_01K8JZ8PVQ6T3JA5MF4MK85QBB",
  "Water Flosser": "pcat_01K8JZ8PVQ6T3JA5MF4MK85QBB",
  "Whitening Strips": "pcat_01K8JZ8PVQ6T3JA5MF4MK85QBB",
  "Whitening Kit": "pcat_01K8JZ8PVQ6T3JA5MF4MK85QBB"
}

async function login() {
  console.log("🔐 Connexion à Medusa Admin...")
  
  const response = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  })
  
  if (!response.ok) {
    throw new Error(`Login échoué`)
  }
  
  const data = await response.json()
  console.log("✅ Connecté!\n")
  return data.token
}

function extractText(richText) {
  if (!richText || richText.length === 0) return ""
  return richText.map(t => t.plain_text).join("")
}

function extractPrice(priceMin, priceMax) {
  // Convertir USD en EUR (approximation) et en centimes
  const rate = 0.92 // 1 USD = 0.92 EUR approximatif
  
  if (priceMin && priceMax) {
    return Math.round((priceMin + priceMax) / 2 * rate * 100)
  } else if (priceMin) {
    return Math.round(priceMin * rate * 100)
  } else if (priceMax) {
    return Math.round(priceMax * rate * 100)
  }
  
  return 5000 // Prix par défaut: 50€
}

async function getSupplierInfo(supplierId) {
  if (!supplierId) return null
  
  const response = await fetch(`https://api.notion.com/v1/pages/${supplierId}`, {
    headers: {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28"
    }
  })
  
  if (!response.ok) return null
  
  const data = await response.json()
  const props = data.properties
  
  return {
    name: props["Nom Fournisseur"]?.title?.[0]?.plain_text || "N/A",
    country: props["Pays"]?.select?.name || "N/A",
    city: extractText(props["Ville"]?.rich_text),
    website: props["Site Web"]?.url || "",
    status: props["Status"]?.select?.name || "",
    priority: props["Priorité"]?.select?.name || "",
    first_contact: props["Date 1er Contact"]?.date?.start || ""
  }
}

async function createEnrichedProduct(token, notionProduct) {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
  
  const props = notionProduct.properties
  
  // Extraction des données de base
  const title = extractText(props["Nom Produit"]?.title)
  const sku = extractText(props["Référence SKU"]?.rich_text) || title.substring(0, 10)
  const description = extractText(props["Description"]?.rich_text)
  const category = props["Catégorie Principale"]?.select?.name
  const categoryId = CATEGORY_MAPPING[category]
  
  // Prix
  const priceMin = props["Prix Min (USD)"]?.number
  const priceMax = props["Prix Max (USD)"]?.number
  const price = extractPrice(priceMin, priceMax)
  
  // Specs techniques
  const waterproof = props["Waterproof"]?.select?.name
  const battery = props["Battery Capacity (mAh)"]?.number
  const batteryLife = extractText(props["Battery Life"]?.rich_text)
  const chargingTime = extractText(props["Charging Time"]?.rich_text)
  const camera = extractText(props["Camera"]?.rich_text)
  const storage = extractText(props["Storage"]?.rich_text)
  const connectivity = extractText(props["Connectivity"]?.rich_text)
  const dimensions = extractText(props["Dimensions"]?.rich_text)
  const radarRange = props["Radar Range (m)"]?.number
  const moq = props["MOQ"]?.number
  const innovation = props["Innovation"]?.checkbox
  
  // Fournisseur
  const supplierRelation = props["Fournisseur"]?.relation
  const supplierId = supplierRelation?.[0]?.id
  const supplier = supplierId ? await getSupplierInfo(supplierId) : null
  
  // Construction métadonnées B2B enrichies
  const metadata = {
    // Source
    notion_id: notionProduct.id,
    notion_url: notionProduct.url,
    source: "notion_import",
    
    // Fournisseur
    supplier_name: supplier?.name,
    supplier_country: supplier?.country,
    supplier_city: supplier?.city,
    supplier_website: supplier?.website,
    supplier_status: supplier?.status,
    supplier_priority: supplier?.priority,
    supplier_first_contact: supplier?.first_contact,
    
    // Specs techniques
    waterproof: waterproof,
    battery_mah: battery,
    battery_life: batteryLife,
    charging_time: chargingTime,
    camera_specs: camera,
    storage: storage,
    connectivity: connectivity,
    dimensions: dimensions,
    radar_range_m: radarRange,
    
    // B2B Info
    moq: moq,
    innovation: innovation,
    price_min_usd: priceMin,
    price_max_usd: priceMax,
    
    // Catégorie Notion
    notion_category: category
  }
  
  // Description enrichie
  let enrichedDescription = description
  
  if (camera) enrichedDescription += `\n\n📸 **Caméra:** ${camera}`
  if (waterproof) enrichedDescription += `\n💧 **Étanchéité:** ${waterproof}`
  if (battery) enrichedDescription += `\n🔋 **Batterie:** ${battery} mAh`
  if (batteryLife) enrichedDescription += ` (${batteryLife})`
  if (connectivity) enrichedDescription += `\n📡 **Connectivité:** ${connectivity}`
  if (supplier) enrichedDescription += `\n\n🏭 **Fournisseur:** ${supplier.name} (${supplier.city}, ${supplier.country})`
  
  const productData = {
    title: title,
    subtitle: sku,
    description: enrichedDescription,
    is_giftcard: false,
    discountable: true,
    status: "published",
    handle: sku.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    metadata: metadata,
    categories: categoryId ? [{ id: categoryId }] : [],
    options: [
      {
        title: "Default Option",
        values: ["Default"]
      }
    ],
    variants: [
      {
        title: "Default",
        sku: sku,
        manage_inventory: false,
        options: {
          "Default Option": "Default"
        },
        prices: [
          {
            amount: price,
            currency_code: "eur"
          }
        ]
      }
    ]
  }
  
  try {
    const response = await fetch(`${BACKEND_URL}/admin/products`, {
      method: "POST",
      headers,
      body: JSON.stringify(productData)
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }
    
    const data = await response.json()
    return data.product
  } catch (error) {
    throw new Error(`Erreur création: ${error.message}`)
  }
}

async function importEnrichedProducts() {
  console.log("🚀 Import ENRICHI — Produits Notion → Medusa avec Fournisseurs\n")
  console.log("=" .repeat(70) + "\n")
  
  try {
    const token = await login()
    
    // Récupérer les 5 produits test depuis Notion
    const notionResponse = await fetch("https://api.notion.com/v1/databases/38735e228ce142b58016a4ebeb1b814a/query", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        page_size: 5
      })
    })
    
    if (!notionResponse.ok) {
      throw new Error("Erreur récupération Notion")
    }
    
    const notionData = await notionResponse.json()
    const products = notionData.results
    
    console.log(`📦 ${products.length} produits récupérés depuis Notion\n`)
    
    let successCount = 0
    let failCount = 0
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const title = product.properties["Nom Produit"]?.title?.[0]?.plain_text || "Sans nom"
      const sku = product.properties["Référence SKU"]?.rich_text?.[0]?.plain_text || "N/A"
      
      console.log(`📦 [${i + 1}/${products.length}] ${title}`)
      console.log(`   SKU: ${sku}`)
      
      try {
        const created = await createEnrichedProduct(token, product)
        console.log(`   ✅ Créé avec métadonnées enrichies ! ID: ${created.id}`)
        console.log(`   🔗 ${BACKEND_URL}/app/products/${created.id}\n`)
        successCount++
      } catch (error) {
        console.log(`   ❌ Erreur: ${error.message}\n`)
        failCount++
      }
    }
    
    console.log("=" .repeat(70))
    console.log(`\n📊 RÉSULTATS:`)
    console.log(`   ✅ Succès: ${successCount}/${products.length}`)
    console.log(`   ❌ Échecs: ${failCount}/${products.length}`)
    
    if (successCount > 0) {
      console.log(`\n🔍 Vérifiez: ${BACKEND_URL}/app/products`)
    }
    
  } catch (error) {
    console.error(`\n❌ Erreur: ${error.message}`)
  }
}

// Note: Ce script nécessite un NOTION_TOKEN
console.log("⚠️  Ce script utilise l'API Notion MCP")
console.log("   Les métadonnées fournisseurs seront incluses !\n")

importEnrichedProducts()
