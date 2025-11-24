import type { CurrencyCode } from './types';

/**
 * Detects language and suggests appropriate currency
 */
export class LanguageDetector {
  private htmlObserver: MutationObserver | null = null;
  private onLanguageChangeCallbacks: Array<(currency: CurrencyCode) => void> = [];

  constructor() {
    this.init();
  }

  /**
   * Initialize language detection
   */
  private init(): void {
    this.setupLanguageObserver();
  }

  /**
   * Detect current language and get suggested currency
   * Always returns EUR as default, regardless of language
   */
  public detectCurrency(): CurrencyCode {
    // Always default to EUR regardless of language
    // Users can still manually change currency via selector
    return 'EUR';
  }

  /**
   * Setup observer for HTML lang attribute changes
   * Observer is disabled - currency no longer changes with language
   */
  private setupLanguageObserver(): void {
    // Observer disabled - we always stay on EUR by default
    // Users must manually change currency if desired
    return;
  }

  /**
   * Register a callback for language changes
   * Note: callback will never be triggered since observer is disabled
   */
  public onChange(callback: (currency: CurrencyCode) => void): void {
    this.onLanguageChangeCallbacks.push(callback);
  }

  /**
   * Destroy and cleanup
   */
  public destroy(): void {
    if (this.htmlObserver) {
      this.htmlObserver.disconnect();
      this.htmlObserver = null;
    }
  }
}
