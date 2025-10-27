const BACKEND_URL = "https://backend-production-288f.up.railway.app"
const ADMIN_EMAIL = "hicham@leads-farmer.com"
const ADMIN_PASSWORD = "vrah4oduq22qjzo1hf9oh6m0m1wbqate"

const PRODUCTS_TO_UPDATE = [
  {
    medusa_id: "prod_01K8K0BMS0V2TM3N06NBX2AAVJ",
    title: "MF113 — Find Wallet",
    metadata: {
      // Produit
      sku: "MF113",
      description_enrichie: "Rigid magnetic wallet with Find My support.",
      notion_category: "Tracker",
      innovation: false,
      
      // Fournisseur: SHENZHEN F&C TECHNOLOGY CO., LTD
      supplier_name: "SHENZHEN F&C TECHNOLOGY CO., LTD",
      supplier_country: "🇨🇳 China",
      supplier_city: "Shenzhen",
      supplier_website: "N/A",
      supplier_status: "📋 Nouveau",
      supplier_priority: "⭐⭐⭐ Moyenne",
      supplier_first_contact: "N/A",
      
      // Specs
      waterproof: null,
      battery_mah: null,
      connectivity: "Find My Network",
      dimensions: "Compact wallet format"
    }
  },
  {
    medusa_id: "prod_01K8K0BMZKETWNAA4HMN9W8XHG",
    title: "SR04 — Handlebar Safety Command Center",
    metadata: {
      // Produit
      sku: "SR04",
      description_enrichie: "Front visual radar display (5 LEDs). Integrated indicators. Electronic bell. Front light with SOS. 1800 mAh. IPX7. BLE 5.3. Type-C 2h.",
      notion_category: "Tracker",
      innovation: true,
      
      // Fournisseur: DASQI
      supplier_name: "DASQI",
      supplier_country: "🇨🇳 China",
      supplier_city: "Shenzhen",
      supplier_website: "dasqi.com",
      supplier_status: "📋 Nouveau",
      supplier_priority: "⭐⭐⭐ Moyenne",
      supplier_first_contact: "2025-10-23",
      
      // Specs
      waterproof: "IPX7",
      battery_mah: 1800,
      battery_life: "N/A",
      charging_time: "~2 h (Type-C)",
      connectivity: "Bluetooth BLE 5.3",
      dimensions: "60.6×49×25.5 mm",
      features: "5 LED radar display, Front/rear indicators, Electronic bell, Front light with SOS"
    }
  },
  {
    medusa_id: "prod_01K8K0BN6EZ1R1QHV4Y1Z325MR",
    title: "C42 — Entry Double-Sided Signage 450×224",
    metadata: {
      // Produit
      sku: "C42",
      description_enrichie: "Entry light box double-sided panel. 42×6×3.3 cm, 224 RGB LED. 12V 2A, 15 W. TF/App control.",
      notion_category: "Hologram",
      innovation: false,
      
      // Fournisseur: Dongguan Ruyuan (Coeus 3D Hologram)
      supplier_name: "Dongguan Ruyuan Intelligent Technology Co., LTD. (Coeus 3D Hologram)",
      supplier_country: "🇨🇳 China",
      supplier_city: "Dongguan",
      supplier_website: "N/A",
      supplier_status: "📋 Nouveau",
      supplier_priority: "⭐⭐⭐ Moyenne",
      supplier_first_contact: "2025-10-24",
      
      // Specs
      dimensions: "42×6×3.3 cm",
      led_count: "224 RGB LED",
      resolution: "450×224",
      power: "12V 2A, 15W",
      control: "TF Card / App",
      brightness: "Low (entry level)"
    }
  },
  {
    medusa_id: "prod_01K8K0BNF8WXW8N74P2J125M19",
    title: "Wet PAP Teeth Whitening Strips",
    metadata: {
      // Produit
      sku: "WS-PAP-28",
      description_enrichie: "Wet PAP formula teeth whitening strips, 28 strips per box. Safe and effective whitening.",
      notion_category: "Whitening Strips",
      innovation: false,
      
      // Fournisseur: JIANGXI IVISMILE TECHNOLOGY
      supplier_name: "JIANGXI IVISMILE TECHNOLOGY CO., LTD",
      supplier_country: "🇨🇳 China",
      supplier_city: "Yichun",
      supplier_website: "https://ivismile.com",
      supplier_status: "📋 Nouveau",
      supplier_priority: "⭐⭐⭐ Moyenne",
      supplier_first_contact: "2025-10-23",
      
      // Specs
      formula: "Wet PAP (Phthalimidoperoxycaproic Acid)",
      strips_per_box: "28 strips",
      usage: "Daily whitening treatment",
      certifications: "Safe for enamel"
    }
  }
]

async function login() {
  const response = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  })
  
  const data = await response.json()
  return data.token
}

async function updateProductMetadata(token, productId, metadata) {
  const response = await fetch(`${BACKEND_URL}/admin/products/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ metadata })
  })
  
  if (!response.ok) {
    throw new Error(await response.text())
  }
  
  return await response.json()
}

async function main() {
  console.log("🔧 Mise à jour enrichie des 4 produits test\n")
  console.log("=" .repeat(70) + "\n")
  
  const token = await login()
  console.log("✅ Connecté!\n")
  
  let successCount = 0
  
  for (const product of PRODUCTS_TO_UPDATE) {
    console.log(`📦 ${product.title}`)
    console.log(`   ID: ${product.medusa_id}`)
    console.log(`   SKU: ${product.metadata.sku}`)
    console.log(`   🏭 Fournisseur: ${product.metadata.supplier_name}`)
    console.log(`   📍 Ville: ${product.metadata.supplier_city}`)
    if (product.metadata.supplier_website && product.metadata.supplier_website !== "N/A") {
      console.log(`   🌐 Site: ${product.metadata.supplier_website}`)
    }
    if (product.metadata.innovation) {
      console.log(`   ⭐ INNOVATION!`)
    }
    
    try {
      await updateProductMetadata(token, product.medusa_id, product.metadata)
      console.log(`   ✅ Métadonnées enrichies!\n`)
      successCount++
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}\n`)
    }
  }
  
  console.log("=" .repeat(70))
  console.log(`\n📊 RÉSULTATS: ${successCount}/4 produits mis à jour`)
  
  if (successCount === 4) {
    console.log(`\n🎉 Tous les produits test ont leurs métadonnées enrichies !`)
    console.log(`\n🔍 Vérifiez: ${BACKEND_URL}/app/products`)
    console.log(`\n✅ Prêt pour l'import complet de tous les produits Notion !`)
  }
}

main()
