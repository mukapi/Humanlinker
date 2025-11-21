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
 */
const SLIDER_CONFIG = {
  handle: '[fs-rangeslider-element="handle-3"]',
  displayValue: '[fs-rangeslider-element="display-value-3"]',
  min: 100,
  max: 600,
  step: 50,
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
   * Snap slider value to nearest valid tier
   * Maps any slider value to one of the 4 exact tiers: 100, 200, 350, 600
   */
  private snapToNearestTier(sliderValue: number): { credits: number; price: number } {
    // Define tier boundaries (midpoints between tiers)
    // 100 ← [100-150) | 200 ← [150-275) | 350 ← [275-475) | 600 ← [475-600]
    if (sliderValue < 150) return PHONE_PRICING_TIERS[0]; // 100 credits
    if (sliderValue < 275) return PHONE_PRICING_TIERS[1]; // 200 credits
    if (sliderValue < 475) return PHONE_PRICING_TIERS[2]; // 350 credits
    return PHONE_PRICING_TIERS[3]; // 600 credits
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
    const tier = this.snapToNearestTier(this.currentCredits);

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
