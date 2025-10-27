# ✅ Vérification Déploiement Railway - Admin Medusa

**Date** : 24 Octobre 2025, 18:24  
**Changement** : Admin Medusa activé (`disable: false`)

---

## 🎯 Checklist de Vérification

### 1. **Accéder à Railway Dashboard**

👉 [https://railway.app](https://railway.app)

- Sélectionnez le projet : **srpB2B**
- Vous devriez voir 2 services :
  - ✅ **Backend** (Medusa)
  - ✅ **Storefront** (Next.js)

---

### 2. **Vérifier le Service Backend**

#### A. Status du Déploiement

1. Cliquez sur **Backend**
2. Onglet **"Deployments"**
3. Le dernier déploiement devrait afficher :
   - ✅ **Status: Active** (vert)
   - 🕐 **Deployed:** Il y a ~25 min
   - 📝 **Commit:** "fix: Enable Medusa admin panel"

#### B. Logs du Backend

1. Onglet **"Logs"**
2. Vérifiez les dernières lignes :
   ```
   ✅ Admin build completed successfully
   ✅ Server is ready on port 9000
   ✅ Database connected
   ✅ Redis connected
   ```

Si vous voyez des erreurs, notez-les !

---

### 3. **Récupérer l'URL du Backend**

1. Service **Backend** → **Settings** → **Networking**
2. Section **"Public Networking"**
3. Copiez l'URL qui ressemble à :
   ```
   https://backend-production-XXXX.up.railway.app
   ```

**Notez cette URL ici :**
```
Backend URL: ________________________________
```

---

### 4. **Accéder à l'Admin Medusa**

#### A. Ouvrir l'Admin

Ouvrez dans votre navigateur :
```
https://<votre-backend-url>/app
```

**Exemple :**
```
https://backend-production-abcd.up.railway.app/app
```

#### B. Page de Connexion

Vous devriez voir :
- ✅ Interface Medusa Admin (fond blanc/violet)
- ✅ Formulaire de connexion
- ✅ Champs Email + Password

#### C. Se Connecter

**Identifiants par défaut (si seed a été exécuté) :**
- **Email :** `admin@medusa-test.com`
- **Password :** `supersecret`

Si le seed n'a pas été exécuté, vous devrez créer un utilisateur admin manuellement.

---

### 5. **Vérifier le Storefront (Bonus)**

Pendant qu'on y est, vérifions que les traductions françaises sont bien déployées :

1. Service **Storefront** → **Settings** → **Networking**
2. Récupérez l'URL du storefront
3. Ouvrez-la dans le navigateur

**Vérifications :**
- ✅ Hero : "ShowRoomPro - Votre partenaire B2B de confiance"
- ✅ Bouton : "Connexion" (au lieu de "Log in")
- ✅ Navigation : "Rechercher des produits"
- ✅ Footer : "© 2025 Show Room Pro. Tous droits réservés."

---

## 🚨 Problèmes Courants

### ❌ "Cannot GET /app"

**Causes possibles :**
1. Le build est encore en cours → Attendre 5 min de plus
2. Le déploiement a échoué → Vérifier les logs
3. La config n'a pas été appliquée → Vérifier `medusa-config.ts`

**Solution :**
```bash
# Vérifier le fichier de config dans Railway
# Settings → Variables → Vérifier que ADMIN_DISABLE n'existe pas
```

### ❌ Page Blanche sur /app

**Causes possibles :**
1. Build admin échoué → Vérifier les logs Railway
2. Problème de mémoire pendant le build → Augmenter la RAM

**Solution :**
- Settings → Resources → Augmenter à 2GB RAM minimum

### ❌ "Invalid credentials"

**Cause :**
Le seed n'a pas été exécuté, donc aucun utilisateur admin n'existe.

**Solution :**
Créer un utilisateur admin via l'API ou le seed endpoint.

---

## 📊 Résultats Attendus

### Backend Fonctionnel
```
✅ Admin accessible sur /app
✅ API accessible sur /store et /admin
✅ Base de données connectée
✅ Redis connecté
```

### Storefront Fonctionnel
```
✅ Interface en français
✅ Connexion au backend OK
✅ Produits affichés (si seed exécuté)
✅ Panier fonctionnel
```

---

## 🎯 Prochaines Actions

### Si Tout Fonctionne ✅

1. **Créer un utilisateur admin** (si pas de seed)
2. **Ajouter des produits** dans l'admin
3. **Tester le parcours complet** :
   - Inscription
   - Ajout au panier
   - Checkout
   - Commande

### Si Admin ne Fonctionne Pas ❌

1. **Vérifier les logs Railway** (erreurs de build)
2. **Vérifier la RAM** (minimum 2GB recommandé)
3. **Forcer un redéploiement** :
   ```bash
   # Faire un commit vide pour forcer le redéploiement
   git commit --allow-empty -m "chore: Force rebuild"
   git push b2b main
   ```

---

## 📝 Notes

**URLs du Projet :**
- Backend : `_________________________________`
- Storefront : `_________________________________`
- Admin : `_________________________________/app`

**Status :**
- [ ] Backend déployé
- [ ] Admin accessible
- [ ] Storefront déployé
- [ ] Traductions françaises visibles
- [ ] Seed exécuté (produits présents)

---

**Dernière vérification :** ___/___/_____ à ___h___
