#!/usr/bin/env node

/**
 * Script d'initialisation directe de la base Railway
 * Se connecte directement à PostgreSQL Railway et initialise tout
 */

const { execSync } = require('child_process');
const { Client } = require('pg');

console.log('🚀 Initialisation directe de la base Railway');
console.log('===========================================\n');

async function main() {
  try {
    // Étape 1: Récupérer l'URL de connexion PostgreSQL depuis Railway
    console.log('📊 Récupération de l\'URL PostgreSQL...');
    let dbUrl;
    try {
      dbUrl = execSync('railway variables --service Backend | grep DATABASE_URL', {
        encoding: 'utf-8',
        cwd: __dirname
      }).trim().split('=')[1];
      
      if (!dbUrl || dbUrl === '${{Postgres.DATABASE_URL}}') {
        throw new Error('Variable de référence trouvée, récupération depuis Postgres...');
      }
    } catch (e) {
      // Si pas trouvé dans Backend, essayer depuis le service Postgres
      console.log('⚠️  Tentative de connexion directe à Postgres...');
      const projectInfo = execSync('railway status', { encoding: 'utf-8', cwd: __dirname });
      console.log('Projet:', projectInfo);
      
      throw new Error('Impossible de récupérer DATABASE_URL automatiquement.\n' +
        'Solution: Allez sur Railway → PostgreSQL → Connect → copiez l\'URL de connexion');
    }

    console.log('✅ URL récupérée\n');

    // Étape 2: Se connecter à PostgreSQL
    console.log('🔌 Connexion à PostgreSQL Railway...');
    const client = new Client({ connectionString: dbUrl });
    await client.connect();
    console.log('✅ Connecté\n');

    // Étape 3: Exécuter les migrations via le backend
    console.log('🔄 Exécution des migrations...');
    console.log('   (Cela peut prendre 30 secondes)\n');
    
    execSync('yarn medusa db:migrate', {
      stdio: 'inherit',
      cwd: __dirname + '/backend',
      env: { ...process.env, DATABASE_URL: dbUrl }
    });
    
    console.log('\n✅ Migrations terminées\n');

    // Étape 4: Seed
    console.log('🌱 Insertion des données...');
    execSync('yarn run seed', {
      stdio: 'inherit',
      cwd: __dirname + '/backend',
      env: { ...process.env, DATABASE_URL: dbUrl }
    });
    console.log('✅ Données insérées\n');

    // Étape 5: Créer l'admin
    console.log('👤 Création de l\'admin...');
    execSync('yarn medusa user -e admin@showroompro.com -p ShowRoom2025! -i admin', {
      stdio: 'inherit',
      cwd: __dirname + '/backend',
      env: { ...process.env, DATABASE_URL: dbUrl }
    });
    console.log('✅ Admin créé\n');

    // Étape 6: Récupérer la clé publique
    console.log('🔑 Récupération de la clé publique...');
    const result = await client.query(
      "SELECT token FROM api_key WHERE type = 'publishable'"
    );
    
    if (result.rows.length > 0) {
      const publishableKey = result.rows[0].token;
      console.log('\n╔════════════════════════════════════════════╗');
      console.log('║     🔑 CLÉ PUBLIQUE RÉCUPÉRÉE !           ║');
      console.log('╚════════════════════════════════════════════╝\n');
      console.log('Clé publique:');
      console.log(publishableKey);
      console.log('\n💾 COPIEZ cette clé et mettez-la dans:');
      console.log('   Railway → Storefront → Variables');
      console.log('   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=' + publishableKey);
    } else {
      console.log('⚠️  Aucune clé publique trouvée');
    }

    await client.end();
    
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║         ✅ INITIALISATION TERMINÉE !       ║');
    console.log('╚════════════════════════════════════════════╝\n');
    
    console.log('📝 Prochaines étapes:');
    console.log('   1. Mettez la clé publique dans Storefront');
    console.log('   2. Attendez que les services se déploient');
    console.log('   3. Testez votre application !');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    console.log('\n💡 Solution alternative:');
    console.log('   Récupérez manuellement DATABASE_URL depuis Railway et exécutez:');
    console.log('   DATABASE_URL="postgresql://..." yarn medusa db:migrate');
    process.exit(1);
  }
}

main();
