# 🚀 Intégration Webflow - Guide

Ce guide explique comment intégrer le code JavaScript compilé dans votre site Webflow.

## 📦 Fichiers disponibles

Après compilation, deux fichiers JavaScript sont disponibles :

1. **`index.js`** - Script principal (example avec greetUser)
2. **`index.js`** (dans /pricing/) - **Système de pricing** ← Celui que vous voulez !

## 🌐 URLs GitHub Pages

Une fois le workflow GitHub Actions exécuté, vos fichiers seront disponibles sur :

```
https://mukapi.github.io/Humanlinker/pricing/index.js
```

## 📝 Code à ajouter dans Webflow

### Option 1 : Dans les Page Settings (recommandé)

Allez dans **Page Settings** → **Custom Code** → **Before `</body>` tag** et ajoutez :

```html
<script defer src="https://mukapi.github.io/Humanlinker/pricing/index.js"></script>
```

### Option 2 : Dans un Embed HTML

Vous pouvez aussi ajouter un **Embed HTML** n'importe où sur la page :

```html
<script defer src="https://mukapi.github.io/Humanlinker/pricing/index.js"></script>
```

## ⚙️ Configuration GitHub Pages

1. Allez dans **Settings** → **Pages** de votre repo
2. **Source**: Sélectionnez "GitHub Actions"
3. Le workflow `.github/workflows/gh-pages.yml` va automatiquement :
   - Builder votre code à chaque push sur `master`
   - Déployer le dossier `dist/` sur GitHub Pages

## 🧪 Test en local

Avant de push, testez en local :

```bash
# Développement avec hot reload
pnpm dev
# Le fichier sera accessible sur http://localhost:3000/pricing/index.js

# Build de production
pnpm build
# Les fichiers compilés seront dans dist/
```

## 🎯 API JavaScript exposée

Une fois le script chargé, vous aurez accès à l'API globale :

```javascript
// Changer la devise
window.HumanlinkerPricing.setCurrency('USD'); // 'EUR', 'USD', 'GBP'

// Définir une valeur
window.HumanlinkerPricing.setValue(200); // 100, 200, 350, 600

// Obtenir la valeur actuelle
const value = window.HumanlinkerPricing.getValue();

// Obtenir la devise actuelle
const currency = window.HumanlinkerPricing.getCurrency();
```

## 📊 Exemple d'utilisation

```html
<script defer src="https://arthurvu.github.io/Humanlinker/pricing/index.js"></script>

<script>
  // Attendre que le script soit chargé
  window.addEventListener('load', () => {
    // Définir la devise en USD par défaut pour les visiteurs américains
    if (navigator.language.startsWith('en-US')) {
      window.HumanlinkerPricing?.setCurrency('USD');
    }
  });
</script>
```

## ⚡ Avantages de cette approche

- ✅ **UN SEUL script** à inclure (tout est bundlé)
- ✅ **Minifié** en production (performances optimales)
- ✅ **TypeScript** compilé en JavaScript compatible
- ✅ **Cache** par les CDN de GitHub
- ✅ **Gratuit** avec GitHub Pages
- ✅ **Auto-déployé** à chaque commit

## 🔄 Workflow de développement

1. Modifier le code dans `src/pricing/`
2. Commit & push sur GitHub
3. GitHub Actions build et déploie automatiquement
4. Le script sur Webflow se met à jour (peut prendre 1-2 minutes)

**Note** : Le cache du navigateur peut retarder la mise à jour. Pour forcer le refresh pendant le dev, ajoutez `?v=X` à l'URL :

```html
<script defer src="https://arthurvu.github.io/Humanlinker/pricing/index.js?v=2"></script>
```

