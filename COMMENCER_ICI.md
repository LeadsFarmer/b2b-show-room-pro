# 🚀 DÉMARRER MAINTENANT - 3 Commandes

## ⚡ Reconnexion Express au Nouveau Railway

Vous avez supprimé l'ancien projet problématique. Voici comment connecter le nouveau **srpB2B** :

### 1️⃣ Connecter au Projet Railway (1 min)

```bash
./connect-railway.sh
```

**→ Sélectionnez "srpB2B" quand demandé**

### 2️⃣ Préparer le Code Propre (30 sec)

```bash
git checkout main
git merge railway-sync --strategy-option theirs -m "Apply Railway template"
```

### 3️⃣ Déployer sur Railway (déclenchement auto)

```bash
git push b2b main --force
```

### 4️⃣ Surveiller le Déploiement (7-10 min)

```bash
railway logs -f
```

---

## ✅ Ce qui va se passer

1. **Backend build** (3-5 min)
   - Migrations DB automatiques
   - Admin user créé
   - Seed des données démo
   - MinIO configuré

2. **Storefront build** (2-3 min)
   - Récupération auto de la clé API
   - Build Next.js optimisé

3. **URLs disponibles**
   - Admin : `https://<backend>/app`
   - Storefront : `https://<storefront>`

---

## 🎯 URLs du Nouveau Projet

Après le déploiement, trouvez vos URLs sur :
```
https://railway.app/project/srpB2B
```

---

## 🆘 Si Problème

### Railway link ne marche pas
```bash
railway logout
railway login
railway link
```

### Voir les erreurs de build
```bash
railway logs
```

### Forcer un rebuild
```bash
railway up --detach
```

---

## 📖 Documentation Complète

- **Reconnexion détaillée** : `RECONNEXION_RAILWAY.md`
- **Guide complet** : `RAILWAY_SYNC_GUIDE.md`
- **Démarrage rapide** : `START_HERE_RAILWAY.md`

---

**C'EST TOUT !** Le template Railway s'occupe du reste automatiquement 🎉
