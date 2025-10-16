# 🎯 Humanlinker Pricing System

Système de pricing complet et modulaire en TypeScript pour gérer les plans Pro avec tarification dynamique, multi-devises, et gestion utilisateurs.

## 📦 Architecture

```
src/pricing/
├── index.ts                 # Point d'entrée principal (orchestre tout)
├── types.ts                 # Définitions TypeScript
├── constants.ts             # Prix, devises, sélecteurs CSS
│
├── plan-calculator.ts       # Calculs de prix et features
├── currency-manager.ts      # Gestion des devises
├── language-detector.ts     # Détection langue → devise
├── billing-period.ts        # Gestion tabs (mensuel/trimestriel/annuel)
├── user-selector.ts         # Gestion dropdown utilisateurs
├── slider-controller.ts     # Contrôle du slider de plans
├── pricing-display.ts       # Mise à jour de l'affichage DOM
├── placeholder-clicks.ts    # Clics sur placeholders
└── tooltips.ts              # Tooltips Tippy.js + Lottie
```

## 🎨 Fonctionnalités

### ✅ Plans Pro

- **Pro 1**: 69€/mois - 200 crédits IA
- **Pro 2**: 99€/mois - 350 crédits IA  
- **Pro 3**: 149€/mois - 600 crédits IA

### ✅ Périodes de Facturation

- **Mensuel**: Prix standard
- **Trimestriel**: -10% de réduction
- **Annuel**: -20% de réduction

### ✅ Multi-devises

- **EUR** (€) - Taux de base
- **USD** ($) - Taux : 1.08
- **GBP** (£) - Taux : 0.85

### ✅ Gestion Utilisateurs

- 1 à 10 utilisateurs
- Prix multiplié par le nombre d'utilisateurs
- Crédits multipliés par le nombre d'utilisateurs

### ✅ Détection Automatique

- Détection langue du site → devise appropriée
- Observation des changements de langue
- Gestion des tabs Webflow natifs

## 🔧 Utilisation dans Webflow

### 1. Inclure le script

```html
<script defer src="https://mukapi.github.io/Humanlinker/pricing/index.js"></script>
```

### 2. Structure HTML requise

#### Slider de Plans

```html
<div class="w-tab-content">
  <div class="w-tab-pane w--tab-active">
    <!-- Slider Finsweet -->
    <div fs-rangeslider-element="wrapper">
      <div fs-rangeslider-element="track">
        <div fs-rangeslider-element="fill"></div>
      </div>
      <div fs-rangeslider-element="handle" aria-valuenow="1">
        <div fs-rangeslider-element="display-value">1</div>
      </div>
    </div>
  </div>
</div>
```

#### Tabs de Période

```html
<div data-pricing-period="monthly" class="w--current">Monthly</div>
<div data-pricing-period="quarterly">Quarterly</div>
<div data-pricing-period="annual">Annual</div>
```

#### Dropdown Utilisateurs

```html
<div class="pricing_main_dropdown">
  <div class="w-dropdown-toggle">
    <span data-dropdown-label>1 utilisateur</span>
  </div>
  <div class="w-dropdown-list">
    <div class="pricing_main_dropdown_list_item" data-user-value="1">
      <span data-user-label>1 utilisateur</span>
    </div>
    <div class="pricing_main_dropdown_list_item" data-user-value="2">
      <span data-user-label>2 utilisateurs</span>
    </div>
    <!-- ... -->
  </div>
</div>
```

#### Affichage des Prix

```html
<!-- Plan name -->
<div data-plan-name>Pro 1</div>

<!-- Price -->
<div data-plan-price>69€</div>

<!-- Features -->
<div data-credits-ia>200</div>
<div data-boites-email>2</div>
<div data-enrichissements>200</div>
<div data-recommendations>800</div>
```

### 3. Sélecteur de Devise

```html
<select data-currency-selector class="pricing_currency_select">
  <option value="€ EUR">€ EUR</option>
  <option value="$ USD">$ USD</option>
  <option value="Pound (£)">£ GBP</option>
</select>
```

## 🎮 API JavaScript

```javascript
// Getters
window.HumanlinkerPricing.getCurrency()      // => 'EUR'
window.HumanlinkerPricing.getPlan()          // => 1
window.HumanlinkerPricing.getUsers()         // => 1
window.HumanlinkerPricing.getBillingPeriod() // => 'monthly'
window.HumanlinkerPricing.getState()         // => { ... }

// Setters
window.HumanlinkerPricing.setCurrency('USD')
window.HumanlinkerPricing.setPlan(2)
window.HumanlinkerPricing.setUsers(5)

// Utilities
window.HumanlinkerPricing.refresh()  // Force refresh display
window.HumanlinkerPricing.reinit()   // Reinitialize system
```

## 🎨 Tooltips

### Texte simple

```html
<span data-tippy-content="Votre texte ici">Hover me</span>
```

### Animation Lottie

```html
<span data-lottie="https://url-to-lottie.json">Hover me</span>
```

**Note** : Tippy.js et Lottie-web doivent être chargés via CDN :

```html
<script src="https://unpkg.com/@popperjs/core@2"></script>
<script src="https://unpkg.com/tippy.js@6"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>
```

## 🚀 Build & Deploy

```bash
# Development
pnpm dev
# → http://localhost:3000/pricing/index.js

# Production
pnpm build
# → dist/pricing/index.js

# Deploy (automatic via GitHub Actions)
git push origin master
# → https://mukapi.github.io/Humanlinker/pricing/index.js
```

## 🎯 Logique Business

### Calcul du Prix

```typescript
// Base price per user (EUR)
const basePrice = PRO_PLANS[plan].price;

// Apply user multiplier
let monthlyPrice = basePrice * users;

// Apply billing discount
if (period === 'annual') monthlyPrice *= 0.8;      // -20%
if (period === 'quarterly') monthlyPrice *= 0.9;   // -10%

// Convert currency
const finalPrice = monthlyPrice * CURRENCIES[currency].exchangeRate;
```

### Calcul des Features

```typescript
// Features scale with users
const creditsIA = PRO_PLANS[plan].creditsIA * users;
const enrichissements = PRO_PLANS[plan].enrichissementsEmails * users;
const recommendations = PRO_PLANS[plan].recommendationsContacts * users;

// Note: Credits are PER MONTH regardless of billing period
```

## 🔍 Détection Langue → Devise

```typescript
// French → EUR
if (lang.startsWith('fr')) currency = 'EUR';

// English US → USD
if (lang === 'en' || lang === 'en-US') currency = 'USD';

// English UK → GBP
if (lang === 'en-GB') currency = 'GBP';
```

## 🎨 Classes CSS Importantes

```css
/* Tabs */
.w-tab-pane          /* Tab content container */
.w--tab-active       /* Active tab */
.w--current          /* Current tab button */

/* Dropdown */
.pricing_main_dropdown                /* Dropdown container */
.pricing_main_dropdown_list_item      /* Dropdown item */
.is-active                            /* Active dropdown item */
.w--open                              /* Open dropdown */

/* Slider */
.pricing_main_highlight_placeholder   /* Clickable placeholder */
.pricing_main_highlight_card          /* Highlight card */
.pricing_main_highlight_range_wrap    /* Range wrapper */
```

## 🐛 Debugging

```javascript
// Check initialization
console.log(window.HumanlinkerPricing);

// Get current state
const state = window.HumanlinkerPricing.getState();
console.log(state);

// Force refresh
window.HumanlinkerPricing.refresh();
```

## 📝 Migration depuis l'ancien code

### Avant (4 scripts séparés)

```html
<!-- Script 1: Placeholder clicks -->
<script>...</script>

<!-- Script 2: Pricing slider -->
<script>...</script>

<!-- Script 3: Tooltips -->
<script>...</script>

<!-- Script 4: Full pricing system -->
<script>...</script>
```

### Après (1 seul script)

```html
<script defer src="https://mukapi.github.io/Humanlinker/pricing/index.js"></script>
```

Tout est fusionné, typé, et optimisé ! 🎉

