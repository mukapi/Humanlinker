import type { CurrencyCode, PricingTier, SliderConfig } from './types';
import { SliderManager } from './slider-manager';
import { CurrencyManager } from './currency-manager';
import { PRICE_MAPPING, DATA_ATTRIBUTES, CSS_CLASSES } from './constants';

/**
 * Configuration for pricing slider
 */
const PRICING_SLIDER_CONFIG: SliderConfig = {
  handleSelector: '[fs-rangeslider-element="handle-3"]',
  trackSelector: '[fs-rangeslider-element="track-3"]',
  fillSelector: '[data-custom-slider-fill]',
  displaySelector: '[fs-rangeslider-element="display-value-3"]',
  allowedValues: [100, 200, 350, 600],
  positions: {
    100: { value: 100, fillPercent: 0, handlePercent: 0 },
    200: { value: 200, fillPercent: 34, handlePercent: 33.33 },
    350: { value: 350, fillPercent: 68, handlePercent: 66.66 },
    600: { value: 600, fillPercent: 100, handlePercent: 100 },
  },
};

/**
 * Manages the pricing slider with currency conversion
 */
export class PricingSlider {
  private slider: SliderManager;
  private currencyManager: CurrencyManager;
  private priceDisplay: HTMLElement | null = null;
  private countDisplays: NodeListOf<HTMLElement> | null = null;

  constructor() {
    this.currencyManager = new CurrencyManager();
    this.slider = new SliderManager(PRICING_SLIDER_CONFIG);
    this.init();
  }

  /**
   * Initialize the pricing slider
   */
  private init(): void {
    this.priceDisplay = document.querySelector(`[${DATA_ATTRIBUTES.PHONE_PRICE}]`);
    this.countDisplays = document.querySelectorAll(`[${DATA_ATTRIBUTES.PHONE_COUNT}]`);

    // Listen to slider changes
    this.slider.onChange((value) => this.updateDisplay(value));

    // Listen to currency changes
    this.currencyManager.onChange(() => {
      const currentValue = this.slider.getCurrentValue();
      this.updateDisplay(currentValue);
    });

    // Initialize display
    this.updateDisplay(this.slider.getCurrentValue());
  }

  /**
   * Update all pricing displays
   */
  private updateDisplay(value: PricingTier): void {
    this.updateCountDisplays(value);
    this.updatePriceDisplay(value);
  }

  /**
   * Update count displays (e.g., "200 phones")
   */
  private updateCountDisplays(value: PricingTier): void {
    if (!this.countDisplays) return;

    this.countDisplays.forEach((el) => {
      el.textContent = value.toString();
    });
  }

  /**
   * Update price display with currency
   */
  private updatePriceDisplay(value: PricingTier): void {
    if (!this.priceDisplay) return;

    const currency = this.currencyManager.getCurrency();
    const price = this.getPrice(value, currency);

    // Update price
    this.priceDisplay.textContent = price.toString();

    // Update currency symbol
    this.updateCurrencySymbol(currency);
  }

  /**
   * Update or create currency symbol element
   */
  private updateCurrencySymbol(currency: CurrencyCode): void {
    if (!this.priceDisplay) return;

    const priceContainer = this.priceDisplay.closest(`.${CSS_CLASSES.PRICE_CONTAINER}`);
    if (!priceContainer) return;

    const symbol = this.currencyManager.getCurrencySymbol(currency);
    let symbolElement = priceContainer.querySelector(`.${CSS_CLASSES.CURRENCY_SYMBOL}`);

    if (symbolElement) {
      symbolElement.textContent = symbol;
    } else {
      symbolElement = document.createElement('span');
      symbolElement.classList.add(CSS_CLASSES.CURRENCY_SYMBOL);
      symbolElement.textContent = symbol;
      priceContainer.appendChild(symbolElement);
    }
  }

  /**
   * Get price for a specific tier and currency
   */
  private getPrice(value: PricingTier, currency: CurrencyCode): number {
    return PRICE_MAPPING[currency][value];
  }

  /**
   * Set currency programmatically
   */
  public setCurrency(currency: CurrencyCode): void {
    this.currencyManager.setCurrency(currency);
  }

  /**
   * Set slider value programmatically
   */
  public setValue(value: PricingTier): void {
    this.slider.setValue(value);
  }

  /**
   * Get current slider value
   */
  public getValue(): PricingTier {
    return this.slider.getCurrentValue();
  }

  /**
   * Get current currency
   */
  public getCurrency(): CurrencyCode {
    return this.currencyManager.getCurrency();
  }
}

