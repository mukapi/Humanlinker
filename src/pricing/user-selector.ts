import type { BillingPeriod, UserCount } from './types';
import { CSS_CLASSES, DATA_ATTRIBUTES } from './constants';

/**
 * Manages user count selection from dropdown
 */
export class UserSelector {
  private currentUsers: Record<BillingPeriod, UserCount> = {
    monthly: 1,
    quarterly: 1,
    annual: 1,
  };
  private onChangeCallbacks: Array<(users: UserCount, period: BillingPeriod) => void> = [];

  constructor() {
    this.init();
  }

  /**
   * Initialize user selector
   */
  private init(): void {
    this.setupDropdownListeners();
  }

  /**
   * Setup dropdown item click listeners
   */
  private setupDropdownListeners(): void {
    const userItems = document.querySelectorAll<HTMLElement>(
      `.${CSS_CLASSES.DROPDOWN_LIST_ITEM}`
    );

    userItems.forEach((item) => {
      item.addEventListener('click', () => this.handleUserSelect(item));
    });
  }

  /**
   * Handle user count selection
   */
  private handleUserSelect(item: HTMLElement): void {
    const userValue = parseInt(item.getAttribute(DATA_ATTRIBUTES.USER_VALUE) || '1');

    if (userValue < 1 || userValue > 10) return;

    const users = userValue as UserCount;

    // Determine which period we're in
    const period = this.getCurrentPeriod();

    // Update internal state
    this.currentUsers[period] = users;

    // Update UI
    this.updateDropdownUI(item);
    this.updateDropdownLabel(item);

    // Close dropdown
    this.closeDropdown(item);

    // Notify callbacks
    this.notifyChange(users, period);
  }

  /**
   * Get current billing period (helper)
   */
  private getCurrentPeriod(): BillingPeriod {
    const activeTab = document.querySelector(
      `[${DATA_ATTRIBUTES.PRICING_PERIOD}].${CSS_CLASSES.TAB_CURRENT}`
    );

    if (activeTab) {
      const period = activeTab.getAttribute(DATA_ATTRIBUTES.PRICING_PERIOD);
      if (period === 'monthly' || period === 'quarterly' || period === 'annual') {
        return period;
      }
    }

    return 'monthly';
  }

  /**
   * Update dropdown UI (active state)
   */
  private updateDropdownUI(selectedItem: HTMLElement): void {
    const dropdown = selectedItem.closest(`.${CSS_CLASSES.DROPDOWN}`);

    if (dropdown) {
      // Remove active class from all items in this dropdown
      const siblingItems = dropdown.querySelectorAll(`.${CSS_CLASSES.DROPDOWN_LIST_ITEM}`);
      siblingItems.forEach((el) => el.classList.remove(CSS_CLASSES.DROPDOWN_ACTIVE));
    } else {
      // Fallback: remove from all dropdowns
      document
        .querySelectorAll(`.${CSS_CLASSES.DROPDOWN_LIST_ITEM}`)
        .forEach((el) => el.classList.remove(CSS_CLASSES.DROPDOWN_ACTIVE));
    }

    // Add active class to selected item
    selectedItem.classList.add(CSS_CLASSES.DROPDOWN_ACTIVE);
  }

  /**
   * Update dropdown label with selected value
   */
  private updateDropdownLabel(selectedItem: HTMLElement): void {
    const userLabel = selectedItem.querySelector(`[${DATA_ATTRIBUTES.USER_LABEL}]`);
    const dropdown = selectedItem.closest(`.${CSS_CLASSES.DROPDOWN}`);

    if (userLabel && dropdown) {
      const dropdownLabel = dropdown.querySelector(`[${DATA_ATTRIBUTES.DROPDOWN_LABEL}]`);
      if (dropdownLabel) {
        dropdownLabel.textContent = userLabel.textContent;
      }
    }
  }

  /**
   * Close dropdown
   */
  private closeDropdown(item: HTMLElement): void {
    const dropdown = item.closest(`.${CSS_CLASSES.DROPDOWN}`);

    if (!dropdown) return;

    const dropdownList = dropdown.querySelector(`.${CSS_CLASSES.DROPDOWN_LIST}`);
    if (dropdownList) {
      dropdownList.classList.remove(CSS_CLASSES.DROPDOWN_OPEN);
    }

    const dropdownToggle = dropdown.querySelector(`.${CSS_CLASSES.DROPDOWN_TOGGLE}`);
    if (dropdownToggle) {
      dropdownToggle.setAttribute('aria-expanded', 'false');
      dropdownToggle.classList.remove(CSS_CLASSES.DROPDOWN_OPEN);
    }
  }

  /**
   * Get current user count for a period
   */
  public getUserCount(period: BillingPeriod): UserCount {
    return this.currentUsers[period];
  }

  /**
   * Set user count programmatically
   */
  public setUserCount(users: UserCount, period: BillingPeriod): void {
    this.currentUsers[period] = users;
    this.notifyChange(users, period);
  }

  /**
   * Register a callback for user count changes
   */
  public onChange(callback: (users: UserCount, period: BillingPeriod) => void): void {
    this.onChangeCallbacks.push(callback);
  }

  /**
   * Notify all callbacks of user count change
   */
  private notifyChange(users: UserCount, period: BillingPeriod): void {
    this.onChangeCallbacks.forEach((callback) => callback(users, period));
  }
}

