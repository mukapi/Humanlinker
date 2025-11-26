import { BLACK_FRIDAY_ENABLED } from './constants';
import type { BillingPeriod } from './types';

/**
 * Manages Black Friday specific styling changes based on billing period
 * Only active when BLACK_FRIDAY_ENABLED is true
 */
export class BlackFridayStylingManager {
  private highlightTab: HTMLElement | null = null;
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
    // Cache the highlight tab element
    this.highlightTab = document.querySelector('.pricing_main_tab_item.is-highlight');

    // Cache all badge elements
    this.badges = document.querySelectorAll('.pricing_main_badge');
  }

  /**
   * Handle billing period changes
   * Called when user switches between monthly/quarterly/annual tabs
   */
  public onPeriodChange(period: BillingPeriod): void {
    if (!BLACK_FRIDAY_ENABLED) return;

    if (period === 'annual') {
      this.restoreAnnualStyles();
    } else {
      // monthly or quarterly
      this.applyNonAnnualStyles();
    }
  }

  /**
   * Restore styles when annual tab is selected
   */
  private restoreAnnualStyles(): void {
    // Restore is-bw class on highlight tab
    if (this.highlightTab && !this.highlightTab.classList.contains('is-bw')) {
      this.highlightTab.classList.add('is-bw');
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
    // Remove is-bw class from highlight tab
    if (this.highlightTab && this.highlightTab.classList.contains('is-bw')) {
      this.highlightTab.classList.remove('is-bw');
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
    this.highlightTab = null;
    this.badges = null;
  }
}
