const BACKEND_URL = "https://backend-production-288f.up.railway.app"
const SECRET_KEY = "sk_d2e09cc6042c178ba0e607ae60edde62d7c79698b9c15c3fe158ae824a98eb25"

console.log("🧪 Test de différents headers d'authentification...\n")

const headersToTest = [
  { name: "x-medusa-access-token", value: SECRET_KEY },
  { name: "Authorization", value: `Bearer ${SECRET_KEY}` },
  { name: "x-api-key", value: SECRET_KEY },
  { name: "api_token", value: SECRET_KEY }
]

async function testHeaders() {
  for (const header of headersToTest) {
    console.log(`\n📝 Test avec ${header.name}:`)
    
    try {
      const response = await fetch(`${BACKEND_URL}/admin/product-categories?limit=1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          [header.name]: header.value
        }
      })
      
      const status = response.status
      const text = await response.text()
      
      if (status === 200) {
        console.log(`  ✅ SUCCESS! Status: ${status}`)
        console.log(`  👉 Utilisez: "${header.name}: ${header.name === 'Authorization' ? 'Bearer ' + SECRET_KEY.substring(0, 20) + '...' : SECRET_KEY.substring(0, 20) + '...'}"`)
        return header
      } else {
        console.log(`  ❌ Status: ${status}`)
        console.log(`  Response: ${text.substring(0, 100)}`)
      }
    } catch (error) {
      console.log(`  ❌ Erreur: ${error.message}`)
    }
  }
  
  console.log("\n❌ Aucun header ne fonctionne. La clé est peut-être invalide ou révoquée.")
}

testHeaders()
