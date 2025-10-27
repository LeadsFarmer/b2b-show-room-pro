const BACKEND_URL = "https://backend-production-288f.up.railway.app"
const ADMIN_EMAIL = "hicham@leads-farmer.com"
const ADMIN_PASSWORD = "vrah4oduq22qjzo1hf9oh6m0m1wbqate"

// Les 5 produits déjà créés qu'on va mettre à jour avec les métadonnées enrichies
const PRODUCTS_TO_UPDATE = [
  {
    medusa_id: "prod_01K8K0BMHFS2F3JRKPKR49QN14", // SR02
    metadata: {
      // Specs techniques
      waterproof: "IPX7",
      battery_mah: 4000,
      battery_life: "~4 h (lumière constante + enregistrement)",
      charging_time: "~2 h (Type-C)",
      camera_specs: "1080p/30 FPS, 140° wide",
      storage: "16 GB MicroSD intégré",
      connectivity: "Bluetooth BLE 5.3, Wi-Fi",
      radar_range_m: 150,
      
      // Fournisseur DASQI
      supplier_name: "DASQI",
      supplier_country: "🇨🇳 China",
      supplier_city: "Shenzhen",
      supplier_website: "dasqi.com",
      supplier_status: "📋 Nouveau",
      supplier_priority: "⭐⭐⭐ Moyenne",
      supplier_first_contact: "2025-10-23",
      
      // B2B
      innovation: false,
      notion_category: "Tracker"
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
  console.log("🔧 Mise à jour des métadonnées produits avec infos fournisseurs\n")
  
  const token = await login()
  console.log("✅ Connecté!\n")
  
  for (const product of PRODUCTS_TO_UPDATE) {
    console.log(`📦 Mise à jour: ${product.medusa_id}`)
    console.log(`   Fournisseur: ${product.metadata.supplier_name}`)
    console.log(`   Specs: ${product.metadata.waterproof}, ${product.metadata.battery_mah}mAh`)
    
    try {
      await updateProductMetadata(token, product.medusa_id, product.metadata)
      console.log(`   ✅ Métadonnées enrichies !\n`)
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}\n`)
    }
  }
  
  console.log(`🔍 Vérifiez: ${BACKEND_URL}/app/products`)
}

main()
