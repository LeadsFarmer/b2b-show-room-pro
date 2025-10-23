# 🔗 Reconnexion au Nouveau Projet Railway

## ✅ Situation Actuelle

- ✅ Ancien projet Railway supprimé
- ✅ Nouveau projet Railway : **srpB2B** créé
- ✅ Code local nettoyé des anciennes configurations
- ✅ Template Railway optimisé prêt (branche `railway-sync`)

## 🎯 Étapes de Reconnexion

### Étape 1 : Connecter Railway CLI au Projet

**Option A - Script Automatique (RECOMMANDÉ) :**

```bash
./connect-railway.sh
```

Puis **sélectionnez "srpB2B"** dans la liste interactive.

**Option B - Manuelle :**

```bash
railway link
# → Sélectionnez "srpB2B"
```

### Étape 2 : Vérifier la Connexion

```bash
# Vérifier le projet connecté
railway status

# Lister les services
railway service list

# Voir les variables d'environnement
railway variables
```

### Étape 3 : Préparer le Code pour le Déploiement

```bash
# Basculer sur la branche principale
git checkout main

# Fusionner le template Railway optimisé
git merge railway-sync --strategy-option theirs -m "Merge Railway optimized template"

# Vérifier le statut
git status
```

### Étape 4 : Pousser vers le Nouveau Projet Railway

```bash
# Pousser vers le repo GitHub connecté à Railway
git push b2b main --force
```

Railway détectera automatiquement le push et déclenchera le déploiement.

### Étape 5 : Monitorer le Déploiement

```bash
# Voir les logs en temps réel
railway logs -f

# Ou vérifier le statut
railway status
```

## 📊 Architecture du Nouveau Projet srpB2B

```
srpB2B (Railway Project)
├── Backend Service
│   ├── Medusa API + Admin
│   ├── PostgreSQL (auto-provisionné)
│   ├── Redis (auto-provisionné)
│   └── MinIO (auto-provisionné)
└── Storefront Service
    └── Next.js B2B App
```

## ⚙️ Configuration Automatique Railway

Le template va automatiquement configurer :

### Backend
- ✅ Migrations DB exécutées
- ✅ Admin user créé
- ✅ Seed data chargé
- ✅ Publishable key générée
- ✅ MinIO configuré pour les uploads

### Storefront
- ✅ Récupération auto de la clé API via `/api/key-exchange`
- ✅ Configuration CORS automatique
- ✅ Build optimisé Next.js

## 🔍 Vérification Post-Déploiement

### 1. Backend Health Check

```bash
# Via Railway CLI
railway run curl http://localhost:9000/health

# Ou directement (une fois déployé)
curl https://<backend-url>/health
```

### 2. Admin Accessible

```bash
curl -I https://<backend-url>/app
# Devrait retourner 200
```

### 3. Key Exchange Fonctionne

```bash
curl https://<backend-url>/api/key-exchange
# Devrait retourner: {"publishableApiKey": "pk_..."}
```

### 4. Storefront Charge

```bash
curl -I https://<storefront-url>
# Devrait retourner 200
```

## 📝 Variables d'Environnement

### À Vérifier sur Railway

**Backend Service:**
```bash
DATABASE_URL=<auto>         # PostgreSQL
REDIS_URL=<auto>           # Redis
MINIO_ENDPOINT=<auto>      # MinIO
MINIO_ACCESS_KEY=<auto>
MINIO_SECRET_KEY=<auto>
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
STORE_CORS=<storefront-url>
ADMIN_CORS=<backend-url>
AUTH_CORS=<backend-url>
```

**Storefront Service:**
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=<backend-url>
NEXT_PUBLIC_BASE_URL=<storefront-url>
NEXT_PUBLIC_DEFAULT_REGION=us
REVALIDATE_SECRET=supersecret
```

**Note:** Les variables `<auto>` sont générées automatiquement par Railway.

## 🆘 Dépannage

### Railway CLI ne trouve pas le projet

```bash
# Se déconnecter et reconnecter
railway logout
railway login
railway link
```

### Le projet n'apparaît pas dans la liste

Vérifiez sur le dashboard Railway que le projet **srpB2B** existe et que vous avez les permissions.

### "Not authorized" lors du push

```bash
# Vérifier le remote
git remote -v

# Si nécessaire, mettre à jour
git remote set-url b2b https://github.com/LeadsFarmer/b2b-show-room-pro.git
```

### Le build échoue sur Railway

```bash
# Voir les logs détaillés
railway logs -f

# Vérifier que le repo GitHub est bien connecté au projet Railway
```

## 🎯 Checklist de Reconnexion

- [ ] Ancien projet Railway supprimé ✅
- [ ] `railway link` exécuté et srpB2B sélectionné
- [ ] `railway status` confirme la connexion
- [ ] Template fusionné : `git merge railway-sync`
- [ ] Code poussé : `git push b2b main --force`
- [ ] Déploiement en cours (vérifier via `railway logs -f`)
- [ ] Backend accessible
- [ ] Admin fonctionne à `/app`
- [ ] Storefront charge correctement

## 📚 Ressources

- **Dashboard Railway** : https://railway.app/dashboard
- **Projet srpB2B** : Visible dans votre dashboard
- **Template source** : https://github.com/rpuls/medusa-b2b-for-railway
- **Docs Medusa** : https://docs.medusajs.com/v2

## ⏱️ Timeline Attendue

| Étape | Durée |
|-------|-------|
| Connexion Railway CLI | 1 min |
| Fusion template | 1 min |
| Push vers GitHub | 30 sec |
| Build Backend | 3-5 min |
| Build Storefront | 2-3 min |
| **Total** | **~7-10 min** |

---

**Date de création** : 23 Octobre 2025  
**Dernier update** : Reconnexion après suppression ancien projet  
**Status** : ✅ Prêt pour déploiement
