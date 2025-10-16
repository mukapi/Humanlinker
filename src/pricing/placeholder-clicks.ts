import { CSS_CLASSES } from './constants';

/**
 * Placeholder position mapping
 */
type PlaceholderPosition = 1 | 2 | 3 | 4;

/**
 * Manages clickable placeholders that control a slider
 */
export class PlaceholderClickManager {
  private placeholders: HTMLElement[] = [];
  private observer: MutationObserver | null = null;

  constructor() {
    this.init();
  }

  /**
   * Initialize placeholder click handlers
   */
  private init(): void {
    this.attachClickHandlers();
    this.setupMutationObserver();
    this.setupFinsweetCompatibility();
  }

  /**
   * Attach click handlers to all placeholders
   */
  private attachClickHandlers(): void {
    this.placeholders = Array.from(
      document.querySelectorAll<HTMLElement>(`.${CSS_CLASSES.PLACEHOLDER}`)
    );

    this.placeholders.forEach((placeholder) => {
      placeholder.addEventListener('click', () => this.handlePlaceholderClick(placeholder));
    });

    console.log(`Placeholders initialized: ${this.placeholders.length} found`);
  }

  /**
   * Handle placeholder click
   */
  private handlePlaceholderClick(placeholder: HTMLElement): void {
    const value = this.determineValue(placeholder);
    const rangeWrapper = placeholder.closest<HTMLElement>(`.${CSS_CLASSES.RANGE_WRAPPER}`);

    if (!rangeWrapper) {
      console.warn('Range wrapper not found');
      return;
    }

    const handle = rangeWrapper.querySelector<HTMLElement>('[fs-rangeslider-element="handle"]');

    if (!handle) {
      console.warn('Handle not found');
      return;
    }

    this.updateSlider(handle, rangeWrapper, value);
  }

  /**
   * Determine value from placeholder classes or position
   */
  private determineValue(placeholder: HTMLElement): PlaceholderPosition {
    // Check for is-1, is-2, is-3, is-4 classes
    if (placeholder.classList.contains('is-1')) return 1;
    if (placeholder.classList.contains('is-2')) return 2;
    if (placeholder.classList.contains('is-3')) return 3;
    if (placeholder.classList.contains('is-4')) return 4;

    // Fallback: determine from position in parent
    const parent = placeholder.parentNode;
    if (!parent) return 1;

    const allPlaceholders = Array.from(
      parent.querySelectorAll<HTMLElement>(`.${CSS_CLASSES.PLACEHOLDER}`)
    );
    const index = allPlaceholders.indexOf(placeholder);

    return Math.max(1, Math.min(4, index + 1)) as PlaceholderPosition;
  }

  /**
   * Update slider position and value
   */
  private updateSlider(
    handle: HTMLElement,
    rangeWrapper: HTMLElement,
    value: PlaceholderPosition
  ): void {
    // Update aria value
    handle.setAttribute('aria-valuenow', value.toString());

    // Update display value
    const displayValue = handle.querySelector<HTMLElement>(
      '[fs-rangeslider-element="display-value"]'
    );
    if (displayValue) {
      displayValue.textContent = value.toString();
    }

    // Calculate visual position
    const track = rangeWrapper.querySelector<HTMLElement>('[fs-rangeslider-element="track"]');
    if (!track) return;

    const trackWidth = track.offsetWidth;
    const wrapper = rangeWrapper.querySelector<HTMLElement>('[fs-rangeslider-element="wrapper"]');

    const min = parseInt(wrapper?.getAttribute('fs-rangeslider-min') || '1');
    const max = parseInt(wrapper?.getAttribute('fs-rangeslider-max') || '4');

    // Calculate position in pixels
    const range = max - min;
    const percentage = (value - min) / range;
    const position = trackWidth * percentage;

    // Update handle position
    handle.style.left = `${position}px`;

    // Update fill
    const fill = track.querySelector<HTMLElement>('[fs-rangeslider-element="fill"]');
    if (fill) {
      fill.style.width = `${position}px`;
    }

    // Dispatch input event to trigger any listeners
    const event = new Event('input', { bubbles: true });
    handle.dispatchEvent(event);

    // Adjust card position for last value
    this.adjustCardPosition(handle, value);

    // Trigger pricing update if function exists
    this.triggerPricingUpdate();
  }

  /**
   * Adjust card position for edge cases
   */
  private adjustCardPosition(handle: HTMLElement, value: PlaceholderPosition): void {
    const card = handle.querySelector<HTMLElement>('.pricing_main_highlight_card');
    if (!card) return;

    // Adjust position for the last item
    card.style.left = value === 4 ? '-2.5rem' : '-1.5rem';
  }

  /**
   * Trigger pricing update if function exists
   */
  private triggerPricingUpdate(): void {
    // Check if global update function exists
    if (typeof (window as any).updatePricingDisplay === 'function') {
      setTimeout(() => {
        (window as any).updatePricingDisplay();
      }, 10);
    }
  }

  /**
   * Setup mutation observer for dynamic content
   */
  private setupMutationObserver(): void {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) {
          return;
        }

        // Check if new placeholders were added
        const hasNewPlaceholders = Array.from(mutation.addedNodes).some((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return false;

          const element = node as HTMLElement;
          return (
            element.classList?.contains(CSS_CLASSES.PLACEHOLDER) ||
            element.querySelector?.(`.${CSS_CLASSES.PLACEHOLDER}`) !== null
          );
        });

        if (hasNewPlaceholders) {
          this.attachClickHandlers();
        }
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Setup compatibility with Finsweet attributes
   */
  private setupFinsweetCompatibility(): void {
    if (!(window as any).fsAttributes) return;

    (window as any).fsAttributes.push([
      'cmsload',
      () => {
        setTimeout(() => this.attachClickHandlers(), 300);
      },
    ]);
  }

  /**
   * Destroy the manager and clean up
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.placeholders = [];
  }
}
