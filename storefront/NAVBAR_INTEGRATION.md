# 🎨 Intégration Navbar ShowRoomPro B2B

## ✅ Composants shadcn/ui Créés

### Fichiers créés :
```
src/
├── lib/
│   └── utils.ts                    # Utilitaire cn() pour Tailwind
├── components/
│   ├── ui/
│   │   ├── accordion.tsx           # Component Accordion
│   │   ├── button.tsx              # Component Button
│   │   ├── navigation-menu.tsx     # Component Navigation Menu
│   │   └── sheet.tsx               # Component Sheet (mobile menu)
│   └── blocks/
│       └── showroompro-navbar.tsx  # Navbar ShowRoomPro personnalisée
└── modules/
    └── layout/
        └── templates/
            └── nav/
                └── showroompro-nav.tsx  # Wrapper pour intégration

```

## 📦 Dépendances Installées

```bash
npm install --legacy-peer-deps:
- lucide-react
- @radix-ui/react-accordion
- @radix-ui/react-slot
- class-variance-authority
- @radix-ui/react-icons
- @radix-ui/react-navigation-menu
- @radix-ui/react-dialog
- clsx
- tailwind-merge
```

## 🎯 Configuration

La navbar utilise les composants shadcn/ui avec :
- **Logo** : Building2 de lucide-react (icône B2B)
- **Menu principal** : Navigation responsive
- **Mobile** : Sheet (menu latéral)
- **Dropdown** : Navigation Menu avec sous-menus

## 🚀 Utilisation

### Remplacer la navbar actuelle

Dans `/src/app/[countryCode]/(main)/layout.tsx`, remplacer :

```typescript
import { NavigationHeader } from "@/modules/layout/templates/nav"
```

Par :

```typescript
import { ShowRoomProNav } from "@/modules/layout/templates/nav/showroompro-nav"
```

Et dans le return :

```typescript
<ShowRoomProNav />
```

## 🎨 Personnalisation

Le composant `ShowRoomProNavbar` accepte les props suivantes :

```typescript
interface ShowRoomProNavbarProps {
  logo?: {
    url: string
    src: string
    alt: string
    title: string
  }
  menu?: MenuItem[]
  mobileExtraLinks?: { name: string; url: string }[]
  auth?: {
    login: { text: string; url: string }
    signup: { text: string; url: string }
  }
}
```

## ✨ Fonctionnalités

- ✅ Responsive (desktop + mobile)
- ✅ Dropdown menus avec descriptions
- ✅ Icônes pour chaque catégorie
- ✅ Mobile Sheet menu
- ✅ Boutons Login/Signup
- ✅ Design B2B professionnel
- ✅ Compatible Tailwind CSS

## 🔄 Prochaines Étapes

1. Terminer l'installation des dépendances
2. Tester la navbar en local
3. Intégrer dans le layout principal
4. Ajuster le menu selon les catégories réelles
5. Ajouter le panier et les autres actions
6. Déployer sur Railway
