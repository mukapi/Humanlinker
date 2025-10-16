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
   */
  public detectCurrency(): CurrencyCode {
    const htmlTag = document.documentElement;
    const currentLang = htmlTag.getAttribute('lang') || '';

    if (currentLang.startsWith('fr')) {
      return 'EUR';
    } else if (currentLang === 'en' || currentLang.startsWith('en-US')) {
      return 'USD';
    } else if (currentLang === 'en-GB') {
      return 'GBP';
    }

    // Default to EUR
    return 'EUR';
  }

  /**
   * Setup observer for HTML lang attribute changes
   */
  private setupLanguageObserver(): void {
    const htmlTag = document.documentElement;

    this.htmlObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
          const newCurrency = this.detectCurrency();
          this.notifyChange(newCurrency);
        }
      });
    });

    this.htmlObserver.observe(htmlTag, { attributes: true });
  }

  /**
   * Register a callback for language changes
   */
  public onChange(callback: (currency: CurrencyCode) => void): void {
    this.onLanguageChangeCallbacks.push(callback);
  }

  /**
   * Notify all callbacks of language change
   */
  private notifyChange(currency: CurrencyCode): void {
    this.onLanguageChangeCallbacks.forEach((callback) => callback(currency));
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

