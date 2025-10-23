# 🎯 DÉMARRAGE RAPIDE - Railway B2B

## ⚡ Synchronisation en 2 Commandes

Votre projet local est maintenant **synchronisé avec le template Railway optimisé** !

### Option 1: Script Automatique (RECOMMANDÉ)

```bash
./sync-to-railway.sh
```

Ce script va:
1. ✅ Vous connecter au projet **srpB2B** sur Railway
2. ✅ Fusionner le template optimisé
3. ✅ Pousser le code vers Railway
4. ✅ Déclencher le déploiement automatique

### Option 2: Commandes Manuelles

```bash
# 1. Lier le projet Railway
railway link
# → Sélectionnez "srpB2B"

# 2. Fusionner le template
git checkout main
git merge railway-sync --strategy-option theirs

# 3. Pousser vers Railway
git push b2b main --force

# 4. Monitorer le déploiement
railway logs -f
```

## 🎉 Après le Déploiement

### Accès Admin (3-5 min après deploy)

```
URL: https://<votre-backend-url>/app
```

Les credentials sont générés automatiquement. Vérifiez les logs:
```bash
railway logs | grep -i "admin"
```

### Accès Storefront

```
URL: https://<votre-storefront-url>
```

Le storefront récupère automatiquement la clé API via `/api/key-exchange`

## 📊 Ce qui a Changé

| Feature | Ancien Setup | Nouveau (Template Railway) |
|---------|-------------|----------------------------|
| **Admin Medusa** | ❌ Désactivé | ✅ Activé |
| **Seed DB** | ❌ Manuel via endpoints | ✅ Automatique au démarrage |
| **Redis** | ⚠️ Configuration manuelle | ✅ Auto-configuré |
| **Stockage Fichiers** | ❌ Absent | ✅ MinIO intégré |
| **Clé API** | ❌ Manuelle | ✅ Auto-partagée |
| **Build** | ❌ Échouait souvent | ✅ Optimisé Railway |

## 🔍 Vérifications Post-Déploiement

### 1. Backend Health
```bash
curl https://<backend-url>/health
# → Devrait retourner "OK"
```

### 2. Admin Accessible
```bash
curl -I https://<backend-url>/app
# → Devrait retourner 200
```

### 3. Key Exchange
```bash
curl https://<backend-url>/api/key-exchange
# → Devrait retourner {"publishableApiKey": "pk_..."}
```

### 4. Storefront Fonctionne
```bash
curl -I https://<storefront-url>
# → Devrait retourner 200
```

## 🆘 Dépannage Rapide

### "railway: command not found"
```bash
npm install -g @railway/cli
```

### "Not logged in"
```bash
railway login
```

### Le build échoue
```bash
railway logs -f
# Vérifier les erreurs dans les logs
```

### L'admin ne charge pas
Vérifier les variables d'environnement:
```bash
railway variables
# S'assurer que ADMIN_CORS et AUTH_CORS sont correctes
```

## 📚 Documentation Complète

Pour des instructions détaillées, consultez:
- **Guide complet**: `RAILWAY_SYNC_GUIDE.md`
- **Template Railway**: https://github.com/rpuls/medusa-b2b-for-railway

## ✅ Checklist

- [ ] Railway CLI installé et connecté
- [ ] Script `sync-to-railway.sh` exécuté
- [ ] Déploiement Railway complété (check logs)
- [ ] Admin accessible à `/app`
- [ ] Storefront charge correctement
- [ ] Produits visibles dans l'admin
- [ ] Test commande sur le storefront

## 🎯 Prochaines Étapes

1. **Personnalisation**
   - Modifier les produits dans l'admin
   - Configurer les moyens de paiement
   - Ajouter les emails transactionnels

2. **Configuration B2B**
   - Créer des compagnies
   - Définir les spending limits
   - Configurer les approbations

3. **Production**
   - Configurer un nom de domaine custom
   - Activer les sauvegardes DB
   - Monitoring et alertes

---

**Besoin d'aide ?** Consultez le guide complet dans `RAILWAY_SYNC_GUIDE.md`
