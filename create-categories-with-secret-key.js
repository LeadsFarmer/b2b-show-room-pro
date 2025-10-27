const BACKEND_URL = "https://backend-production-288f.up.railway.app"
const SECRET_API_KEY = "sk_d2e09cc6042c178ba0e607ae60edde62d7c79698b9c15c3fe158ae824a98eb25"

// Toutes les catégories B2B
const categories = [
  {
    name: "Tech Grand Public",
    handle: "tech",
    description: "Produits technologiques grand public pour B2B",
    is_active: true,
    metadata: { icon: "📱", seo_keywords: ["tech", "electronique", "gadgets", "B2B"] }
  },
  {
    name: "PLV Numérique & Signalétique",
    handle: "plv",
    description: "Solutions de publicité sur lieu de vente et signalétique digitale",
    is_active: true,
    metadata: { icon: "🖼️", seo_keywords: ["plv", "signalétique", "digital", "B2B"] }
  },
  {
    name: "Mobilité & Sécurité",
    handle: "mobilite",
    description: "Solutions de mobilité urbaine et sécurité intelligente",
    is_active: true,
    metadata: { icon: "🚴", seo_keywords: ["mobilité", "vélo", "voyage", "B2B"] }
  },
  {
    name: "Beauty & Smile Care",
    handle: "beauty",
    description: "Produits de soin dentaire et beauté du sourire",
    is_active: true,
    metadata: { icon: "😁", seo_keywords: ["beauté", "dentaire", "smile", "B2B"] }
  }
]

const subCategories = [
  {
    parent_handle: "tech", name: "Traqueurs & Find My", handle: "trackers-find-my",
    description: "Traqueurs Bluetooth et compatibles Find My Network",
    metadata: {
      icon: "📍",
      b2b: {
        moq_min: 20, moq_suggested: 50, price_range: "15-45€", lead_time: "20-25 jours",
        certifications: ["CE", "FCC", "RoHS"],
        customization: ["Logo gravé", "Emballage personnalisé", "Couleurs custom"],
        target_markets: ["Tech accessories", "Pet care", "Travel"]
      }
    }
  },
  {
    parent_handle: "tech", name: "Wearables & Montres Connectées", handle: "wearables",
    metadata: {
      icon: "⌚",
      b2b: {
        moq_min: 10, moq_suggested: 30, price_range: "50-200€", lead_time: "25-35 jours",
        certifications: ["IP67", "IP68", "CE"], target_markets: ["Corporate wellness", "Sports"]
      }
    }
  },
  {
    parent_handle: "tech", name: "Lunettes AI & Smart Glasses", handle: "lunettes-ai",
    metadata: {
      icon: "🕶️",
      b2b: { moq_min: 5, moq_suggested: 20, price_range: "120-350€", innovation_level: "high" }
    }
  },
  {
    parent_handle: "tech", name: "Audio Open-Ear & ANC", handle: "audio",
    metadata: {
      icon: "🎧",
      b2b: { moq_min: 20, moq_suggested: 100, price_range: "35-150€", certifications: ["Hi-Res Audio"] }
    }
  },
  {
    parent_handle: "plv", name: "Hologrammes 3D & Ventilateurs LED", handle: "hologrammes-3d",
    metadata: {
      icon: "✨",
      b2b: { moq_min: 1, moq_suggested: 5, price_range: "300-800€", target_markets: ["Retail", "Events"] }
    }
  },
  {
    parent_handle: "plv", name: "Barres LED HDMI Temps Réel", handle: "barres-led-hdmi",
    metadata: {
      icon: "💡",
      b2b: { moq_min: 10, moq_suggested: 50, price_range: "80-250€" }
    }
  },
  {
    parent_handle: "plv", name: "Light Boxes & Signalétique Lumineuse", handle: "light-boxes",
    metadata: {
      icon: "🔆",
      b2b: { moq_min: 5, moq_suggested: 20, price_range: "150-600€" }
    }
  },
  {
    parent_handle: "mobilite", name: "Sécurité Vélo", handle: "securite-velo",
    metadata: {
      icon: "🚲",
      b2b: { moq_min: 10, moq_suggested: 30, price_range: "60-250€", waterproof: "IP65-IP67" }
    }
  },
  {
    parent_handle: "mobilite", name: "Accessoires Voyage Intelligents", handle: "voyage-intelligent",
    metadata: {
      icon: "✈️",
      b2b: { moq_min: 20, moq_suggested: 100, price_range: "25-180€" }
    }
  },
  {
    parent_handle: "beauty", name: "Blanchiment Dentaire", handle: "blanchiment",
    metadata: {
      icon: "✨",
      b2b: { moq_min: 100, moq_suggested: 500, price_range: "8-35€", private_label: true }
    }
  },
  {
    parent_handle: "beauty", name: "Brosses à Dents Électriques & Appareils", handle: "appareils-dentaires",
    metadata: {
      icon: "🦷",
      b2b: { moq_min: 20, moq_suggested: 100, price_range: "25-120€" }
    }
  }
]

async function createCategories() {
  console.log("🚀 Création des catégories B2B avec Secret API Key...\n")
  
  const headers = {
    "Content-Type": "application/json",
    "x-medusa-access-token": SECRET_API_KEY
  }
  
  const createdParents = {}
  
  // 1. Créer les catégories parentes
  console.log("📁 Étape 1/2 : Catégories parentes...\n")
  
  for (const category of categories) {
    try {
      const response = await fetch(`${BACKEND_URL}/admin/product-categories`, {
        method: "POST",
        headers,
        body: JSON.stringify(category)
      })
      
      if (!response.ok) {
        const error = await response.text()
        console.error(`❌ ${category.name}: ${error}`)
        continue
      }
      
      const data = await response.json()
      createdParents[category.handle] = data.product_category.id
      console.log(`✅ ${category.icon} ${category.name}`)
    } catch (error) {
      console.error(`❌ ${category.name}:`, error.message)
    }
  }
  
  console.log(`\n📊 ${Object.keys(createdParents).length}/4 parentes créées\n`)
  
  // 2. Créer les sous-catégories
  console.log("📂 Étape 2/2 : Sous-catégories...\n")
  
  let createdSubs = 0
  
  for (const subCat of subCategories) {
    const parent_id = createdParents[subCat.parent_handle]
    
    if (!parent_id) {
      console.error(`❌ Parent "${subCat.parent_handle}" manquant`)
      continue
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/admin/product-categories`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: subCat.name,
          handle: subCat.handle,
          parent_category_id: parent_id,
          is_active: true,
          metadata: subCat.metadata
        })
      })
      
      if (!response.ok) {
        const error = await response.text()
        console.error(`❌ ${subCat.name}: ${error}`)
        continue
      }
      
      createdSubs++
      console.log(`  ✅ ${subCat.metadata.icon} ${subCat.name}`)
    } catch (error) {
      console.error(`❌ ${subCat.name}:`, error.message)
    }
  }
  
  console.log(`\n📊 ${createdSubs}/10 sous-catégories créées`)
  console.log(`\n🎉 TOTAL: ${Object.keys(createdParents).length + createdSubs} catégories !`)
  console.log(`\n🔍 Vérifiez: ${BACKEND_URL}/app`)
}

createCategories()
