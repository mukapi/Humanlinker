import {
  BILLING_DISCOUNTS,
  BLACK_FRIDAY_ENABLED,
  BLACK_FRIDAY_PRICES,
  CURRENCIES,
  FEATURE_FLAGS,
  PRO_PLANS,
} from './constants';
import type { BillingPeriod, PricingResult, PricingState, UserCount } from './types';

/**
 * Calculate pricing based on current state
 */
export class PlanCalculator {
  /**
   * Calculate all pricing details for the current state
   */
  public calculate(state: PricingState): PricingResult {
    const plan = PRO_PLANS[state.currentPlan];
    const users = state.currentUsers[state.billingPeriod];
    const currency = CURRENCIES[state.currency];

    // Calculate base monthly price per user in EUR
    const pricePerUser = plan.price;
    const originalMonthlyPrice = pricePerUser * users;

    // Apply billing period discount or Black Friday pricing
    let discountedPrice = originalMonthlyPrice;
    let hasDiscount = false;
    let convertedPrice: number;
    let convertedOriginalPrice: number;

    // Black Friday: use fixed prices for annual billing only
    const planKey = state.currentPlan as 1 | 2 | 3;
    if (
      BLACK_FRIDAY_ENABLED &&
      state.billingPeriod === 'annual' &&
      planKey in BLACK_FRIDAY_PRICES
    ) {
      // Use fixed Black Friday price (already per user per month)
      convertedPrice = Math.round(BLACK_FRIDAY_PRICES[planKey][state.currency] * users);
      convertedOriginalPrice = Math.round(originalMonthlyPrice * currency.exchangeRate);
      hasDiscount = true;
    } else {
      // Normal pricing logic
      if (state.billingPeriod === 'annual') {
        discountedPrice = Math.round(originalMonthlyPrice * BILLING_DISCOUNTS.annual);
        hasDiscount = true;
      } else if (state.billingPeriod === 'quarterly') {
        discountedPrice = Math.round(originalMonthlyPrice * BILLING_DISCOUNTS.quarterly);
        hasDiscount = true;
      }

      // Convert to selected currency
      convertedPrice = Math.round(discountedPrice * currency.exchangeRate);
      convertedOriginalPrice = Math.round(originalMonthlyPrice * currency.exchangeRate);
    }

    // Calculate features (multiplied by users, credits are PER MONTH regardless of billing period)
    const creditsIA = plan.creditsIA * users;
    const enrichissements = plan.enrichissementsEmails * users;
    const recommendations = plan.recommendationsContacts * users;

    // Email count depends on feature flag
    const boitesEmail = FEATURE_FLAGS.dynamicEmailCount ? plan.boitesEmail : 1;

    return {
      planName: plan.name,
      monthlyPrice: convertedPrice,
      originalPrice: convertedOriginalPrice,
      hasDiscount,
      currency: state.currency,
      currencySymbol: currency.symbol,
      users,
      creditsIA,
      boitesEmail,
      comptesLinkedin: plan.comptesLinkedin,
      enrichissementsEmails: enrichissements,
      recommendationsContacts: recommendations,
      contactsPersonnalises: plan.contactsPersonnalises,
      contactsAnalysables: plan.contactsAnalysables,
      billingPeriod: state.billingPeriod,
    };
  }

  /**
   * Get discount percentage for a billing period
   */
  public getDiscountPercentage(period: BillingPeriod): number {
    if (period === 'annual') {
      return Math.round((1 - BILLING_DISCOUNTS.annual) * 100);
    }
    if (period === 'quarterly') {
      return Math.round((1 - BILLING_DISCOUNTS.quarterly) * 100);
    }
    return 0;
  }

  /**
   * Format user count for display
   */
  public formatUserCount(count: UserCount, locale: 'fr' | 'en' = 'fr'): string {
    if (locale === 'fr') {
      return `Jusqu'à ${count} utilisateur${count > 1 ? 's' : ''}`;
    }
    return `Up to ${count} user${count > 1 ? 's' : ''}`;
  }
}
