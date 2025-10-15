# 🔧 VARIABLES D'ENVIRONNEMENT RAILWAY

## Backend - Variables à ajouter

Sur Railway → Backend → Variables → Add Variables :

### **1. Redis**
```
REDIS_URL=${{Redis.REDIS_URL}}
```

### **2. Event Bus (Redis)**
```
EVENT_BUS_REDIS_URL=${{Redis.REDIS_URL}}
```

### **3. Cache Module (Redis)**  
```
CACHE_REDIS_URL=${{Redis.REDIS_URL}}
```

### **4. Session Store**
```
REDIS_SESSION_URL=${{Redis.REDIS_URL}}
```

---

## Comment ajouter sur Railway

1. Railway → Projet showroompro
2. Service **Backend**
3. Onglet **Variables**
4. Cliquez **"New Variable"** ou **"Raw Editor"**
5. Copiez-collez :

```
REDIS_URL=${{Redis.REDIS_URL}}
EVENT_BUS_REDIS_URL=${{Redis.REDIS_URL}}
CACHE_REDIS_URL=${{Redis.REDIS_URL}}
REDIS_SESSION_URL=${{Redis.REDIS_URL}}
```

6. Cliquez **Save** ou **Add**

---

## Résultat attendu

✅ Redis connecté
✅ Event Bus utilise Redis
✅ Cache utilise Redis  
✅ Sessions utilisent Redis
✅ Plus de warnings "in-memory"
