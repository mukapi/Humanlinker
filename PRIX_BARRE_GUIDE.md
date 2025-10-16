# 🎯 Guide : Prix Barré pour Quarterly & Annually

## 📋 Demande du Client

Afficher un prix barré (prix mensuel sans remise) sur les tabs **Quarterly** et **Annually** uniquement.

### Exemples

**Quarterly (-10%)** :
```
~~69€~~ → 62€
~~99€~~ → 89€
~~149€~~ → 134€
```

**Annually (-20%)** :
```
~~69€~~ → 55€
~~99€~~ → 79€
~~149€~~ → 119€
```

## 🔧 Modifications Webflow

### Structure HTML à ajouter

Dans votre carte de pricing, ajoutez un élément **AVANT** le prix principal :

```html
<!-- Prix barré (caché sur monthly, visible sur quarterly/annually) -->
<div data-plan-price-original>69€</div>

<!-- Prix principal (avec remise si quarterly/annually) -->
<div data-plan-price>69€</div>
```

### Option 1 : Design Simple (Recommandé)

```
Carte Pro 1
┌─────────────────┐
│                 │
│  ~~69€~~ → 62€  │ ← Prix barré + prix remisé
│                 │
│  Features...    │
└─────────────────┘
```

**Structure Webflow** :
```html
<div class="pricing_card">
  <h3 data-plan-name>Pro 1</h3>
  
  <!-- Conteneur des prix -->
  <div class="price_container">
    <!-- Prix original (barré sur quarterly/annually) -->
    <span data-plan-price-original class="price_original">69€</span>
    
    <!-- Flèche ou séparateur (optionnel) -->
    <span class="price_arrow">→</span>
    
    <!-- Prix avec remise -->
    <span data-plan-price class="price_discounted">62€</span>
  </div>
  
  <!-- Features... -->
</div>
```

### Option 2 : Design Vertical

```
Carte Pro 1
┌─────────────────┐
│                 │
│      ~~69€~~    │ ← Prix barré (petit, gris)
│       62€       │ ← Prix remisé (gros, couleur)
│                 │
│  Features...    │
└─────────────────┘
```

**Structure Webflow** :
```html
<div class="pricing_card">
  <h3 data-plan-name>Pro 1</h3>
  
  <!-- Prix original barré -->
  <div data-plan-price-original class="price_original">69€</div>
  
  <!-- Prix avec remise -->
  <div data-plan-price class="price_main">62€</div>
  
  <!-- Features... -->
</div>
```

## 🎨 Styles CSS Suggérés

### Pour le prix barré

```css
[data-plan-price-original] {
  text-decoration: line-through;
  opacity: 0.6;
  font-size: 0.9em; /* Légèrement plus petit */
  color: #999; /* Gris */
  margin-right: 8px; /* Espace avec le prix remisé */
}

/* Caché par défaut (le JS le montre sur quarterly/annually) */
[data-plan-price-original] {
  display: none;
}
```

### Pour le prix remisé

```css
[data-plan-price] {
  font-size: 2em;
  font-weight: bold;
  color: #000;
}
```

### Avec flèche

```css
.price_container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price_arrow {
  font-size: 1.2em;
  color: #999;
}
```

## ⚙️ Comment ça fonctionne

### 1. Sur Monthly

Le script **cache** automatiquement `[data-plan-price-original]` :

```javascript
el.style.display = 'none'; // Prix barré caché
```

Résultat : On voit juste **69€**

### 2. Sur Quarterly / Annually

Le script **affiche** `[data-plan-price-original]` avec style barré :

```javascript
el.textContent = '69€';
el.style.display = 'inline';
el.style.textDecoration = 'line-through';
el.style.opacity = '0.6';
```

Résultat : On voit **~~69€~~ → 62€**

## 🎯 Étapes dans Webflow

### 1. Ajouter l'élément HTML

1. Ouvrez votre page pricing dans Webflow
2. Sélectionnez la carte de pricing (Pro 1, Pro 2, Pro 3)
3. Trouvez l'élément qui contient le prix actuel `[data-plan-price]`
4. **Ajoutez un élément DIV ou SPAN AVANT** cet élément
5. Donnez-lui l'attribut : `data-plan-price-original`

### 2. Structurer visuellement

**Option A - Horizontal** :
- Mettre les deux prix dans un conteneur flex
- `display: flex; align-items: center; gap: 8px;`

**Option B - Vertical** :
- Empiler les prix verticalement
- Le barré au-dessus, plus petit et gris

### 3. Style initial

Le prix barré peut avoir un style initial dans Webflow :
- Font size : 0.9em ou 18px (plus petit que le prix principal)
- Color : Gris (#999)
- Display : **Aucun** (ou laissez, le JS le cache automatiquement)

Le script ajoutera automatiquement :
- `text-decoration: line-through` sur quarterly/annually
- `display: none` sur monthly

## 📊 Exemple Complet

```html
<!-- Dans votre tab pane (Monthly, Quarterly, Annually) -->
<div class="w-tab-pane">
  
  <!-- Carte Pro 1 -->
  <div class="pricing_card">
    <h3 data-plan-name>Pro 1</h3>
    
    <!-- Container des prix -->
    <div class="prices" style="display: flex; align-items: center; gap: 8px;">
      <!-- Prix original (JS le cache sur monthly) -->
      <span 
        data-plan-price-original 
        style="font-size: 1.5em; color: #999;">
        69€
      </span>
      
      <!-- Flèche -->
      <span style="color: #999;">→</span>
      
      <!-- Prix avec remise -->
      <span 
        data-plan-price 
        style="font-size: 2em; font-weight: bold;">
        69€
      </span>
    </div>
    
    <!-- Features -->
    <div data-credits-ia>200</div>
    <!-- etc... -->
  </div>
  
</div>
```

## ✅ Résultat Final

### Tab Monthly
```
Pro 1
62€        ← Juste le prix (pas de barré)
Features...
```

### Tab Quarterly (-10%)
```
Pro 1
~~69€~~ → 62€    ← Prix barré + prix remisé
Features...
```

### Tab Annually (-20%)
```
Pro 1
~~69€~~ → 55€    ← Prix barré + prix remisé
Features...
```

## 🚀 Déploiement

1. **Commitez** les changements avec GitHub Desktop
2. **Pushez** vers GitHub
3. **Attendez** le déploiement (~2 min)
4. **Ajoutez** l'élément `[data-plan-price-original]` dans Webflow
5. **Publiez** le site Webflow
6. **Testez** en changeant de tab !

C'est tout ! Le script s'occupe automatiquement de tout le reste ! 🎉

