# 📝 Ordre EXACT des Scripts dans Webflow

## ⚠️ IMPORTANT : L'ordre est crucial !

Pour que tout fonctionne correctement, mettez les scripts dans **CET ORDRE PRÉCIS** :

## ✅ Scripts à ajouter dans Webflow

**Page Settings** → **Custom Code** → **Before `</body>` tag** :

```html
<!-- 1. Finsweet Range Slider (DOIT être AVANT votre script) -->
<script defer src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-rangeslider@1/rangeslider.js"></script>

<!-- 2. Tooltips - Popper (base pour Tippy) -->
<script src="https://unpkg.com/@popperjs/core@2"></script>

<!-- 3. Tooltips - Tippy.js -->
<script src="https://unpkg.com/tippy.js@6"></script>

<!-- 4. Tooltips - Lottie (pour les animations) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>

<!-- 5. Système de pricing Humanlinker (DOIT être EN DERNIER) -->
<script defer src="https://mukapi.github.io/Humanlinker/pricing/index.js"></script>
```

## 🎯 Pourquoi cet ordre ?

1. **Finsweet Range Slider** en premier → Initialise les sliders
2. **Popper + Tippy + Lottie** → Bibliothèques pour tooltips
3. **Votre script** en dernier → Attend que tout soit chargé, puis s'initialise

## 🔧 Ce qui a changé dans le code

J'ai modifié `pricing/index.ts` pour qu'il :

✅ **Attende** que Finsweet Range Slider soit prêt avec :
```javascript
fsAttributes.push(['rangeslider', callback])
```

✅ **N'interfère PAS** avec le slider Finsweet

✅ **Observe** les changements du slider plutôt que de le contrôler manuellement

## 🐛 Si ça ne marche toujours pas

Dans la console (F12), vérifiez que vous voyez :
```
✅ Humanlinker Pricing System ready (after Finsweet)
```

**Si vous voyez un autre message** (Webflow fallback, DOM fallback), ça veut dire que Finsweet n'est pas détecté correctement.

## 💡 Test Rapide

Dans la console, tapez :
```javascript
// Vérifier que Finsweet est chargé
console.log(window.fsAttributes);

// Vérifier l'API Humanlinker
console.log(window.HumanlinkerPricing);

// Tester un changement
window.HumanlinkerPricing.setPlan(2);
```

---

## 📋 Checklist Complète

- ✅ Script Finsweet Range Slider EN PREMIER
- ✅ Scripts tooltips au milieu
- ✅ Votre script Humanlinker EN DERNIER
- ✅ Tous avec `defer` ou `async` (sauf tooltips)
- ✅ Commit + Push sur GitHub
- ✅ Attendre déploiement (~2 min)
- ✅ Publier le site Webflow
- ✅ Tester !

---

**Note** : Si le slider ne fonctionne toujours pas sur Monthly, partagez-moi ce que vous voyez dans la console (F12), je pourrai debugger plus précisément !

