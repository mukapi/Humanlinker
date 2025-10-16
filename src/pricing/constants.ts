import type { CurrencyCode, CurrencyInfo, PriceMapping, PricingTier } from './types';

/**
 * Exact prices according to the specifications
 */
export const PRICE_MAPPING: PriceMapping = {
  EUR: { 100: 47, 200: 90, 350: 150, 600: 252 },
  USD: { 100: 50, 200: 95, 350: 158, 600: 264 },
  GBP: { 100: 40, 200: 80, 350: 140, 600: 240 },
};

/**
 * Currency information with symbols
 */
export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  EUR: { code: 'EUR', symbol: '€', label: '€ EUR' },
  USD: { code: 'USD', symbol: '$', label: '$ USD' },
  GBP: { code: 'GBP', symbol: '£', label: 'Pound (£)' },
};

/**
 * Allowed discrete values for the pricing slider
 */
export const ALLOWED_VALUES: readonly PricingTier[] = [100, 200, 350, 600] as const;

/**
 * Exact fill percentages for each tier
 */
export const FILL_PERCENTAGES: Record<PricingTier, number> = {
  100: 0,
  200: 34,
  350: 68,
  600: 100,
};

/**
 * Exact handle positions for each tier (in percentage)
 */
export const HANDLE_POSITIONS: Record<PricingTier, number> = {
  100: 0,
  200: 33.33,
  350: 66.66,
  600: 100,
};

/**
 * Default currency
 */
export const DEFAULT_CURRENCY: CurrencyCode = 'EUR';

/**
 * Data attributes
 */
export const DATA_ATTRIBUTES = {
  PHONE_COUNT: 'data-phone-count',
  PHONE_PRICE: 'data-phone-price',
  CURRENCY_SELECTOR: 'data-currency-selector',
  CUSTOM_SLIDER_FILL: 'data-custom-slider-fill',
} as const;

/**
 * CSS Classes
 */
export const CSS_CLASSES = {
  PLACEHOLDER: 'pricing_main_highlight_placeholder',
  PRICE_CONTAINER: 'email_tabs_result_price',
  CURRENCY_SYMBOL: 'currency-symbol',
  RANGE_WRAPPER: 'pricing_main_highlight_range_wrap',
} as const;

