const BACKEND_URL = "https://backend-production-288f.up.railway.app"
const ADMIN_EMAIL = "hicham@leads-farmer.com"
const ADMIN_PASSWORD = "P5p800se@"

// Toutes les catégories B2B (même structure qu'avant)
const categories = [
  {
    name: "Tech Grand Public",
    handle: "tech",
    description: "Produits technologiques grand public pour B2B",
    is_active: true,
    metadata: {
      icon: "📱",
      seo_keywords: ["tech", "electronique", "gadgets", "B2B"]
    }
  },
  {
    name: "PLV Numérique & Signalétique",
    handle: "plv",
    description: "Solutions de publicité sur lieu de vente et signalétique digitale",
    is_active: true,
    metadata: {
      icon: "🖼️",
      seo_keywords: ["plv", "signalétique", "digital", "hologramme", "B2B"]
    }
  },
  {
    name: "Mobilité & Sécurité",
    handle: "mobilite",
    description: "Solutions de mobilité urbaine et sécurité intelligente",
    is_active: true,
    metadata: {
      icon: "🚴",
      seo_keywords: ["mobilité", "vélo", "voyage", "sécurité", "B2B"]
    }
  },
  {
    name: "Beauty & Smile Care",
    handle: "beauty",
    description: "Produits de soin dentaire et beauté du sourire",
    is_active: true,
    metadata: {
      icon: "😁",
      seo_keywords: ["beauté", "dentaire", "smile", "blanchiment", "B2B"]
    }
  }
]

const subCategories = [
  {
    parent_handle: "tech",
    name: "Traqueurs & Find My",
    handle: "trackers-find-my",
    description: "Traqueurs Bluetooth et compatibles Find My Network",
    metadata: {
      icon: "📍",
      b2b: {
        moq_min: 20,
        moq_suggested: 50,
        price_range: "15-45€",
        lead_time: "20-25 jours",
        certifications: ["CE", "FCC", "RoHS"],
        customization: ["Logo gravé", "Emballage personnalisé", "Couleurs custom"],
        target_markets: ["Tech accessories", "Pet care", "Travel"]
      }
    }
  },
  {
    parent_handle: "tech",
    name: "Wearables & Montres Connectées",
    handle: "wearables",
    description: "Montres connectées et wearables santé/fitness",
    metadata: {
      icon: "⌚",
      b2b: {
        moq_min: 10,
        moq_suggested: 30,
        price_range: "50-200€",
        lead_time: "25-35 jours",
        certifications: ["IP67", "IP68", "CE", "FDA"],
        customization: ["Cadrans custom", "Packaging premium", "App branding"],
        target_markets: ["Corporate wellness", "Sports", "Health tech"]
      }
    }
  },
  {
    parent_handle: "tech",
    name: "Lunettes AI & Smart Glasses",
    handle: "lunettes-ai",
    description: "Lunettes intelligentes avec AI, AR et audio",
    metadata: {
      icon: "🕶️",
      b2b: {
        moq_min: 5,
        moq_suggested: 20,
        price_range: "120-350€",
        lead_time: "30-45 jours",
        innovation_level: "high",
        target_markets: ["Fashion tech", "Enterprise AR", "Content creators"]
      }
    }
  },
  {
    parent_handle: "tech",
    name: "Audio Open-Ear & ANC",
    handle: "audio",
    description: "Écouteurs open-ear et casques à réduction de bruit",
    metadata: {
      icon: "🎧",
      b2b: {
        moq_min: 20,
        moq_suggested: 100,
        price_range: "35-150€",
        lead_time: "20-30 jours",
        certifications: ["Hi-Res Audio", "AptX", "IPX4+"],
        customization: ["Case branding", "Couleurs", "App customization"]
      }
    }
  },
  {
    parent_handle: "plv",
    name: "Hologrammes 3D & Ventilateurs LED",
    handle: "hologrammes-3d",
    description: "Ventilateurs holographiques 3D pour PLV immersive",
    metadata: {
      icon: "✨",
      b2b: {
        moq_min: 1,
        moq_suggested: 5,
        price_range: "300-800€",
        lead_time: "35-45 jours",
        customization: ["Contenu vidéo custom", "Logo integration", "Taille ajustable"],
        target_markets: ["Retail", "Events", "Museums", "Luxury brands"]
      }
    }
  },
  {
    parent_handle: "plv",
    name: "Barres LED HDMI Temps Réel",
    handle: "barres-led-hdmi",
    description: "Barres LED synchronisées HDMI pour ambiance",
    metadata: {
      icon: "💡",
      b2b: {
        moq_min: 10,
        moq_suggested: 50,
        price_range: "80-250€",
        lead_time: "25-35 jours",
        target_markets: ["Gaming", "Home cinema", "Retail", "Streamers"]
      }
    }
  },
  {
    parent_handle: "plv",
    name: "Light Boxes & Signalétique Lumineuse",
    handle: "light-boxes",
    description: "Caissons lumineux et signalétique LED",
    metadata: {
      icon: "🔆",
      b2b: {
        moq_min: 5,
        moq_suggested: 20,
        price_range: "150-600€",
        lead_time: "30-40 jours",
        customization: ["Taille sur mesure", "Impression custom", "Montage"],
        target_markets: ["Retail", "Restaurant", "Real estate", "Events"]
      }
    }
  },
  {
    parent_handle: "mobilite",
    name: "Sécurité Vélo",
    handle: "securite-velo",
    description: "Antivols GPS et accessoires sécurité vélo",
    metadata: {
      icon: "🚲",
      b2b: {
        moq_min: 10,
        moq_suggested: 30,
        price_range: "60-250€",
        lead_time: "30-40 jours",
        waterproof: "IP65-IP67",
        customization: ["Packaging", "Manual multilingue", "App co-branding"],
        target_markets: ["Bike shops", "Sports retailers", "Urban mobility"]
      }
    }
  },
  {
    parent_handle: "mobilite",
    name: "Accessoires Voyage Intelligents",
    handle: "voyage-intelligent",
    description: "Balances bagages, cadenas TSA, trackers valise",
    metadata: {
      icon: "✈️",
      b2b: {
        moq_min: 20,
        moq_suggested: 100,
        price_range: "25-180€",
        lead_time: "25-35 jours",
        certifications: ["TSA approved", "CE", "Flight safe"],
        target_markets: ["Travel retail", "Airport shops", "Corporate gifts"]
      }
    }
  },
  {
    parent_handle: "beauty",
    name: "Blanchiment Dentaire",
    handle: "blanchiment",
    description: "Kits de blanchiment LED et gels professionnels",
    metadata: {
      icon: "✨",
      b2b: {
        moq_min: 100,
        moq_suggested: 500,
        price_range: "8-35€",
        lead_time: "25-35 jours",
        certifications: ["CE", "FDA", "ISO 13485"],
        private_label: true,
        customization: ["Packaging custom", "Formule adaptée", "Branding complet"],
        target_markets: ["Dental", "Beauty", "E-commerce", "Pharmacies"]
      }
    }
  },
  {
    parent_handle: "beauty",
    name: "Brosses à Dents Électriques & Appareils",
    handle: "appareils-dentaires",
    description: "Brosses électriques et jets dentaires",
    metadata: {
      icon: "🦷",
      b2b: {
        moq_min: 20,
        moq_suggested: 100,
        price_range: "25-120€",
        lead_time: "30-40 jours",
        certifications: ["CE", "RoHS", "Waterproof IPX7"],
        target_markets: ["Dental practices", "Beauty stores", "Wellness retailers"]
      }
    }
  }
]

async function login() {
  console.log("🔐 Connexion à Medusa Admin...")
  
  const response = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Login failed: ${error}`)
  }
  
  const data = await response.json()
  console.log("✅ Connecté avec succès!\n")
  return data.token
}

async function createCategories() {
  try {
    // 1. Login pour obtenir le JWT token
    const token = await login()
    
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
    
    const createdParents = {}
    
    // 2. Créer les catégories parentes
    console.log("📁 Étape 1/2 : Création des catégories parentes...\n")
    
    for (const category of categories) {
      try {
        const response = await fetch(`${BACKEND_URL}/admin/product-categories`, {
          method: "POST",
          headers,
          body: JSON.stringify(category)
        })
        
        if (!response.ok) {
          const error = await response.text()
          console.error(`❌ Erreur pour "${category.name}": ${error}`)
          continue
        }
        
        const data = await response.json()
        createdParents[category.handle] = data.product_category.id
        console.log(`✅ ${category.icon} ${category.name} (ID: ${data.product_category.id})`)
      } catch (error) {
        console.error(`❌ Erreur pour "${category.name}":`, error.message)
      }
    }
    
    console.log(`\n✅ ${Object.keys(createdParents).length}/4 catégories parentes créées\n`)
    
    // 3. Créer les sous-catégories
    console.log("📂 Étape 2/2 : Création des sous-catégories...\n")
    
    let createdSubs = 0
    
    for (const subCat of subCategories) {
      try {
        const parent_id = createdParents[subCat.parent_handle]
        
        if (!parent_id) {
          console.error(`❌ Parent "${subCat.parent_handle}" non trouvé pour "${subCat.name}"`)
          continue
        }
        
        const categoryData = {
          name: subCat.name,
          handle: subCat.handle,
          description: subCat.description,
          parent_category_id: parent_id,
          is_active: true,
          metadata: subCat.metadata
        }
        
        const response = await fetch(`${BACKEND_URL}/admin/product-categories`, {
          method: "POST",
          headers,
          body: JSON.stringify(categoryData)
        })
        
        if (!response.ok) {
          const error = await response.text()
          console.error(`❌ Erreur pour "${subCat.name}": ${error}`)
          continue
        }
        
        const data = await response.json()
        createdSubs++
        console.log(`  ✅ ${subCat.metadata.icon} ${subCat.name}`)
      } catch (error) {
        console.error(`❌ Erreur pour "${subCat.name}":`, error.message)
      }
    }
    
    console.log(`\n✅ ${createdSubs}/10 sous-catégories créées`)
    console.log(`\n🎉 Total: ${Object.keys(createdParents).length + createdSubs} catégories créées !`)
    console.log(`\n🔍 Vérifiez dans l'admin: ${BACKEND_URL}/app`)
    console.log(`📱 Testez le storefront: https://VOTRE-STOREFRONT.railway.app/fr/categories/tech/trackers-find-my`)
  } catch (error) {
    console.error("❌ Erreur générale:", error.message)
  }
}

createCategories()
