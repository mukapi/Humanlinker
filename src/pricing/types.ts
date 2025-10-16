/**
 * Types for the pricing system
 */

/**
 * Supported currency codes
 */
export type CurrencyCode = 'EUR' | 'USD' | 'GBP';

/**
 * Allowed pricing tiers (number of credits/phones)
 */
export type PricingTier = 100 | 200 | 350 | 600;

/**
 * Price mapping structure for all currencies and tiers
 */
export type PriceMapping = Record<CurrencyCode, Record<PricingTier, number>>;

/**
 * Currency display information
 */
export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
}

/**
 * Slider position configuration
 */
export interface SliderPosition {
  value: PricingTier;
  fillPercent: number;
  handlePercent: number;
}

/**
 * Slider configuration options
 */
export interface SliderConfig {
  handleSelector: string;
  trackSelector: string;
  fillSelector: string;
  displaySelector: string;
  allowedValues: readonly PricingTier[];
  positions: Record<PricingTier, SliderPosition>;
}

/**
 * Pricing display elements
 */
export interface PricingElements {
  handle?: HTMLElement;
  track?: HTMLElement;
  fill?: HTMLElement;
  displayValue?: HTMLElement;
  priceDisplay?: HTMLElement;
  countDisplays?: NodeListOf<HTMLElement>;
  currencySelector?: HTMLSelectElement;
}

