import { CSS_CLASSES, DATA_ATTRIBUTES } from './constants';
import type { BillingPeriod } from './types';

/**
 * Manages billing period tab switching
 */
export class BillingPeriodManager {
  private currentPeriod: BillingPeriod = 'monthly';
  private tabsContent: HTMLElement | null = null;
  private observer: MutationObserver | null = null;
  private onChangeCallbacks: Array<(period: BillingPeriod) => void> = [];

  constructor() {
    this.init();
  }

  /**
   * Initialize billing period detection
   */
  private init(): void {
    this.detectCurrentPeriod();
    this.setupTabObserver();
  }

  /**
   * Detect current billing period from active tab
   */
  private detectCurrentPeriod(): BillingPeriod {
    const activeTab = document.querySelector(
      `[${DATA_ATTRIBUTES.PRICING_PERIOD}].${CSS_CLASSES.TAB_CURRENT}`
    );

    if (activeTab) {
      const period = activeTab.getAttribute(DATA_ATTRIBUTES.PRICING_PERIOD);
      if (period === 'monthly' || period === 'quarterly' || period === 'annual') {
        this.currentPeriod = period;
      }
    }

    return this.currentPeriod;
  }

  /**
   * Setup observer for tab changes
   */
  private setupTabObserver(): void {
    this.tabsContent = document.querySelector(`.${CSS_CLASSES.TAB_PANE}`);

    if (!this.tabsContent) return;

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type !== 'attributes') return;

        const target = mutation.target as HTMLElement;
        if (
          target.classList.contains(CSS_CLASSES.TAB_PANE) &&
          target.classList.contains(CSS_CLASSES.TAB_ACTIVE)
        ) {
          const previousPeriod = this.currentPeriod;
          this.detectCurrentPeriod();

          if (previousPeriod !== this.currentPeriod) {
            this.notifyChange(this.currentPeriod);
          }
        }
      });
    });

    const tabContentWrapper = document.querySelector('.w-tab-content');
    if (tabContentWrapper) {
      this.observer.observe(tabContentWrapper, {
        attributes: true,
        attributeFilter: ['class', 'style'],
        subtree: true,
      });
    }
  }

  /**
   * Get current billing period
   */
  public getPeriod(): BillingPeriod {
    return this.currentPeriod;
  }

  /**
   * Get the active tab pane element
   */
  public getActiveTabPane(): HTMLElement | null {
    return (
      document.querySelector(`.${CSS_CLASSES.TAB_PANE}.${CSS_CLASSES.TAB_ACTIVE}`) ||
      document.querySelector(`.${CSS_CLASSES.TAB_PANE}[aria-hidden="false"]`)
    );
  }

  /**
   * Register a callback for period changes
   */
  public onChange(callback: (period: BillingPeriod) => void): void {
    this.onChangeCallbacks.push(callback);
  }

  /**
   * Notify all callbacks of period change
   */
  private notifyChange(period: BillingPeriod): void {
    this.onChangeCallbacks.forEach((callback) => callback(period));
  }

  /**
   * Destroy and cleanup
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
