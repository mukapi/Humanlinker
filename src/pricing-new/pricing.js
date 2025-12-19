/**
 * Humanlinker Pricing Script (JS pur)
 * Gère la mise à jour dynamique des prix selon :
 * - Le plan sélectionné (Pro 1, 2, 3 via slider)
 * - Le nombre d'utilisateurs (1-5)
 * - La devise (EUR, USD, GBP)
 */

/* global document, window, setTimeout, console, MutationObserver, MouseEvent */

(function () {
  'use strict';

  // ===========================================
  // CONFIGURATION
  // ===========================================

  const CONFIG = {
    // Prix par plan (EUR, par mois, par utilisateur)
    plans: {
      1: { name: 'Pro 1', price: 69, credits: 200 },
      2: { name: 'Pro 2', price: 99, credits: 350 },
      3: { name: 'Pro 3', price: 149, credits: 600 },
    },

    // Taux de change depuis EUR
    currencies: {
      EUR: { symbol: '€', rate: 1, position: 'after' },
      USD: { symbol: '$', rate: 1.08, position: 'before' },
      GBP: { symbol: '£', rate: 0.85, position: 'before' },
    },

    // Classes CSS Webflow
    cssClasses: {
      dropdown: 'pricing_main_dropdown',
      dropdownToggle: 'w-dropdown-toggle',
      dropdownList: 'w-dropdown-list',
      dropdownOpen: 'w--open',
      dropdownActive: 'is-active',
    },
  };

  // ===========================================
  // STATE
  // ===========================================

  const state = {
    plan: 1, // 1, 2, ou 3
    users: 1, // 1 à 5
    currency: 'EUR',
  };

  // ===========================================
  // SELECTORS
  // ===========================================

  const SELECTORS = {
    // Éléments à mettre à jour
    priceMonthly: '[data-price-monthly]',
    priceAnnual: '[data-price-annual]',
    userCount: '[data-user-count]',
    creditsTotal: '[data-credits-total]',
    currencySelector: '[data-currency-selector]',

    // Slider Finsweet
    sliderHandle: '[fs-rangeslider-element="handle"]',

    // Dropdown users
    userDropdownItems: '[data-user-value]',
  };

  // ===========================================
  // DOM ELEMENTS CACHE
  // ===========================================

  let elements = {};

  function cacheElements() {
    elements = {
      priceMonthly: document.querySelector(SELECTORS.priceMonthly),
      priceAnnual: document.querySelector(SELECTORS.priceAnnual),
      userCount: document.querySelector(SELECTORS.userCount),
      creditsTotal: document.querySelector(SELECTORS.creditsTotal),
      currencySelector: document.querySelector(SELECTORS.currencySelector),
      sliderHandle: document.querySelector(SELECTORS.sliderHandle),
      userDropdownItems: document.querySelectorAll(SELECTORS.userDropdownItems),
    };
  }

  // ===========================================
  // CALCULATIONS
  // ===========================================

  function calculatePricing() {
    const plan = CONFIG.plans[state.plan];
    const currency = CONFIG.currencies[state.currency];

    // Prix mensuel (par utilisateur × nombre d'users × taux de change)
    const monthlyPrice = Math.round(plan.price * state.users * currency.rate);

    // Prix annuel total
    const annualPrice = Math.round(monthlyPrice * 12);

    // Crédits IA (juste la valeur du plan, pas de multiplication)
    const credits = plan.credits;

    return {
      monthlyPrice,
      annualPrice,
      credits,
      currencySymbol: currency.symbol,
      currencyPosition: currency.position,
    };
  }

  function formatPrice(amount, symbol, position) {
    if (position === 'before') {
      return `${symbol}${amount}`;
    }
    return `${amount}${symbol}`;
  }

  // ===========================================
  // UI UPDATES
  // ===========================================

  function updateDisplay() {
    const pricing = calculatePricing();

    // Prix mensuel
    if (elements.priceMonthly) {
      elements.priceMonthly.textContent = formatPrice(
        pricing.monthlyPrice,
        pricing.currencySymbol,
        pricing.currencyPosition
      );
    }

    // Prix annuel
    if (elements.priceAnnual) {
      const symbol = pricing.currencyPosition === 'before' ? pricing.currencySymbol : '';
      const suffix = pricing.currencyPosition === 'after' ? pricing.currencySymbol : '';

      elements.priceAnnual.textContent = `${symbol}${pricing.annualPrice}${suffix} billed annually (excl. VAT)`;
    }

    // Crédits IA (valeur fixe selon le plan)
    if (elements.creditsTotal) {
      elements.creditsTotal.textContent = `${pricing.credits} AI credits per year`;
    }

    console.log('📊 Pricing updated:', {
      plan: state.plan,
      users: state.users,
      currency: state.currency,
      monthlyPrice: pricing.monthlyPrice,
      annualPrice: pricing.annualPrice,
      credits: pricing.credits,
    });
  }

  // ===========================================
  // EVENT LISTENERS
  // ===========================================

  function setupCurrencyListener() {
    if (!elements.currencySelector) return;

    elements.currencySelector.addEventListener('change', (e) => {
      const { value } = e.target;

      // Extraire le code devise depuis la valeur du select
      if (value.includes('EUR') || value.includes('€')) {
        state.currency = 'EUR';
      } else if (value.includes('USD') || value.includes('Dollar') || value.includes('$')) {
        state.currency = 'USD';
      } else if (value.includes('GBP') || value.includes('Pound') || value.includes('£')) {
        state.currency = 'GBP';
      }

      updateDisplay();
    });
  }

  function setupSliderObserver() {
    if (!elements.sliderHandle) return;

    // Observer pour détecter les changements de aria-valuenow
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-valuenow') {
          const newValue = parseInt(elements.sliderHandle.getAttribute('aria-valuenow') || '1');
          if (newValue >= 1 && newValue <= 3 && newValue !== state.plan) {
            state.plan = newValue;
            updateDisplay();
          }
        }
      });
    });

    observer.observe(elements.sliderHandle, { attributes: true });

    // Valeur initiale
    const initialValue = parseInt(elements.sliderHandle.getAttribute('aria-valuenow') || '1');
    if (initialValue >= 1 && initialValue <= 3) {
      state.plan = initialValue;
    }
  }

  // ===========================================
  // DROPDOWN HELPERS
  // ===========================================

  /**
   * Ferme le dropdown Webflow proprement
   * Webflow utilise la classe w--open pour gérer l'état ouvert/fermé
   */
  function closeDropdown(item) {
    const dropdown = item.closest(`.${CONFIG.cssClasses.dropdown}`);
    if (!dropdown) return;

    const toggle = dropdown.querySelector(`.${CONFIG.cssClasses.dropdownToggle}`);
    const list = dropdown.querySelector(`.${CONFIG.cssClasses.dropdownList}`);

    // Retirer les classes w--open directement
    if (toggle) {
      toggle.classList.remove(CONFIG.cssClasses.dropdownOpen);
      toggle.setAttribute('aria-expanded', 'false');
    }
    if (list) {
      list.classList.remove(CONFIG.cssClasses.dropdownOpen);
    }
  }

  /**
   * Met à jour le label du dropdown avec la valeur sélectionnée
   */
  function updateDropdownLabel(item) {
    const dropdown = item.closest(`.${CONFIG.cssClasses.dropdown}`);
    if (!dropdown) return;

    // Chercher le label dans l'item sélectionné
    const userLabel = item.querySelector('[data-user-label]');
    const dropdownLabel = dropdown.querySelector('[data-dropdown-label]');

    if (userLabel && dropdownLabel) {
      dropdownLabel.textContent = userLabel.textContent;
    }
  }

  /**
   * Met à jour l'état actif des items du dropdown
   */
  function updateDropdownActiveState(selectedItem) {
    const dropdown = selectedItem.closest(`.${CONFIG.cssClasses.dropdown}`);
    if (!dropdown) return;

    // Retirer is-active de tous les items
    const allItems = dropdown.querySelectorAll('[data-user-value]');
    allItems.forEach((el) => el.classList.remove(CONFIG.cssClasses.dropdownActive));

    // Ajouter is-active à l'item sélectionné
    selectedItem.classList.add(CONFIG.cssClasses.dropdownActive);
  }

  function setupUserDropdownListeners() {
    if (!elements.userDropdownItems || elements.userDropdownItems.length === 0) return;

    elements.userDropdownItems.forEach((item) => {
      item.addEventListener('click', () => {
        const userValue = parseInt(item.getAttribute('data-user-value') || '1');

        if (userValue >= 1 && userValue <= 5) {
          state.users = userValue;

          // Mettre à jour l'UI du dropdown
          updateDropdownActiveState(item);
          updateDropdownLabel(item);
          closeDropdown(item);

          // Mettre à jour l'affichage du nombre d'users (data-user-count)
          if (elements.userCount) {
            elements.userCount.textContent = userValue === 1 ? '1 user' : `${userValue} users`;
          }

          updateDisplay();
        }
      });
    });
  }

  // ===========================================
  // PLACEHOLDER CLICKS (étapes du slider cliquables)
  // ===========================================

  /**
   * Détermine la valeur du placeholder cliqué
   */
  function determineSliderValue(placeholder) {
    // Utiliser data-slider-position si présent
    const positionAttr = placeholder.getAttribute('data-slider-position');
    if (positionAttr) {
      const position = parseInt(positionAttr);
      if (position >= 1 && position <= 3) return position;
    }

    // Fallback: classes is-1, is-2, is-3
    if (placeholder.classList.contains('is-1')) return 1;
    if (placeholder.classList.contains('is-2')) return 2;
    if (placeholder.classList.contains('is-3')) return 3;

    // Dernier fallback: position dans le parent
    const parent = placeholder.parentNode;
    if (!parent) return 1;

    const allPlaceholders = Array.from(
      parent.querySelectorAll('.pricing_main_highlight_placeholder')
    );
    const index = allPlaceholders.indexOf(placeholder);
    return Math.max(1, Math.min(3, index + 1));
  }

  /**
   * Simule un clic sur le slider Finsweet pour déplacer le handle
   */
  function moveSliderTo(value) {
    const track = document.querySelector('[fs-rangeslider-element="track"]');
    const wrapper = document.querySelector('[fs-rangeslider-element="wrapper"]');

    if (!track || !wrapper) return;

    const min = parseInt(wrapper.getAttribute('fs-rangeslider-min') || '1');
    const max = parseInt(wrapper.getAttribute('fs-rangeslider-max') || '3');

    // Calculer la position du clic sur le track
    const trackRect = track.getBoundingClientRect();
    const percentage = (value - min) / (max - min);
    const clickX = trackRect.left + trackRect.width * percentage;
    const clickY = trackRect.top + trackRect.height / 2;

    // Finsweet écoute mousedown + mouseup (pas click)
    const mouseDown = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: clickX,
      clientY: clickY,
      view: window,
    });

    const mouseUp = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      clientX: clickX,
      clientY: clickY,
      view: window,
    });

    track.dispatchEvent(mouseDown);
    track.dispatchEvent(mouseUp);
  }

  /**
   * Setup les clics sur les placeholders du slider
   */
  function setupPlaceholderClicks() {
    const placeholders = document.querySelectorAll('.pricing_main_highlight_placeholder');

    placeholders.forEach((placeholder) => {
      placeholder.addEventListener('click', () => {
        const value = determineSliderValue(placeholder);
        moveSliderTo(value);
      });
    });
  }

  // ===========================================
  // INITIALIZATION
  // ===========================================

  function init() {
    console.log('🚀 Initializing Humanlinker Pricing...');

    // Cache les éléments DOM
    cacheElements();

    // Vérifier que les éléments essentiels existent
    if (!elements.priceMonthly) {
      console.warn('⚠️ Element [data-price-monthly] not found');
    }
    if (!elements.sliderHandle) {
      console.warn('⚠️ Slider handle not found');
    }

    // Setup listeners
    setupCurrencyListener();
    setupSliderObserver();
    setupUserDropdownListeners();
    setupPlaceholderClicks();

    // Affichage initial
    updateDisplay();

    // Exposer l'API pour debug
    window.HumanlinkerPricingNew = {
      getState: () => ({ ...state }),
      setState: (newState) => {
        Object.assign(state, newState);
        updateDisplay();
      },
      refresh: () => {
        cacheElements();
        updateDisplay();
      },
    };

    console.log('✅ Humanlinker Pricing initialized');
  }

  // ===========================================
  // BOOTSTRAP
  // ===========================================

  // Attendre que Finsweet soit prêt
  if (typeof window.fsAttributes === 'undefined') {
    window.fsAttributes = [];
  }

  window.fsAttributes.push([
    'rangeslider',
    () => {
      setTimeout(init, 100);
    },
  ]);

  // Fallback si Finsweet ne charge pas
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        if (!window.HumanlinkerPricingNew) {
          init();
        }
      }, 1000);
    });
  } else {
    setTimeout(() => {
      if (!window.HumanlinkerPricingNew) {
        init();
      }
    }, 1000);
  }
})();
