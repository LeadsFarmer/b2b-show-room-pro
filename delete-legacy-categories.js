const BACKEND_URL = "https://backend-production-288f.up.railway.app"
const ADMIN_EMAIL = "hicham@leads-farmer.com"
const ADMIN_PASSWORD = "vrah4oduq22qjzo1hf9oh6m0m1wbqate"

async function login() {
  const response = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  })
  
  const data = await response.json()
  return data.token
}

async function getAllCategories(token) {
  const response = await fetch(`${BACKEND_URL}/admin/product-categories?limit=100`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  
  if (!response.ok) {
    throw new Error("Erreur récupération catégories")
  }
  
  const data = await response.json()
  return data.product_categories
}

async function deleteCategory(token, categoryId) {
  const response = await fetch(`${BACKEND_URL}/admin/product-categories/${categoryId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  
  return response.ok
}

async function main() {
  console.log("🗑️  Suppression des catégories legacy...\n")
  
  const token = await login()
  console.log("✅ Connecté!\n")
  
  const categories = await getAllCategories(token)
  
  console.log(`📂 ${categories.length} catégories trouvées\n`)
  
  const legacyNames = ["Laptops", "Accessories", "Phones", "Monitors"]
  let deletedCount = 0
  
  for (const category of categories) {
    const name = category.name
    
    if (legacyNames.includes(name)) {
      console.log(`🗑️  Suppression: ${name} (${category.id})`)
      
      try {
        const success = await deleteCategory(token, category.id)
        
        if (success) {
          console.log(`   ✅ Supprimée!\n`)
          deletedCount++
        } else {
          console.log(`   ❌ Échec\n`)
        }
      } catch (error) {
        console.log(`   ❌ Erreur: ${error.message}\n`)
      }
    } else {
      console.log(`✅ Conservée: ${name}`)
    }
  }
  
  console.log(`\n📊 ${deletedCount} catégories legacy supprimées`)
  console.log(`\n🔍 Vérifiez: ${BACKEND_URL}/app/products/categories`)
}

main()
