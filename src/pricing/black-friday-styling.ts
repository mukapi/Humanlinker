import { BLACK_FRIDAY_ENABLED } from './constants';
import type { BillingPeriod } from './types';

/**
 * Manages Black Friday specific styling changes based on billing period
 * Only active when BLACK_FRIDAY_ENABLED is true
 */
export class BlackFridayStylingManager {
  private highlightTabItems: NodeListOf<HTMLElement> | null = null;
  private highlightTabCards: NodeListOf<HTMLElement> | null = null;
  private highlightDiscount: HTMLElement | null = null;
  private badges: NodeListOf<HTMLElement> | null = null;

  constructor() {
    if (BLACK_FRIDAY_ENABLED) {
      this.init();
    }
  }

  /**
   * Initialize and cache DOM elements
   */
  private init(): void {
    // Cache ALL highlight tab item elements (there might be multiple - one per tab)
    this.highlightTabItems = document.querySelectorAll('.pricing_main_tab_item.is-highlight');

    // Cache ALL highlight tab card elements (there might be multiple - one per tab)
    // We'll handle all of them instead of just the first one
    this.highlightTabCards = document.querySelectorAll('.pricing_main_tab_card.is-highlight');

    // Cache the highlight discount element
    this.highlightDiscount = document.querySelector('.pricing_main_highlight_discount');

    // Cache all badge elements
    this.badges = document.querySelectorAll('.pricing_main_badge');
  }

  /**
   * Handle billing period changes
   * Called when user switches between monthly/quarterly/annual tabs
   */
  public onPeriodChange(period: BillingPeriod): void {
    if (!BLACK_FRIDAY_ENABLED) return;

    // Re-query elements to ensure we have the latest DOM state
    // This is important because Webflow tabs may recreate/move elements
    setTimeout(() => {
      this.init();

      if (period === 'annual') {
        this.restoreAnnualStyles();
      } else {
        // monthly or quarterly
        this.applyNonAnnualStyles();
      }
    }, 50);
  }

  /**
   * Restore styles when annual tab is selected
   */
  private restoreAnnualStyles(): void {
    // Restore is-bw class on ALL highlight tab items
    if (this.highlightTabItems) {
      this.highlightTabItems.forEach((item) => {
        if (!item.classList.contains('is-bw')) {
          item.classList.add('is-bw');
        }
      });
    }

    // Restore is-bw class on ALL highlight tab cards
    if (this.highlightTabCards) {
      this.highlightTabCards.forEach((card) => {
        if (!card.classList.contains('is-bw')) {
          card.classList.add('is-bw');
        }
      });
    }

    // Restore is-bw class on highlight discount
    if (this.highlightDiscount && !this.highlightDiscount.classList.contains('is-bw')) {
      this.highlightDiscount.classList.add('is-bw');
    }

    // Restore visibility on badges
    if (this.badges) {
      this.badges.forEach((badge) => {
        badge.style.visibility = 'visible';
      });
    }
  }

  /**
   * Apply styles when monthly or quarterly tab is selected
   */
  private applyNonAnnualStyles(): void {
    // Remove is-bw class from ALL highlight tab items
    if (this.highlightTabItems) {
      this.highlightTabItems.forEach((item) => {
        if (item.classList.contains('is-bw')) {
          item.classList.remove('is-bw');
        }
      });
    }

    // Remove is-bw class from ALL highlight tab cards
    if (this.highlightTabCards) {
      this.highlightTabCards.forEach((card) => {
        if (card.classList.contains('is-bw')) {
          card.classList.remove('is-bw');
        }
      });
    }

    // Remove is-bw class from highlight discount
    if (this.highlightDiscount && this.highlightDiscount.classList.contains('is-bw')) {
      this.highlightDiscount.classList.remove('is-bw');
    }

    // Hide badges
    if (this.badges) {
      this.badges.forEach((badge) => {
        badge.style.visibility = 'hidden';
      });
    }
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.highlightTabItems = null;
    this.highlightTabCards = null;
    this.highlightDiscount = null;
    this.badges = null;
  }
}
