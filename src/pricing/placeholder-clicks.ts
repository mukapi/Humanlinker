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
   * Works WITH Finsweet Range Slider instead of against it
   */
  private updateSlider(
    handle: HTMLElement,
    rangeWrapper: HTMLElement,
    value: PlaceholderPosition
  ): void {
    // Simply update the aria value - Finsweet will handle the rest
    handle.setAttribute('aria-valuenow', value.toString());

    // Dispatch change event to trigger Finsweet's internal update
    const changeEvent = new Event('change', { bubbles: true });
    handle.dispatchEvent(changeEvent);

    // Also dispatch input event for compatibility
    const inputEvent = new Event('input', { bubbles: true });
    handle.dispatchEvent(inputEvent);

    // Give Finsweet time to update, then adjust card position
    setTimeout(() => {
      this.adjustCardPosition(handle, value);
    }, 50);
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
