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

      // Setup placeholder clicks for quick position selection
      this.setupPlaceholderClicks();

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

    // Override Finsweet display-value (it overwrites our value, so we delay to win)
    setTimeout(() => {
      countElements.forEach((element) => {
        element.textContent = String(tier.credits);
      });
    }, 10);
  }

  /**
   * Setup MutationObserver to watch slider changes
   */
  private setupObserver(): void {
    if (!this.handle) return;

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-valuenow') {
          const newPosition = this.getSliderValue();
          const tier = this.getTierFromPosition(newPosition);

          // eslint-disable-next-line no-console
          console.log(
            `📍 Slider moved: position=${newPosition}, credits=${tier.credits}, price=${tier.price}€`
          );

          if (newPosition !== this.currentCredits) {
            this.currentCredits = newPosition;
            this.updateDisplay();
          }
        }
      });
    });

    this.observer.observe(this.handle, { attributes: true });
  }

  /**
   * Setup placeholder click handlers for quick position selection
   */
  private setupPlaceholderClicks(): void {
    // Find placeholders within the phone credits slider section
    const rangeWrapper = this.handle?.closest('.pricing_main_highlight_range_wrap');
    if (!rangeWrapper) return;

    const placeholders = rangeWrapper.querySelectorAll<HTMLElement>(
      '.pricing_main_highlight_placeholder'
    );

    placeholders.forEach((placeholder) => {
      placeholder.style.cursor = 'pointer';
      placeholder.addEventListener('click', () => this.handlePlaceholderClick(placeholder));
    });
  }

  /**
   * Handle placeholder click - move slider to that position
   */
  private handlePlaceholderClick(placeholder: HTMLElement): void {
    const position = this.getPositionFromPlaceholder(placeholder);
    if (!this.handle) return;

    // Find the track element
    const track = this.handle.closest<HTMLElement>('[fs-rangeslider-element="track-3"]');
    if (!track) return;

    // Calculate click position on track (position 1-4 maps to 0%, 33%, 66%, 100%)
    const trackRect = track.getBoundingClientRect();
    const percentage = (position - 1) / 3;
    const clickX = trackRect.left + trackRect.width * percentage;
    const clickY = trackRect.top + trackRect.height / 2;

    // Finsweet listens to mousedown + mouseup (not click)
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

    // Update our display after Finsweet handles the events
    setTimeout(() => {
      this.currentCredits = position;
      this.updateDisplay();
    }, 50);
  }

  /**
   * Determine position (1-4) from placeholder classes
   */
  private getPositionFromPlaceholder(placeholder: HTMLElement): number {
    if (placeholder.classList.contains('is-1')) return 1;
    if (placeholder.classList.contains('is-2')) return 2;
    if (placeholder.classList.contains('is-4')) return 4; // Note: is-4 exists in your HTML

    // Fallback: determine from position in parent
    const parent = placeholder.parentNode;
    if (!parent) return 1;

    const allPlaceholders = Array.from(
      parent.querySelectorAll<HTMLElement>('.pricing_main_highlight_placeholder')
    );
    const index = allPlaceholders.indexOf(placeholder);

    return Math.max(1, Math.min(4, index + 1));
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
