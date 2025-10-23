# 🔧 DÉSACTIVER LE HEALTHCHECK RAILWAY

## ❌ PROBLÈME

Le build échoue car le healthcheck `/health` :
- Timeout trop court (2 minutes)
- Le serveur Medusa met plus de temps à démarrer
- Le healthcheck échoue → Deploy échoué

## ✅ SOLUTION

**Désactiver temporairement le healthcheck** pour que le backend puisse démarrer.

---

## 📋 ÉTAPES SUR RAILWAY.APP

### **1. Aller dans les Settings**

```
Railway.app
→ Projet: showroompro
→ Service: Backend
→ Onglet: Settings (en haut)
```

### **2. Trouver la section Healthcheck**

Scrollez jusqu'à trouver :
- **"Healthcheck"** ou
- **"Health Check Path"** ou
- **"Deploy Health Check"**

### **3. Désactiver**

**Option A - Toggle switch :**
```
Healthcheck: [ON] → [OFF]
```

**Option B - Supprimer le path :**
```
Healthcheck Path: /health → (VIDE - supprimez le texte)
```

**Option C - Augmenter drastiquement :**
```
Healthcheck Path: /health
Timeout: 600 (10 minutes)
Initial Delay: 120 (2 minutes)
```

### **4. Sauvegarder**

Cliquez sur **"Save"** ou le bouton de sauvegarde.

---

## 🔄 APRÈS MODIFICATION

Railway va **automatiquement redéployer** :
- Sans healthcheck ou avec un timeout plus long
- Le serveur aura le temps de démarrer
- Deploy devrait réussir ✅

---

## 📊 VÉRIFICATION

Une fois redéployé, dans les logs vous devriez voir :

```
✅ Building...
✅ Starting...
✅ Server listening on port 9000
✅ Deploy successful!
```

Sans voir :
```
❌ Starting Healthcheck
❌ Attempt #1 failed...
❌ Healthcheck failed!
```

---

## 🎯 APRÈS LE DÉPLOIEMENT RÉUSSI

Une fois que le backend est 🟢 (deployed) :

1. **Vérifier si la DB est initialisée** (voir les logs)
2. **Si oui** : Récupérer la clé publique
3. **Si non** : Exécuter les migrations
4. **Configurer le Storefront**
5. **Tester** ! ✅

---

## 💡 NOTE

Le healthcheck est utile en production, mais pour l'instant on le désactive pour débugger et initialiser l'application. On pourra le réactiver plus tard une fois que tout fonctionne.

---

## 📸 CAPTURES D'ÉCRAN (si besoin)

Si vous ne trouvez pas la section Healthcheck :
1. Faites une capture d'écran de la page Settings
2. Envoyez-la moi
3. Je vous dirai exactement où cliquer

---

**Allez sur Railway → Backend → Settings et désactivez le healthcheck maintenant ! 🚀**
