/**
 * Types for the pricing system
 */

/**
 * Supported currency codes
 */
export type CurrencyCode = 'EUR' | 'USD' | 'GBP';

/**
 * Billing period types
 */
export type BillingPeriod = 'monthly' | 'quarterly' | 'annual';

/**
 * Plan identifiers
 */
export type PlanId = 'free' | 'pro1' | 'pro2' | 'pro3' | 'business' | 'enterprise';

/**
 * Slider values (1-4 for Pro plans)
 */
export type SliderValue = 1 | 2 | 3 | 4;

/**
 * Number of users allowed
 */
export type UserCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Plan features and pricing
 */
export interface PlanFeatures {
  name: string;
  price: number; // Monthly price per user in EUR
  creditsIA: number;
  boitesEmail: number;
  comptesLinkedin: number;
  enrichissementsEmails: number;
  recommendationsContacts: number;
  contactsPersonnalises: number;
  contactsAnalysables: string;
}

/**
 * Currency display information
 */
export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
  exchangeRate: number; // Rate from EUR
}

/**
 * Billing discount configuration
 */
export interface BillingDiscount {
  quarterly: number; // e.g., 0.9 for -10%
  annual: number; // e.g., 0.8 for -20%
}

/**
 * Current pricing state
 */
export interface PricingState {
  currentPlan: SliderValue;
  currentUsers: Record<BillingPeriod, UserCount>;
  billingPeriod: BillingPeriod;
  currency: CurrencyCode;
}

/**
 * Calculated pricing result
 */
export interface PricingResult {
  planName: string;
  monthlyPrice: number;
  originalPrice: number; // Prix sans remise (pour l'affichage barré)
  hasDiscount: boolean; // true si quarterly ou annually
  currency: CurrencyCode;
  currencySymbol: string;
  users: UserCount;
  creditsIA: number;
  boitesEmail: number;
  comptesLinkedin: number;
  enrichissementsEmails: number;
  recommendationsContacts: number;
  contactsPersonnalises: number;
  contactsAnalysables: string;
  billingPeriod: BillingPeriod;
}

/**
 * Slider configuration options
 */
export interface SliderConfig {
  handleSelector: string;
  trackSelector: string;
  fillSelector?: string;
  displaySelector?: string;
  wrapperSelector?: string;
  min?: number;
  max?: number;
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

