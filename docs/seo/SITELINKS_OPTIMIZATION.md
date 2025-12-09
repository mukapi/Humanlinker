# Optimisation Sitelinks Google - Humanlinker

**Date** : 9 décembre 2024

---

## 🎯 Objectif

Faire apparaître ces 6 pages dans les sitelinks Google :

1. **About** - `/about` (PRIORITÉ 1)
2. **AI Copywriting Sequences** - `/copywriting-by-ai/writing-your-sequences` (PRIORITÉ 2)
3. **AI Sales Assistant** - `/commercial-intelligence/ai-sales-assistant` (PRIORITÉ 3)
4. **DISC Personality** - `/commercial-intelligence/disc-personality-analysis` (✅ déjà présent)
5. **Pricing** - `/pricing` (✅ déjà présent)
6. **Meeting Prep** - `/meeting-prep`

**Sitelinks actuels** : Pricing ✅, Chrome Extension ❌, DISC ✅, 360° Intel ❌, Sign up ❌

---

## 🔴 Problèmes identifiés

1. **About** est caché dans le menu "Company" (top bar) → Google ne le voit pas assez
2. **Chrome Extension** est trop visible (menu Solutions + footer) → C'est pour ça qu'elle est dans les sitelinks
3. **Sign up** (CTA principal) est trop visible → C'est pour ça qu'elle est dans les sitelinks

---

## ✅ Actions à faire (par priorité)

### Cette semaine

1. **Remonter About**
   - Option 1 : Le mettre dans la nav principale
   - Option 2 : Le mettre en 1ère position du footer (au lieu de "Homepage")

2. **Cacher Chrome Extension**
   - Ajouter `rel="nofollow"` sur TOUS les liens vers `/chrome-extension`
   - Le retirer du footer (ou le mettre tout en bas)

3. **Réduire le poids de Sign up**
   - Ajouter `rel="nofollow"` sur le CTA "Get Started"

4. **Ajouter le schema.org** (copier-coller dans le `<head>` du site)
   ```html
   <script type="application/ld+json">
   {
     "@context": "https://schema.org",
     "@type": "WebSite",
     "name": "Humanlinker",
     "url": "https://www.humanlinker.com",
     "mainEntity": {
       "@type": "ItemList",
       "itemListElement": [
         {
           "@type": "SiteNavigationElement",
           "position": 1,
           "name": "About",
           "url": "https://www.humanlinker.com/about"
         },
         {
           "@type": "SiteNavigationElement",
           "position": 2,
           "name": "AI Copywriting Sequences",
           "url": "https://www.humanlinker.com/copywriting-by-ai/writing-your-sequences"
         },
         {
           "@type": "SiteNavigationElement",
           "position": 3,
           "name": "AI Sales Assistant",
           "url": "https://www.humanlinker.com/commercial-intelligence/ai-sales-assistant"
         },
         {
           "@type": "SiteNavigationElement",
           "position": 4,
           "name": "DISC Personality Analysis",
           "url": "https://www.humanlinker.com/commercial-intelligence/disc-personality-analysis"
         },
         {
           "@type": "SiteNavigationElement",
           "position": 5,
           "name": "Pricing",
           "url": "https://www.humanlinker.com/pricing"
         },
         {
           "@type": "SiteNavigationElement",
           "position": 6,
           "name": "Meeting Prep",
           "url": "https://www.humanlinker.com/meeting-prep"
         }
       ]
     }
   }
   </script>
   ```

### Dans 2-3 semaines

5. **Renforcer les liens internes vers tes pages prioritaires**
   - Ajouter des liens bien visibles sur la homepage vers About, AI Copywriting, Meeting Prep
   - Utiliser des anchor texts descriptifs (pas "cliquez ici")

6. **Vérifier Google Search Console**
   - Vérifier que le sitemap est à jour
   - Vérifier que toutes tes pages sont indexées

---

## ⏱️ Combien de temps ça prend ?

Google met **6 à 12 semaines** à changer les sitelinks après tes optimisations.

---

## 📊 Navigation actuelle (résumé)

**Pages prioritaires :**
- About → Menu "Company" (top bar) + Footer (4ème position) → 🟡 Faible visibilité
- AI Copywriting → Menu "Product" + Footer → 🟢 Moyenne
- AI Sales Assistant → Menu "Product" + Footer → 🟢 Moyenne
- DISC → Menu "Product" + Footer → 🟢 Moyenne (✅ déjà dans sitelinks)
- Pricing → Nav principale + Footer → 🟢 Excellente (✅ déjà dans sitelinks)
- Meeting Prep → Menu "Product" + Badge "NEW" → 🟢 Bonne

**Pages problématiques :**
- Chrome Extension → Menu "Solutions" + Footer → 🟢 Trop visible (dans sitelinks ❌)
- Sign up → CTA principal header → 🟢 Trop visible (dans sitelinks ❌)

---

## 📝 Checklist

### Phase 1 (Semaine 1)
- [ ] Remonter "About" (nav principale ou 1ère position footer)
- [ ] Ajouter `rel="nofollow"` sur Chrome Extension (tous les liens)
- [ ] Ajouter `rel="nofollow"` sur Sign up CTA
- [ ] Coller le schema.org dans le `<head>`
- [ ] Vérifier Google Search Console (sitemap + indexation)

### Phase 2 (Semaines 2-3)
- [ ] Ajouter des liens vers About sur la homepage
- [ ] Ajouter des liens vers AI Copywriting Sequences sur la homepage
- [ ] Ajouter des liens vers Meeting Prep sur la homepage
- [ ] Optimiser les anchor texts (descriptifs, pas génériques)

### Suivi (À partir de 6 semaines)
- [ ] Prendre un screenshot des nouveaux sitelinks
- [ ] Comparer avec l'ancien screenshot
- [ ] Ajuster si besoin

---

## 💡 Notes importantes

- **Google contrôle les sitelinks** : Tu ne peux pas les choisir 100%, mais ces optimisations augmentent énormément tes chances
- **Patience** : Faut attendre 6-12 semaines pour voir les changements
- **2/6 déjà présents** : Tu as déjà Pricing et DISC, c'est bon signe !

---

## 📚 Sources

- [Google Search Central - Sitelinks](https://developers.google.com/search/docs/appearance/sitelinks)
- [Schema.org - SiteNavigationElement](https://schema.org/SiteNavigationElement)
- [How to Influence Google Sitelinks](https://linkilo.co/blog/sitelinks/)
