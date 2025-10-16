import type {
  BillingPeriod,
  CurrencyCode,
  PricingResult,
  PricingState,
  UserCount,
} from './types';
import { BILLING_DISCOUNTS, CURRENCIES, FEATURE_FLAGS, PRO_PLANS } from './constants';

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

    // Apply billing period discount
    let monthlyPrice = pricePerUser * users;

    if (state.billingPeriod === 'annual') {
      monthlyPrice = Math.round(monthlyPrice * BILLING_DISCOUNTS.annual);
    } else if (state.billingPeriod === 'quarterly') {
      monthlyPrice = Math.round(monthlyPrice * BILLING_DISCOUNTS.quarterly);
    }

    // Convert to selected currency
    const convertedPrice = Math.round(monthlyPrice * currency.exchangeRate);

    // Calculate features (multiplied by users, credits are PER MONTH regardless of billing period)
    const creditsIA = plan.creditsIA * users;
    const enrichissements = plan.enrichissementsEmails * users;
    const recommendations = plan.recommendationsContacts * users;

    // Email count depends on feature flag
    const boitesEmail = FEATURE_FLAGS.dynamicEmailCount ? plan.boitesEmail : 1;

    return {
      planName: plan.name,
      monthlyPrice: convertedPrice,
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

