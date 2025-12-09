import type {
  BillingDiscount,
  CurrencyCode,
  CurrencyInfo,
  PlanFeatures,
  SliderValue,
} from './types';

/**
 * Pro plans configuration (1-3 on slider = Pro 1-3)
 */
export const PRO_PLANS: Record<SliderValue, PlanFeatures> = {
  1: {
    name: 'Pro 1',
    price: 69, // EUR per user per month
    creditsIA: 200,
    boitesEmail: 2,
    comptesLinkedin: 1,
    enrichissementsEmails: 200,
    recommendationsContacts: 800,
    contactsPersonnalises: 200,
    contactsAnalysables: '200',
  },
  2: {
    name: 'Pro 2',
    price: 99,
    creditsIA: 350,
    boitesEmail: 3,
    comptesLinkedin: 1,
    enrichissementsEmails: 350,
    recommendationsContacts: 1400,
    contactsPersonnalises: 200,
    contactsAnalysables: '300',
  },
  3: {
    name: 'Pro 3',
    price: 149,
    creditsIA: 600,
    boitesEmail: 4,
    comptesLinkedin: 1,
    enrichissementsEmails: 600,
    recommendationsContacts: 2400,
    contactsPersonnalises: 200,
    contactsAnalysables: '500',
  },
  4: {
    name: 'Pro 3', // Fallback for slider value 4
    price: 149,
    creditsIA: 600,
    boitesEmail: 4,
    comptesLinkedin: 1,
    enrichissementsEmails: 600,
    recommendationsContacts: 2400,
    contactsPersonnalises: 200,
    contactsAnalysables: '500',
  },
};

/**
 * Currency information with exchange rates from EUR
 */
export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  EUR: { code: 'EUR', symbol: '€', label: '€ EUR', exchangeRate: 1 },
  USD: { code: 'USD', symbol: '$', label: '$ USD', exchangeRate: 1.08 },
  GBP: { code: 'GBP', symbol: '£', label: 'Pound (£)', exchangeRate: 0.85 },
};

/**
 * Billing period discounts (normal pricing)
 */
export const BILLING_DISCOUNTS: BillingDiscount = {
  quarterly: 0.9, // -10%
  annual: 0.8, // -20%
};

/**
 * ============================================================
 * BLACK FRIDAY CONFIGURATION
 * ============================================================
 * Set BLACK_FRIDAY_ENABLED to true to activate Black Friday pricing
 * Set to false to restore normal pricing after the promotion ends
 *
 * BLACK FRIDAY PRICES (annual plan only, fixed prices per currency):
 * - Pro 1 (200 AI credits): €34.5 / $39.7 / £30.4 per month
 * - Pro 2 (350 AI credits): €49.5 / $57.0 / £43.6 per month
 * - Pro 3 (600 AI credits): €74.5 / $85.8 / £65.7 per month
 *
 * NORMAL PRICES (calculated with 20% annual discount):
 * - Pro 1: €55.2 / $59.6 / £46.9 per month
 * - Pro 1: €55.2 / $59.6 / £46.9 per month
 * - Pro 2: €79.2 / $85.5 / £67.3 per month
 * - Pro 3: €119.2 / $128.7 / £101.3 per month
 * ============================================================
 */
export const BLACK_FRIDAY_ENABLED = false;

/**
 * Black Friday fixed prices per plan and currency (annual billing only)
 * These are the final monthly prices displayed to users
 */
export const BLACK_FRIDAY_PRICES: Record<1 | 2 | 3, Record<CurrencyCode, number>> = {
  1: { EUR: 34.5, USD: 39.7, GBP: 30.4 }, // Pro 1 - 200 AI credits
  2: { EUR: 49.5, USD: 57.0, GBP: 43.6 }, // Pro 2 - 350 AI credits
  3: { EUR: 74.5, USD: 85.8, GBP: 65.7 }, // Pro 3 - 600 AI credits
};

/**
 * Default currency
 */
export const DEFAULT_CURRENCY: CurrencyCode = 'EUR';

/**
 * Feature flags
 */
export const FEATURE_FLAGS = {
  dynamicEmailCount: true,
} as const;

/**
 * Data attributes for DOM elements
 */
export const DATA_ATTRIBUTES = {
  // Pricing attributes
  PLAN_NAME: 'data-plan-name',
  PLAN_PRICE: 'data-plan-price',
  PLAN_PRICE_ORIGINAL: 'data-plan-price-original',
  CREDITS_IA: 'data-credits-ia',
  BOITES_EMAIL: 'data-boites-email',
  COMPTES_LINKEDIN: 'data-comptes-linkedin',
  ENRICHISSEMENTS: 'data-enrichissements',
  RECOMMENDATIONS: 'data-recommendations',
  CONTACTS_PERSONNALISES: 'data-contacts-personnalises',
  CONTACTS_ANALYSABLES: 'data-contacts-analysables',
  USER_DISPLAY: 'data-user-display',
  USER_COUNT: 'data-user-count',
  USER_PLURAL: 'data-user-plural',
  FREE_PLAN_PRICE: 'data-free-plan-price',

  // Text variants
  BOITES_EMAIL_TEXT: 'data-boites-email-text',
  COMPTES_LINKEDIN_TEXT: 'data-comptes-linkedin-text',
  RECOMMENDATIONS_TEXT: 'data-recommendations-text',
  ENRICHISSEMENTS_TEXT: 'data-enrichissements-text',
  CREDITS_IA_TEXT: 'data-credits-ia-text',
  CONTACTS_PERSONNALISES_TEXT: 'data-contacts-personnalises-text',

  // Selectors
  CURRENCY_SELECTOR: 'data-currency-selector',
  PRICING_PERIOD: 'data-pricing-period',
  USER_VALUE: 'data-user-value',
  USER_LABEL: 'data-user-label',
  DROPDOWN_LABEL: 'data-dropdown-label',

  // Lottie
  LOTTIE: 'data-lottie',
  TIPPY_CONTENT: 'data-tippy-content',
} as const;

/**
 * CSS Classes
 */
export const CSS_CLASSES = {
  // Placeholder
  PLACEHOLDER: 'pricing_main_highlight_placeholder',
  RANGE_WRAPPER: 'pricing_main_highlight_range_wrap',
  HIGHLIGHT_CARD: 'pricing_main_highlight_card',

  // Tabs
  TAB_PANE: 'w-tab-pane',
  TAB_ACTIVE: 'w--tab-active',
  TAB_CURRENT: 'w--current',

  // Dropdown
  DROPDOWN: 'pricing_main_dropdown',
  DROPDOWN_LIST: 'w-dropdown-list',
  DROPDOWN_LIST_ITEM: 'pricing_main_dropdown_list_item',
  DROPDOWN_TOGGLE: 'w-dropdown-toggle',
  DROPDOWN_OPEN: 'w--open',
  DROPDOWN_ACTIVE: 'is-active',

  // Currency
  CURRENCY_SELECT: 'pricing_currency_select',

  // Misc
  PRICE_CONTAINER: 'pricing_main_tab_card_title',
} as const;

/**
 * Finsweet Range Slider selectors
 */
export const SLIDER_SELECTORS = {
  HANDLE: '[fs-rangeslider-element="handle"]',
  TRACK: '[fs-rangeslider-element="track"]',
  FILL: '[fs-rangeslider-element="fill"]',
  WRAPPER: '[fs-rangeslider-element="wrapper"]',
  DISPLAY_VALUE: '[fs-rangeslider-element="display-value"]',
} as const;
