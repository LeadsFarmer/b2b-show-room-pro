# 🎯 COMMENCEZ ICI - Déploiement Railway

## 👋 Bienvenue !

Vous êtes prêt à déployer **Show Room Pro** sur Railway !

---

## 🚀 Démarrage en 3 étapes

### Étape 1 : Préparer les secrets

Générez vos secrets de sécurité :

```bash
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "COOKIE_SECRET=$(openssl rand -base64 32)"
echo "REVALIDATE_SECRET=$(openssl rand -base64 32)"
```

**💾 SAUVEGARDEZ ces valeurs** - vous en aurez besoin !

---

### Étape 2 : Lancer le script de déploiement

```bash
./deploy-railway.sh
```

Suivez le menu :
1. **Option 1** : Initialiser le projet Railway
2. **Option 2** : Déployer le backend
3. **Option 4** : Configurer la base de données
4. **Option 5** : Récupérer la clé publique
5. **Option 3** : Déployer le storefront

---

### Étape 3 : Configurer les variables

#### Backend (Railway → Service Backend → Variables)

Copiez depuis `backend/.env.railway.example` et ajustez :

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<votre-secret-généré>
COOKIE_SECRET=<votre-secret-généré>
STORE_CORS=https://votre-storefront.railway.app
ADMIN_CORS=https://votre-backend.railway.app
AUTH_CORS=https://votre-backend.railway.app
```

#### Storefront (Railway → Service Storefront → Variables)

Copiez depuis `storefront/.env.railway.example` et ajustez :

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://votre-backend.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_<clé-récupérée-étape-2>
NEXT_PUBLIC_BASE_URL=https://votre-storefront.railway.app
NEXT_PUBLIC_DEFAULT_REGION=us
REVALIDATE_SECRET=<votre-secret-généré>
```

---

## ✅ C'est tout !

Votre application sera accessible sur :
- **Admin** : `https://votre-backend.railway.app/app`
- **Storefront** : `https://votre-storefront.railway.app`

---

## 📚 Besoin de plus de détails ?

1. **Guide rapide** → `QUICK_START_RAILWAY.md`
2. **Guide complet** → `RAILWAY_DEPLOYMENT.md`
3. **Résumé technique** → `README_RAILWAY.md`

---

## 🆘 Problème ?

### Le script ne fonctionne pas ?
```bash
chmod +x deploy-railway.sh
./deploy-railway.sh
```

### Erreur CORS ?
Mettez à jour les variables `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` avec vos vraies URLs Railway.

### Clé publique invalide ?
Récupérez-la depuis la base de données :
```bash
railway connect postgres
SELECT token FROM api_key WHERE type = 'publishable';
```

---

## 🎉 Bon déploiement !

N'hésitez pas à consulter la documentation complète pour plus de détails.

**Questions ?** Consultez `RAILWAY_DEPLOYMENT.md` section "Debugging"
