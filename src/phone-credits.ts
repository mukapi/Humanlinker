/**
 * Phone Credits Slider Manager
 * Manages the phone credits range slider with dynamic pricing
 * Updated: January 2025
 */

/**
 * Phone credits pricing tiers
 */
const PHONE_PRICING_TIERS = [
  { credits: 100, price: 47 },
  { credits: 200, price: 90 },
  { credits: 350, price: 150 },
  { credits: 600, price: 252 },
] as const;

/**
 * Finsweet slider configuration
 * Slider now uses 1-4 positions, mapped to credit tiers
 */
const SLIDER_CONFIG = {
  handle: '[fs-rangeslider-element="handle-3"]',
  displayValue: '[fs-rangeslider-element="display-value-3"]',
  min: 1,
  max: 4,
  step: 1,
} as const;

/**
 * Data attributes for DOM updates
 */
const DATA_ATTRIBUTES = {
  phoneCount: 'data-phone-count',
  phonePrice: 'data-phone-price',
} as const;

/**
 * Phone Credits Manager Class
 */
class PhoneCreditsManager {
  private handle: HTMLElement | null = null;
  private observer: MutationObserver | null = null;
  private currentCredits: number = SLIDER_CONFIG.min;

  /**
   * Initialize the phone credits manager
   */
  public init(): void {
    try {
      this.handle = document.querySelector(SLIDER_CONFIG.handle);

      if (!this.handle) {
        console.warn('⚠️ Phone credits slider handle not found');
        return;
      }

      // Get initial value
      this.currentCredits = this.getSliderValue();

      // Update display initially
      this.updateDisplay();

      // Setup observer for slider changes
      this.setupObserver();

      console.log('✅ Phone Credits Manager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize phone credits manager:', error);
    }
  }

  /**
   * Map slider position (1-4) to credit tier
   * Position 1 → 100 credits, 2 → 200, 3 → 350, 4 → 600
   */
  private getTierFromPosition(position: number): { credits: number; price: number } {
    const index = Math.max(0, Math.min(3, position - 1)); // Convert 1-4 to 0-3 index
    return PHONE_PRICING_TIERS[index];
  }

  /**
   * Get current slider value from handle
   */
  private getSliderValue(): number {
    if (!this.handle) return SLIDER_CONFIG.min;

    const value = parseInt(this.handle.getAttribute('aria-valuenow') || String(SLIDER_CONFIG.min));
    return Math.max(SLIDER_CONFIG.min, Math.min(SLIDER_CONFIG.max, value));
  }

  /**
   * Update all DOM elements with current values
   */
  private updateDisplay(): void {
    // Snap to nearest tier (exact 4 packs only)
    const tier = this.getTierFromPosition(this.currentCredits);

    // Update all elements with data-phone-count
    const countElements = document.querySelectorAll<HTMLElement>(`[${DATA_ATTRIBUTES.phoneCount}]`);
    countElements.forEach((element) => {
      element.textContent = String(tier.credits);
    });

    // Update all elements with data-phone-price
    const priceElements = document.querySelectorAll<HTMLElement>(`[${DATA_ATTRIBUTES.phonePrice}]`);
    priceElements.forEach((element) => {
      element.textContent = String(tier.price);
    });
  }

  /**
   * Setup MutationObserver to watch slider changes
   */
  private setupObserver(): void {
    if (!this.handle) return;

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-valuenow') {
          const newCredits = this.getSliderValue();

          if (newCredits !== this.currentCredits) {
            this.currentCredits = newCredits;
            this.updateDisplay();
          }
        }
      });
    });

    this.observer.observe(this.handle, { attributes: true });
  }

  /**
   * Destroy and cleanup
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.handle = null;
  }
}

// Create singleton instance
const phoneCreditsManager = new PhoneCreditsManager();

// Initialize when Finsweet is ready
let initialized = false;

// Listen for Finsweet Range Slider ready
if (!(window as any).fsAttributes) {
  (window as any).fsAttributes = [];
}

(window as any).fsAttributes.push([
  'rangeslider',
  () => {
    if (!initialized) {
      initialized = true;
      setTimeout(() => {
        phoneCreditsManager.init();
        console.log('🚀 Phone Credits Manager ready (after Finsweet)');
      }, 100);
    }
  },
]);

// Fallback: Initialize on Webflow ready
window.Webflow ||= [];
window.Webflow.push(() => {
  setTimeout(() => {
    if (!initialized) {
      initialized = true;
      phoneCreditsManager.init();
    }
  }, 500);
});

// Last fallback: DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (!initialized) {
        initialized = true;
        phoneCreditsManager.init();
      }
    }, 1000);
  });
} else {
  setTimeout(() => {
    if (!initialized) {
      initialized = true;
      phoneCreditsManager.init();
    }
  }, 1000);
}

// Export for module usage
export { PhoneCreditsManager };
