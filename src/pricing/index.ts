/**
 * Main entry point for the Humanlinker pricing system
 * Manages Pro plans with dynamic pricing, user counts, billing periods, and currency conversion
 */

import { PlanCalculator } from './plan-calculator';
import { BillingPeriodManager } from './billing-period';
import { UserSelector } from './user-selector';
import { SliderController } from './slider-controller';
import { CurrencyManager } from './currency-manager';
import { LanguageDetector } from './language-detector';
import { PricingDisplay } from './pricing-display';
import { PlaceholderClickManager } from './placeholder-clicks';
import { TooltipManager } from './tooltips';
import type { CurrencyCode, PricingState, SliderValue, UserCount } from './types';

/**
 * Main pricing system orchestrator
 */
class PricingSystem {
  // Core managers
  private calculator: PlanCalculator | null = null;
  private currencyManager: CurrencyManager | null = null;
  private languageDetector: LanguageDetector | null = null;
  private billingPeriodManager: BillingPeriodManager | null = null;
  private userSelector: UserSelector | null = null;
  private sliderController: SliderController | null = null;
  private display: PricingDisplay | null = null;
  private placeholderManager: PlaceholderClickManager | null = null;
  private tooltipManager: TooltipManager | null = null;

  // Current state
  private state: PricingState = {
    currentPlan: 1,
    currentUsers: {
      monthly: 1,
      quarterly: 1,
      annual: 1,
    },
    billingPeriod: 'monthly',
    currency: 'EUR',
  };

  /**
   * Initialize the complete pricing system
   */
  public init(): void {
    try {
      // Initialize core components
      this.calculator = new PlanCalculator();
      this.display = new PricingDisplay();
      this.currencyManager = new CurrencyManager();
      this.languageDetector = new LanguageDetector();
      this.billingPeriodManager = new BillingPeriodManager();
      this.userSelector = new UserSelector();
      this.sliderController = new SliderController();
      this.placeholderManager = new PlaceholderClickManager();
      this.tooltipManager = new TooltipManager();

      // Set initial state from managers
      this.state.currency = this.languageDetector.detectCurrency();
      this.currencyManager.setCurrency(this.state.currency);
      this.state.billingPeriod = this.billingPeriodManager.getPeriod();
      this.state.currentPlan = this.sliderController.getValue();

      // Setup event listeners
      this.setupEventListeners();

      // Initial display update
      this.updateDisplay();

      // Expose API
      this.exposeAPI();

      console.log('✅ Humanlinker Pricing System initialized');
    } catch (error) {
      console.error('❌ Failed to initialize pricing system:', error);
    }
  }

  /**
   * Setup all event listeners
   */
  private setupEventListeners(): void {
    // Currency changes
    this.currencyManager?.onChange((currency) => {
      this.state.currency = currency;
      this.updateDisplay();
    });

    // Language changes
    this.languageDetector?.onChange((currency) => {
      this.currencyManager?.setCurrency(currency);
    });

    // Billing period changes
    this.billingPeriodManager?.onChange((period) => {
      this.state.billingPeriod = period;
      this.sliderController?.reinit(); // Reinit slider observers for new tab
      this.updateDisplay();
    });

    // User count changes
    this.userSelector?.onChange((users, period) => {
      this.state.currentUsers[period] = users;
      if (period === this.state.billingPeriod) {
        this.updateDisplay();
      }
    });

    // Plan slider changes
    this.sliderController?.onChange((value) => {
      this.state.currentPlan = value;
      this.updateDisplay();
    });
  }

  /**
   * Update the pricing display
   */
  private updateDisplay(): void {
    if (!this.calculator || !this.display) return;

    const result = this.calculator.calculate(this.state);
    this.display.update(result);
  }

  /**
   * Expose public API to window object
   */
  private exposeAPI(): void {
    (window as any).HumanlinkerPricing = {
      // Getters
      getCurrency: () => this.state.currency,
      getPlan: () => this.state.currentPlan,
      getUsers: () => this.state.currentUsers[this.state.billingPeriod],
      getBillingPeriod: () => this.state.billingPeriod,
      getState: () => ({ ...this.state }),

      // Setters
      setCurrency: (currency: CurrencyCode) => {
        this.currencyManager?.setCurrency(currency);
      },
      setPlan: (plan: SliderValue) => {
        this.sliderController?.setValue(plan);
      },
      setUsers: (users: UserCount) => {
        this.userSelector?.setUserCount(users, this.state.billingPeriod);
      },

      // Utilities
      refresh: () => {
        this.updateDisplay();
      },
      reinit: () => {
        this.init();
      },
    };

    console.log('✅ API exposed as window.HumanlinkerPricing');
  }

  /**
   * Destroy and cleanup
   */
  public destroy(): void {
    this.billingPeriodManager?.destroy();
    this.sliderController?.destroy();
    this.placeholderManager?.destroy();
    this.languageDetector?.destroy();

    this.calculator = null;
    this.currencyManager = null;
    this.languageDetector = null;
    this.billingPeriodManager = null;
    this.userSelector = null;
    this.sliderController = null;
    this.display = null;
    this.placeholderManager = null;
    this.tooltipManager = null;
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

// Finsweet attributes compatibility
if ((window as any).fsAttributes) {
  (window as any).fsAttributes.push([
    'cmsload',
    () => {
      setTimeout(() => pricingSystem.init(), 300);
    },
  ]);
}

// Export for module usage
export { PricingSystem };
export type { CurrencyCode, PricingState, SliderValue, UserCount };

