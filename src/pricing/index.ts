/**
 * Main entry point for the pricing system
 */

import { PricingSlider } from './pricing-slider';
import { PlaceholderClickManager } from './placeholder-clicks';
import type { CurrencyCode, PricingTier } from './types';

/**
 * Main pricing system controller
 */
class PricingSystem {
  private pricingSlider: PricingSlider | null = null;
  private placeholderManager: PlaceholderClickManager | null = null;

  /**
   * Initialize the pricing system
   */
  public init(): void {
    try {
      // Initialize pricing slider with currency management
      this.pricingSlider = new PricingSlider();
      console.log('✅ Pricing slider initialized');

      // Initialize placeholder clicks
      this.placeholderManager = new PlaceholderClickManager();
      console.log('✅ Placeholder click manager initialized');

      // Expose API to window for external access
      this.exposeAPI();
    } catch (error) {
      console.error('Failed to initialize pricing system:', error);
    }
  }

  /**
   * Expose public API to window object
   */
  private exposeAPI(): void {
    (window as any).HumanlinkerPricing = {
      setCurrency: (currency: CurrencyCode) => this.pricingSlider?.setCurrency(currency),
      setValue: (value: PricingTier) => this.pricingSlider?.setValue(value),
      getValue: () => this.pricingSlider?.getValue(),
      getCurrency: () => this.pricingSlider?.getCurrency(),
    };
  }

  /**
   * Destroy the pricing system
   */
  public destroy(): void {
    this.placeholderManager?.destroy();
    this.pricingSlider = null;
    this.placeholderManager = null;
  }
}

// Create singleton instance
const pricingSystem = new PricingSystem();

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => pricingSystem.init());
} else {
  pricingSystem.init();
}

// Also initialize on Webflow ready
window.Webflow ||= [];
window.Webflow.push(() => {
  pricingSystem.init();
  console.log('🚀 Humanlinker Pricing System ready');
});

// Export for potential module usage
export { PricingSystem, PricingSlider, PlaceholderClickManager };
export type { CurrencyCode, PricingTier };

