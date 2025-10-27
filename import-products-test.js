const BACKEND_URL = "https://backend-production-288f.up.railway.app"
const ADMIN_EMAIL = "hicham@leads-farmer.com"
const ADMIN_PASSWORD = "vrah4oduq22qjzo1hf9oh6m0m1wbqate"

// Mapping Notion → Medusa Categories
const CATEGORY_MAPPING = {
  "Tracker": "pcat_01K8JZ8PKF8YB9GS4A3T8FQY9X", // Tech Grand Public
  "Smartwatch": "pcat_01K8JZ8PKF8YB9GS4A3T8FQY9X",
  "AI Glasses": "pcat_01K8JZ8PKF8YB9GS4A3T8FQY9X",
  "Earbuds": "pcat_01K8JZ8PKF8YB9GS4A3T8FQY9X",
  "Hologram": "pcat_01K8JZ8PNHGXEME252RD20A039", // PLV
  "Electric Toothbrush": "pcat_01K8JZ8PVQ6T3JA5MF4MK85QBB", // Beauty
  "Water Flosser": "pcat_01K8JZ8PVQ6T3JA5MF4MK85QBB",
  "Whitening Strips": "pcat_01K8JZ8PVQ6T3JA5MF4MK85QBB",
  "Whitening Kit": "pcat_01K8JZ8PVQ6T3JA5MF4MK85QBB"
}

// 5 produits test sélectionnés
const TEST_PRODUCTS = [
  {
    notion_id: "9f16a7c1-f323-41f7-a3f7-1cb1eb6add69",
    title: "SR02 — Bicycle Radar Dashcam",
    category: "Tracker",
    description: "Premium bicycle radar with integrated 1080p/30 FPS dashcam (140° wide). 150 m detection, 4000 mAh battery, about 4 h recording. Wi-Fi. IPX7.",
    sku: "SR02",
    price: 12000 // 120€ en centimes
  },
  {
    notion_id: "0541dede-712f-42b5-8502-cc445aa1e1bb",
    title: "MF113 — Find Wallet",
    category: "Tracker",
    description: "Rigid magnetic wallet with Find My support.",
    sku: "MF113",
    price: 2500 // 25€ estimé
  },
  {
    notion_id: "05a72cad-048a-4a0a-8798-6bdc5b46eec8",
    title: "SR04 — Handlebar Safety Command Center",
    category: "Tracker",
    description: "Front visual radar display (5 LEDs). Integrated indicators. Electronic bell. Front light with SOS. 1800 mAh. IPX7.",
    sku: "SR04",
    price: 8000 // 80€ estimé
  },
  {
    notion_id: "9d376a7c-5d5e-4ffd-bb9d-2a1808945033",
    title: "C42 — Entry Double-Sided Signage 450×224",
    category: "Hologram",
    description: "Entry light box double-sided panel. 42×6×3.3 cm, 224 RGB LED. 12V 2A, 15 W.",
    sku: "C42",
    price: 15000 // 150€ estimé
  },
  {
    notion_id: "a55f61e9-3643-49b5-976c-e322c234753d",
    title: "Wet PAP Teeth Whitening Strips",
    category: "Whitening Strips",
    description: "Wet PAP formula teeth whitening strips, 28 strips per box.",
    sku: "WS-PAP-28",
    price: 1500 // 15€
  }
]

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
    throw new Error(`Login échoué: ${await response.text()}`)
  }
  
  const data = await response.json()
  console.log("✅ Connecté!\n")
  return data.token
}

async function createProduct(token, product) {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
  
  const categoryId = CATEGORY_MAPPING[product.category]
  
  if (!categoryId) {
    console.log(`⚠️  Catégorie "${product.category}" non mappée, catégorie par défaut utilisée`)
  }
  
  const productData = {
    title: product.title,
    subtitle: product.sku,
    description: product.description,
    is_giftcard: false,
    discountable: true,
    status: "published",
    handle: product.sku.toLowerCase(),
    thumbnail: null,
    metadata: {
      notion_id: product.notion_id,
      sku: product.sku,
      source: "notion_import"
    },
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
        sku: product.sku,
        manage_inventory: false,
        options: {
          "Default Option": "Default"
        },
        prices: [
          {
            amount: product.price,
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

async function importTestProducts() {
  console.log("🧪 Import Test — 5 Produits Notion → Medusa\n")
  console.log("=" .repeat(60) + "\n")
  
  try {
    const token = await login()
    
    let successCount = 0
    let failCount = 0
    
    for (let i = 0; i < TEST_PRODUCTS.length; i++) {
      const product = TEST_PRODUCTS[i]
      
      console.log(`📦 [${i + 1}/5] ${product.title}`)
      console.log(`   SKU: ${product.sku}`)
      console.log(`   Catégorie Notion: ${product.category}`)
      console.log(`   Prix: ${(product.price / 100).toFixed(2)}€`)
      
      try {
        const created = await createProduct(token, product)
        console.log(`   ✅ Créé ! ID: ${created.id}`)
        console.log(`   🔗 Admin: ${BACKEND_URL}/app/products/${created.id}\n`)
        successCount++
      } catch (error) {
        console.log(`   ❌ Erreur: ${error.message}\n`)
        failCount++
      }
    }
    
    console.log("=" .repeat(60))
    console.log(`\n📊 RÉSULTATS DU TEST:`)
    console.log(`   ✅ Succès: ${successCount}/5`)
    console.log(`   ❌ Échecs: ${failCount}/5`)
    
    if (successCount > 0) {
      console.log(`\n🔍 Vérifiez dans l'admin: ${BACKEND_URL}/app/products`)
      console.log(`📱 Testez le storefront: https://VOTRE-STOREFRONT.railway.app/fr/store`)
    }
    
    if (successCount === 5) {
      console.log(`\n🎉 Test réussi ! Prêt à importer tous les produits Notion !`)
    }
    
  } catch (error) {
    console.error(`\n❌ Erreur générale: ${error.message}`)
  }
}

importTestProducts()
