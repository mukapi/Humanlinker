import { CURRENCIES, DATA_ATTRIBUTES, DEFAULT_CURRENCY } from './constants';
import type { CurrencyCode } from './types';

/**
 * Manages currency selection and conversion
 */
export class CurrencyManager {
  private currentCurrency: CurrencyCode = DEFAULT_CURRENCY;
  private currencySelector: HTMLSelectElement | null = null;
  private onChangeCallbacks: Array<(currency: CurrencyCode) => void> = [];

  constructor() {
    this.init();
  }

  /**
   * Initialize the currency manager
   */
  private init(): void {
    this.detectCurrentCurrency();
    this.setupCurrencySelector();
  }

  /**
   * Detect the current currency from the selector
   */
  private detectCurrentCurrency(): void {
    this.currencySelector = document.querySelector(`[${DATA_ATTRIBUTES.CURRENCY_SELECTOR}]`);

    if (this.currencySelector?.value) {
      const code = this.extractCurrencyCode(this.currencySelector.value);
      if (code) {
        this.currentCurrency = code;
      }
    }
  }

  /**
   * Extract currency code from selector value
   */
  private extractCurrencyCode(selectValue: string): CurrencyCode | null {
    const currency = Object.values(CURRENCIES).find((c) => c.label === selectValue);
    return currency?.code || null;
  }

  /**
   * Setup currency selector event listener
   */
  private setupCurrencySelector(): void {
    if (!this.currencySelector) return;

    this.currencySelector.addEventListener('change', () => {
      if (!this.currencySelector) return;

      const newCurrency = this.extractCurrencyCode(this.currencySelector.value);
      if (newCurrency) {
        this.setCurrency(newCurrency);
      }
    });
  }

  /**
   * Get the current currency
   */
  public getCurrency(): CurrencyCode {
    return this.currentCurrency;
  }

  /**
   * Set the currency programmatically
   */
  public setCurrency(currency: CurrencyCode): void {
    this.currentCurrency = currency;

    // Update selector if it exists
    if (this.currencySelector) {
      const matchingOption = Array.from(this.currencySelector.options).find(
        (option) => this.extractCurrencyCode(option.value) === currency
      );

      if (matchingOption) {
        this.currencySelector.value = matchingOption.value;
      }
    }

    // Notify all callbacks
    this.onChangeCallbacks.forEach((callback) => callback(currency));
  }

  /**
   * Register a callback for currency changes
   */
  public onChange(callback: (currency: CurrencyCode) => void): void {
    this.onChangeCallbacks.push(callback);
  }

  /**
   * Get currency symbol
   */
  public getCurrencySymbol(currency?: CurrencyCode): string {
    return CURRENCIES[currency || this.currentCurrency].symbol;
  }
}
