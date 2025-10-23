# 🔧 CORRECTION - Healthcheck échoué

## ❌ PROBLÈME

Le healthcheck échouait car :
- Les migrations/seed prenaient trop de temps
- Le serveur ne démarrait pas avant le timeout

## ✅ SOLUTION APPLIQUÉE

**Modification** :
- Retour à un démarrage simple : `yarn start`
- Les migrations seront faites manuellement APRÈS

**Commit poussé** :
- "Revert to simple start - migrations will be manual"
- Railway va redéployer dans 2-3 minutes

---

## 🔄 MAINTENANT

**Le backend va redémarrer** avec juste `yarn start`.

### **2 SCÉNARIOS POSSIBLES :**

### **Scénario A : Le template a déjà initialisé la DB**

Si le template Railway Medusa a automatiquement fait les migrations :
- ✅ Le backend va démarrer correctement
- ✅ Les tables existent déjà
- ✅ On a juste besoin de la clé publique

### **Scénario B : La DB est vide**

Si la DB n'a pas été initialisée :
- ❌ Le backend va probablement crasher (tables manquantes)
- 🔧 On devra exécuter les migrations manuellement

---

## 📊 VÉRIFICATION

### **1. Attendre le redéploiement** (2-3 min)

Railway → Backend → Logs

**Si vous voyez** :
```
Server listening on port 9000
✅ SCÉNARIO A - La DB était déjà initialisée !
```

**Si vous voyez** :
```
Error: relation "store" does not exist
ou
Table not found
❌ SCÉNARIO B - Il faut initialiser la DB
```

---

## ✅ SCÉNARIO A - DB déjà initialisée

**Actions** :

1. Récupérer la clé publique :
   ```bash
   railway connect postgres
   ```
   
   Dans le shell PostgreSQL :
   ```sql
   SELECT token FROM api_key WHERE type = 'publishable';
   ```

2. Mettre la clé dans Storefront :
   ```
   Railway → Storefront → Variables
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY = pk_...
   ```

3. ✅ **TERMINÉ !**

---

## 🔧 SCÉNARIO B - DB vide (à faire si Scénario A échoue)

**Méthode : Exécuter les migrations via un script de build**

### **Option 1 : Via Railway Settings**

1. Railway → Backend → Settings
2. Section "Deploy"  
3. Cherchez "Build Command" ou "Start Command Override"
4. Ajoutez AVANT le start :
   ```
   yarn medusa db:migrate && yarn start
   ```

### **Option 2 : Via un hook de build**

Modifier `backend/package.json` :
```json
"scripts": {
  "build": "medusa build && medusa db:migrate"
}
```

### **Option 3 : Via CLI Railway (si les autres échouent)**

Créer un fichier `backend/entrypoint.sh` :
```bash
#!/bin/bash
# Vérifie si les tables existent
if ! yarn medusa db:status 2>/dev/null; then
  echo "Running migrations..."
  yarn medusa db:migrate
  yarn medusa exec ./src/scripts/seed.ts
fi
yarn medusa start
```

Puis dans nixpacks.toml :
```toml
[start]
cmd = 'bash entrypoint.sh'
```

---

## 🎯 PROCHAINES ÉTAPES IMMÉDIATES

1. **⏳ Attendez** le redéploiement (2-3 min)
2. **📊 Regardez les logs** Railway → Backend
3. **Dites-moi** :
   - ✅ "Le serveur démarre" → Scénario A
   - ❌ "Erreur de table" → Scénario B

**Et je vous guiderai pour la suite !**

---

## 📝 NOTE

Le template Medusa sur Railway devrait normalement initialiser automatiquement la DB au premier démarrage. Donc normalement c'est le **Scénario A** qui devrait se produire.

---

**Surveillez les logs Railway et tenez-moi au courant ! 🚀**
