import { CSS_CLASSES, SLIDER_SELECTORS } from './constants';
import type { SliderValue } from './types';

/**
 * Controls the pricing plan slider
 */
export class SliderController {
  private currentValue: SliderValue = 1;
  private observers: MutationObserver[] = [];
  private onChangeCallbacks: Array<(value: SliderValue) => void> = [];

  constructor() {
    this.init();
  }

  /**
   * Initialize slider observation
   */
  private init(): void {
    this.observeActiveSlider();
  }

  /**
   * Observe slider changes in the active tab
   */
  private observeActiveSlider(): void {
    // Clean up existing observers
    this.cleanup();

    setTimeout(() => {
      const activeTabPane = this.getActiveTabPane();
      if (!activeTabPane) return;

      const sliderHandles = activeTabPane.querySelectorAll<HTMLElement>(SLIDER_SELECTORS.HANDLE);

      sliderHandles.forEach((handle) => {
        // Get initial value
        const initialValue = this.getSliderValue(handle);
        if (initialValue !== this.currentValue) {
          this.currentValue = initialValue;
        }

        // Create observer for this handle
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-valuenow') {
              const newValue = this.getSliderValue(handle);

              if (newValue !== this.currentValue) {
                this.currentValue = newValue;
                this.notifyChange(newValue);
              }

              // Adjust card position for last value
              this.adjustCardPosition(handle, newValue);
            }
          });
        });

        observer.observe(handle, { attributes: true });
        this.observers.push(observer);
      });
    }, 50);
  }

  /**
   * Get slider value from handle
   */
  private getSliderValue(handle: HTMLElement): SliderValue {
    const value = parseInt(handle.getAttribute('aria-valuenow') || '1');
    // Clamp to 1-4 range
    return Math.max(1, Math.min(4, value)) as SliderValue;
  }

  /**
   * Adjust card position for edge cases
   */
  private adjustCardPosition(handle: HTMLElement, value: SliderValue): void {
    const card = handle.querySelector<HTMLElement>(`.${CSS_CLASSES.HIGHLIGHT_CARD}`);
    if (!card) return;

    // Adjust position for the last item
    card.style.left = value === 4 ? '-2.5rem' : '-1.5rem';
  }

  /**
   * Get active tab pane
   */
  private getActiveTabPane(): HTMLElement | null {
    return (
      document.querySelector(`.${CSS_CLASSES.TAB_PANE}.${CSS_CLASSES.TAB_ACTIVE}`) ||
      document.querySelector(`.${CSS_CLASSES.TAB_PANE}[aria-hidden="false"]`)
    );
  }

  /**
   * Get current slider value
   */
  public getValue(): SliderValue {
    return this.currentValue;
  }

  /**
   * Set slider value programmatically
   */
  public setValue(value: SliderValue): void {
    this.currentValue = value;

    const activeTabPane = this.getActiveTabPane();
    if (!activeTabPane) return;

    const handle = activeTabPane.querySelector<HTMLElement>(SLIDER_SELECTORS.HANDLE);
    if (handle) {
      handle.setAttribute('aria-valuenow', value.toString());
      this.adjustCardPosition(handle, value);
    }
  }

  /**
   * Register a callback for value changes
   */
  public onChange(callback: (value: SliderValue) => void): void {
    this.onChangeCallbacks.push(callback);
  }

  /**
   * Notify all callbacks of value change
   */
  private notifyChange(value: SliderValue): void {
    this.onChangeCallbacks.forEach((callback) => callback(value));
  }

  /**
   * Reinitialize slider observers (useful after tab change)
   */
  public reinit(): void {
    this.observeActiveSlider();
  }

  /**
   * Clean up observers
   */
  private cleanup(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  /**
   * Destroy and cleanup
   */
  public destroy(): void {
    this.cleanup();
  }
}
